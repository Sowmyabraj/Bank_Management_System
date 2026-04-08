import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountsService } from '../../../features/accounts/services/accounts.service';
import { Auth } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent implements OnInit {

  // 🔹 Customer
  customerName: string = '';
  customer: any;

  // 🔹 Balance
  totalBalance: number = 0;
 showDetails: boolean = false; 

  // 🔹 Profile
  showProfile: boolean = false;

  constructor(
    private router: Router,
    private accountsService: AccountsService,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.loadCustomer();
    this.loadBalance();
  }

  // ✅ REAL CUSTOMER (from sessionStorage)
  loadCustomer() {
    const user = this.auth.getUser();

    if (user) {
      this.customer = user;
      this.customerName = user.name;
    } else {
      this.customerName = 'Customer';
    }
  }

  // ✅ REAL BALANCE (sum of all accounts)
  loadBalance() {
    this.accountsService.getAccounts().subscribe({
      next: (accounts) => {
        this.totalBalance = this.accountsService.calculateTotalBalance(accounts);
      },
      error: () => {
        console.error('Failed to load accounts');
      }
    });
  }

  // 🔥 Toggle Balance
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  // 🔥 Toggle Profile Panel
  toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  // 🔥 Logout
  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}