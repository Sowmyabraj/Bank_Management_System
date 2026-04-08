import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router,NavigationEnd} from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AccountsService } from '../accounts/services/accounts.service';
import { Auth } from '../../core/services/auth.service';

import Chart from 'chart.js/auto';

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
  customer: any = {};

  showProfile = false;

  isLoading = true;
  errorMessage = '';

  accounts: any[] = [];
  transactions: any[] = [];
  monthlySpent = 0;

  currentRoute: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private accountsService: AccountsService,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // 🔥 FIX: Detect route change and reload chart
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;

        if (this.isDashboardHome()) {
          setTimeout(() => this.loadChart(), 300);
        }
      });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    const user = this.authService.getUser();

    if (user) {
      this.customer = user;
      this.customerName = user.name;
    }

    this.loadAccounts();
  }

  // 🔁 Toggle balance
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  // 👤 Profile toggle
 toggleProfile() {
  this.showProfile = !this.showProfile;
  console.log('Profile:', this.showProfile);
}

  // ❌ Close dropdown
  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: any) {
  //   if (!event.target.closest('.profile-wrapper')) {
  //     this.showProfile = false;
  //   }
  // }

  // 🔥 Load Accounts
  loadAccounts() {
    this.isLoading = true;

    this.accountsService.getAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (accounts) => {
          this.accounts = accounts;

          this.totalBalance =
            this.accountsService.calculateTotalBalance(accounts);

          this.loadTransactions();

          this.isLoading = false;

          this.cdr.detectChanges(); // ✅ FIX
        },
        error: () => {
          this.errorMessage = 'Unable to load account data.';
          this.isLoading = false;
        }
      });
  }

  // 🔥 Load Transactions
  loadTransactions() {
    this.accountsService.getAllTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.transactions = data;

          this.calculateMonthlySpent();

          if (this.isDashboardHome()) {
            setTimeout(() => this.loadChart(), 300);
          }

          this.cdr.detectChanges(); // ✅ FIX
        }
      });
  }

  // ✅ Check route
  isDashboardHome(): boolean {
    return this.currentRoute === '/dashboard';
  }

  // 💸 Monthly Spending
  calculateMonthlySpent() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.monthlySpent = this.transactions
      .filter(t => {
        const date = new Date(t.date);

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear &&
          t.type?.toLowerCase() === 'debit'   // 👈 only debit
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    console.log('Monthly spent:', this.monthlySpent);
  }

  // 📊 Chart
  loadChart() {
    const canvas = document.getElementById('spendingChart') as HTMLCanvasElement;

    if (!canvas) return;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy(); // ✅ prevent duplicates
    }

    const spendingMap: any = {};

    this.transactions.forEach(t => {
      if (t.type?.toLowerCase() === 'debit') {
        const category = t.description || 'Others';

        spendingMap[category] =
          (spendingMap[category] || 0) + t.amount;
      }
    });

    const labels = Object.keys(spendingMap);
    const data = Object.values(spendingMap);

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // 🚪 Logout
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}