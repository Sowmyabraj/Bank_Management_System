import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-account-overview',
  imports: [CommonModule],
  templateUrl: './account-overview.html',
  styleUrl: './account-overview.scss',
})
export class AccountOverview implements OnInit {

  accounts: any[] = [];
  loading = true; // start as true

  constructor(private service: AccountsService,
     private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
  this.service.getAccounts().subscribe({
    next: (data) => {

      this.accounts = data;
      this.loading = false;

      this.cdr.detectChanges(); // 🔥 FORCE UI UPDATE
    },
    error: (err) => {
      console.error(err);
      this.loading = false;

      this.cdr.detectChanges(); // 🔥 IMPORTANT
    }
  });
}
}
