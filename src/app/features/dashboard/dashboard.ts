import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountsService } from '../accounts/services/accounts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  totalBalance = 0;
  totalAccounts = 0;
  totalTransactions = 0;

  showDetails = false;

  constructor(private service: AccountsService) {}

  ngOnInit(): void {

    // ✅ Accounts
    this.service.getAccounts().subscribe(accounts => {
      this.totalAccounts = accounts.length;

      this.totalBalance = accounts.reduce(
        (sum, acc) => sum + Number(acc.balance || 0),
        0
      );
    });

    // ✅ Transactions (clean handling)
    this.service.getAllTransactions().subscribe(transactions => {
      this.totalTransactions = transactions.length;
    });
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}