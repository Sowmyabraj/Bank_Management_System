import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AccountsService } from '../accounts/services/accounts';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {

  totalBalance = 0;
  showDetails = false;
  customerName = '';
  isLoading = true;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private accountsService: AccountsService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Get logged-in user
    this.customerName = this.authService.getUserName();

    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading = true;

    this.accountsService.getAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.totalBalance = this.accountsService.calculateTotalBalance(accounts);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading accounts', err);
          this.errorMessage = 'Unable to load account data. Please try again.';
          this.isLoading = false;
        }
      });
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  // 🚪 Logout
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}