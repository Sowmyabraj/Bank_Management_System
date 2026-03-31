import { Component } from '@angular/core';
import { AccountsService } from '../../services/accounts';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../../Models/account.model';
import { TransactionHistory } from '../transaction-history/transaction-history';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule,TransactionHistory],
  templateUrl: './account-overview.html',
  styleUrl: './account-overview.scss',
})
export class AccountOverview {

  private allAccounts: Account[] = [];

  private paginatedSubject = new BehaviorSubject<Account[]>([]);
  paginatedAccounts$ = this.paginatedSubject.asObservable();

  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string>('');

  currentPage = 1;
  pageSize = 9;
  totalPages = 0;

  constructor(
    private service: AccountsService,
    private router: Router
  ) {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading$.next(true);

    this.service.getAccounts().subscribe({
      next: (data) => {
        this.allAccounts = data || [];

        this.totalPages = Math.ceil(this.allAccounts.length / this.pageSize);
        this.currentPage = 1;

        this.updatePage();

        this.loading$.next(false);
      },
      error: () => {
        this.error$.next('Failed to load accounts');
        this.loading$.next(false);
      }
    });
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const paginated = this.allAccounts.slice(start, start + this.pageSize);

    this.paginatedSubject.next(paginated);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  openAccount(acc: Account) {
  this.router.navigate(['/dashboard/accounts/details', acc.id]);
}
}