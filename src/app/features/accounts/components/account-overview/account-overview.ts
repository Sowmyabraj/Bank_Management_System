import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-overview.html',
  styleUrl: './account-overview.scss',
})
export class AccountOverview implements OnInit {

  accounts: any[] = [];
  paginatedAccounts: any[] = [];

  currentPage = 1;
  pageSize = 9;
  totalPages = 0;

  loading = true;

  constructor(
    private service: AccountsService,
    private router: Router,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.service.getAccounts().subscribe({
    next: (data) => {
      console.log("FULL DATA:", data);

      this.accounts = data || [];

      this.totalPages = Math.ceil(this.accounts.length / this.pageSize);

      this.currentPage = 1;
      this.updatePage();

      console.log("PAGE DATA:", this.paginatedAccounts);

      this.loading = false;

      this.cdr.detectChanges(); // 🔥 FIX
    },
    error: (err) => {
      console.error(err);
      this.loading = false;

      this.cdr.detectChanges(); // 🔥 FIX
    }
  });
}

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedAccounts = this.accounts.slice(start, end);
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

  openAccount(acc: any) {
    this.router.navigate(['/accounts', acc.id]);
  }

  goBack() {
  this.router.navigate(['/']);
}
}