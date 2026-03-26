import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountsService } from '../accounts/services/accounts';
import { ChangeDetectorRef } from '@angular/core';

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

    this.service.getAccounts().subscribe(data => {
      this.totalAccounts = data.length;

      this.totalBalance = data.reduce(
        (sum, acc) => sum + Number(acc.balance),
        0
      );
    });

    this.service.getAllTransactions().subscribe((response: any) => {
  // Use the same smart check here
  const list = (response && response.data) ? response.data : response;
  this.totalTransactions = list.length;
});
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}