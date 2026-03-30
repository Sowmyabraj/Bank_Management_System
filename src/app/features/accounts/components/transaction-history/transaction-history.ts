import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AccountsService } from '../../services/accounts';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory implements OnInit {

  allTransactions: any[] = [];
  transactions: any[] = [];
  filteredTransactions: any[] = [];

  loading = false;

  fromDate: string = '';
  toDate: string = '';

  type: string = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  page = 1;
  limit = 9;

  constructor(
    private service: AccountsService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef   // ✅ IMPORTANT
  ) {}

  ngOnInit(): void {
    this.loadTransactions(); // ✅ load on page open
  }

  loadTransactions() {
  this.loading = true;

  this.service.getAllTransactions().subscribe({
    next: (data) => {
      this.allTransactions = data || [];
      this.filteredTransactions = [...this.allTransactions];
      this.page = 1;

      // 1. First, populate the data for the UI
      this.updatePagedData();

      // 2. Then, turn off loading and refresh the UI
      this.loading = false;
      this.cd.detectChanges(); // 🔥 Now it sees the data in 'transactions'
    },
    error: () => {
      this.loading = false;
      this.cd.detectChanges();
    }
  });
}

  // ✅ APPLY FILTERS (ONLY WHEN BUTTON CLICKED)
  applyFilters() {
    let filtered = [...this.allTransactions];

    // Type
    if (this.type) {
      filtered = filtered.filter(t => t.type === this.type);
    }

    // Amount
    if (this.minAmount !== null) {
      filtered = filtered.filter(t => t.amount >= this.minAmount!);
    }

    if (this.maxAmount !== null) {
      filtered = filtered.filter(t => t.amount <= this.maxAmount!);
    }

    // ✅ Date filter
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

    this.updatePagedData();
  }

  // ✅ RESET FILTERS
  resetFilters() {
    this.type = '';
    this.minAmount = null;
    this.maxAmount = null;
    this.fromDate = '';
    this.toDate = '';

    this.filteredTransactions = [...this.allTransactions];
    this.page = 1;

    this.updatePagedData();
  }

  // ✅ PAGINATION
  updatePagedData() {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.transactions = this.filteredTransactions.slice(start, end);
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

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.limit) || 1;
  }
}