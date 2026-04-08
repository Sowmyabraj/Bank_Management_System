import {
  Component,
  Input,
  OnInit,
  OnChanges
} from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AccountsService } from "../../services/accounts.service";
import { BehaviorSubject } from "rxjs";
import { Transaction } from "../../models/transaction.model";

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory implements OnInit {

  @Input() accountId?: number;

  private allTransactions: Transaction[] = [];

  private paginatedSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.paginatedSubject.asObservable();

  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string>('');

  // 🔹 Filters
  fromDate = '';
  toDate = '';
  type = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  // 🔹 Pagination
  page = 1;
  limit = 9;
  totalPages = 0;

  filteredTransactions: Transaction[] = [];

  constructor(private service: AccountsService,
      private route: ActivatedRoute

  ) {}


ngOnInit() {
  this.route.parent?.params.subscribe(params => {
    this.accountId = Number(params['id']); // 🔥 THIS IS KEY
    console.log("Route Account ID:", this.accountId);
    this.loadTransactions();
  });
}


  // 🔥 MAIN LOAD FUNCTION
  loadTransactions() {
    this.loading$.next(true);
    this.error$.next('');

    this.service.getAllTransactions().subscribe({
      next: (data) => {

        console.log("Account ID:", this.accountId);
        console.log("Total API Records:", data?.length);

        // ✅ FILTER BASED ON ACCOUNT
        if (this.accountId !== undefined) {
          this.allTransactions = (data || []).filter(
            t => String(t.accountId) === String(this.accountId)
          );
        } else {
          this.allTransactions = data || [];
        }

        console.log("After Filter:", this.allTransactions.length);

        this.filteredTransactions = [...this.allTransactions];

        this.page = 1;
        this.totalPages = this.calculateTotalPages();

        this.updatePagedData();
console.log("ACCOUNT ID:", this.accountId);
console.log("FIRST RECORD:", data[0]);
        this.loading$.next(false);
      },
      error: () => {
        this.error$.next('Failed to load transactions');
        this.loading$.next(false);
      }
    });
  }

  // 🔹 FILTERS
  applyFilters() {
    let filtered = [...this.allTransactions];

    if (this.type) {
      filtered = filtered.filter(t => t.type === this.type);
    }

    if (this.minAmount !== null) {
  filtered = filtered.filter(t => t.amount >= this.minAmount!);
}

if (this.maxAmount !== null) {
  filtered = filtered.filter(t => t.amount <= this.maxAmount!);
}

    if (this.fromDate) {
      filtered = filtered.filter(t =>
        new Date(t.date) >= new Date(this.fromDate)
      );
    }

    if (this.toDate) {
      filtered = filtered.filter(t =>
        new Date(t.date) <= new Date(this.toDate)
      );
    }

    this.filteredTransactions = filtered;
    this.page = 1;
    this.totalPages = this.calculateTotalPages();

    this.updatePagedData();
  }

  resetFilters() {
    this.type = '';
    this.minAmount = null;
    this.maxAmount = null;
    this.fromDate = '';
    this.toDate = '';

    this.filteredTransactions = [...this.allTransactions];
    this.page = 1;
    this.totalPages = this.calculateTotalPages();

    this.updatePagedData();
  }

  // 🔹 PAGINATION
  updatePagedData() {
    const start = (this.page - 1) * this.limit;
    const paginated = this.filteredTransactions.slice(start, start + this.limit);

    this.paginatedSubject.next(paginated);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagedData();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagedData();
    }
  }

  calculateTotalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.limit) || 1;
  }
}