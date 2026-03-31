import { Component ,Input, SimpleChanges} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AccountsService } from '../../services/accounts';
import { BehaviorSubject } from "rxjs";
import { Transaction } from "../../Models/transaction.model";


@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory {

  @Input() accountId?: number;  // ✅ ADD THIS

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

  constructor(private service: AccountsService) {
    this.loadTransactions(); // ✅ load immediately
  }

  // loadTransactions() {
  //   this.loading$.next(true);

  //   this.service.getAllTransactions().subscribe({
  //     next: (data) => {
  //       this.allTransactions = data || [];
  //       this.filteredTransactions = [...this.allTransactions];

  //       this.page = 1;
  //       this.totalPages = this.calculateTotalPages();

  //       this.updatePagedData();

  //       this.loading$.next(false);
  //     },
  //     error: () => {
  //       this.error$.next('Failed to load transactions');
  //       this.loading$.next(false);
  //     }
  //   });
  // }


 loadTransactions() {
  this.loading$.next(true);

  this.service.getAllTransactions().subscribe({
    next: (data) => {

      console.log("Account ID:", this.accountId);

      if (this.accountId) {
        // ✅ ACCOUNT DETAILS → FILTER
        this.allTransactions = (data || []).filter(
          t => Number(t.accountId) === Number(this.accountId)
        );
      } else {
        // ✅ TRANSACTIONS PAGE → SHOW ALL
        this.allTransactions = data || [];
      }

      this.filteredTransactions = [...this.allTransactions];

      this.page = 1;
      this.totalPages = this.calculateTotalPages();

      this.updatePagedData();

      this.loading$.next(false);
    },
    error: () => {
      this.error$.next('Failed to load transactions');
      this.loading$.next(false);
    }
  });
}

ngOnInit() {
  // For standalone transactions page
  if (!this.accountId) {
    this.loadTransactions();
  }
}

ngOnChanges(changes: SimpleChanges) {
  // For account details page
  if (changes['accountId'] && this.accountId) {
    this.loadTransactions();
  }
}

  // 🔹 Filters
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

  // 🔹 Pagination
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