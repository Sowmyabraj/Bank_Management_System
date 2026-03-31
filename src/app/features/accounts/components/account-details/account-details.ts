import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../services/accounts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Statements } from '../statement/statement';
import { Account } from '../../Models/account.model';
import { Transaction } from '../../Models/transaction.model';
import { TransactionHistory } from "../transaction-history/transaction-history";

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, FormsModule, Statements, TransactionHistory],
  templateUrl: './account-details.html',
  styleUrl: './account-details.scss'
})
export class AccountDetails implements OnInit {

  // 🔹 Streams
  private accountSubject = new BehaviorSubject<Account | null>(null);
  account$ = this.accountSubject.asObservable();

  private paginatedSubject = new BehaviorSubject<Transaction[]>([]);
  pagedTransactions$ = this.paginatedSubject.asObservable();

  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string>('');

  // 🔹 UI
  viewMode: 'none' | 'transactions' | 'statement' = 'none';

  // 🔹 Filters
  type = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;
  fromDate = '';
  toDate = '';

  // 🔹 Data
  private allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  // 🔹 Pagination
  page = 1;
  limit = 5;

  constructor(
    private route: ActivatedRoute,
    private service: AccountsService,
    private router: Router
  ) {}

  // ✅ IMPORTANT FIX
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading$.next(true);

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error$.next('Invalid account ID');
      this.loading$.next(false);
      return;
    }

    // 🔹 Account
    this.service.getAccount(id).subscribe({
      next: (account) => {
        this.accountSubject.next(account);
      },
      error: () => {
        this.error$.next('Failed to load account');
        this.loading$.next(false);
      }
    });

    // 🔹 Transactions
    this.service.getTransactionsByAccount(id).subscribe({
      next: (transactions) => {

        console.log("DATA RECEIVED:", transactions);

        this.allTransactions = transactions || [];

        // 🔥 IMPORTANT: apply filters AFTER data
        this.applyFilters();

        this.loading$.next(false);
      },
      error: () => {
        this.error$.next('Failed to load transactions');
        this.loading$.next(false);
      }
    });
  }

  applyFilters() {
  let filtered = [...this.allTransactions];

  if (this.type) {
    filtered = filtered.filter(t => t.type === this.type);
  }

  if (this.minAmount !== null) {
    const min = this.minAmount;
    filtered = filtered.filter(t => t.amount >= min);
  }

  if (this.maxAmount !== null) {
    const max = this.maxAmount;
    filtered = filtered.filter(t => t.amount <= max);
  }

  if (this.fromDate) {
    const from = this.fromDate;
    filtered = filtered.filter(t => t.date >= from);
  }

  if (this.toDate) {
    const to = this.toDate;
    filtered = filtered.filter(t => t.date <= to);
  }

  this.filteredTransactions = filtered;
  this.page = 1;

  this.updatePagedData();
}

  // 🔹 Pagination
  updatePagedData() {
    const start = (this.page - 1) * this.limit;
    const data = this.filteredTransactions.slice(start, start + this.limit);

    this.paginatedSubject.next(data); // 🔥 CRITICAL FIX
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

  // 🔹 Tabs
  showTransactions() {
    this.viewMode = 'transactions';
  }

  showStatement() {
    this.viewMode = 'statement';
  }

  // 🔹 Downloads
  downloadCSV() {
    const header = ['Date', 'Type', 'Amount', 'Balance'];

    const rows = this.filteredTransactions.map(t => [
      t.date,
      t.type,
      t.amount,
      t.balanceAfter
    ]);

    const csv = [header, ...rows].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'statement.csv';
    link.click();
  }

  downloadPDF() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/dashboard/accounts']);
  }
}