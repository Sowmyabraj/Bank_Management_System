import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../../services/accounts';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../../Models/account.model';
import { Transaction } from '../../Models/transaction.model';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statement.html',
  styleUrl: './statement.scss'
})
export class Statements implements OnInit {

@Input() accountId?: number; // 🔥 optional // ✅ from AccountDetails

  // 🔹 Streams
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  accounts$ = this.accountsSubject.asObservable();

  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string>('');

  // 🔹 Form
  selectedAccountId: number | null = null;
  fromDate = '';
  toDate = '';
  format = '';

  constructor(private service: AccountsService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  // 🔹 Load Accounts
  loadAccounts() {
    this.loading$.next(true);

    this.service.getAccounts().subscribe({
      next: (data) => {
        this.accountsSubject.next(data || []);

        // ✅ ONLY when embedded
        if (this.accountId) {
          this.selectedAccountId = this.accountId;
        }

        this.loading$.next(false);
      },
      error: () => {
        this.error$.next('Failed to load accounts');
        this.loading$.next(false);
      }
    });
  }

  downloadStatement(accounts: Account[]) {

  if (!this.selectedAccountId || !this.fromDate || !this.toDate || !this.format) {
    alert("Please fill all fields");
    return;
  }

  this.loading$.next(true);

  this.service.getAllTransactions().subscribe({
    next: (data: Transaction[]) => {

      const filtered = data.filter(t => {

  const txnDate = t.date.split('T')[0]; // 🔥 remove time part

  return (
    Number(t.accountId) === Number(this.selectedAccountId) &&
    txnDate >= this.fromDate &&
    txnDate <= this.toDate
  );
});

      if (!filtered.length) {
        alert("No transactions found");
        this.loading$.next(false);
        return;
      }

      const account = accounts.find(a => a.id === this.selectedAccountId);

      if (this.format === 'csv') {
        this.downloadCSV(filtered);
      } else {
        this.downloadPDF(filtered, account);
      }

      this.loading$.next(false);
    },
    error: () => {
      this.error$.next('Error generating statement');
      this.loading$.next(false);
    }
  });
}
  // 🔹 CSV
  downloadCSV(data: Transaction[]) {
    const header = ['Date', 'Type', 'Amount', 'Balance'];

    const rows = data.map(t => [
      t.date,
      t.type,
      t.amount,
      t.balanceAfter
    ]);

    const csv = [header, ...rows].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `statement_${this.selectedAccountId}.csv`;
    link.click();
  }

  // 🔹 PDF
  downloadPDF(data: Transaction[], account?: Account) {

    const rows = data.map(t => `
      <tr>
        <td>${t.date}</td>
        <td>${t.type}</td>
        <td>₹ ${t.amount}</td>
        <td>₹ ${t.balanceAfter}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <body style="font-family: Arial; padding:20px;">
          <h2 style="text-align:center;">MyBank Pvt Ltd</h2>
          <h3 style="text-align:center;">Account Statement</h3>

          <p><b>Name:</b> ${account?.customerName}</p>
          <p><b>Account:</b> ${account?.accountNumber}</p>

          <table border="1" width="100%">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
            ${rows}
          </table>
        </body>
      </html>
    `;

    const win = window.open('', '', 'width=900,height=700');
    win?.document.write(html);
    win?.document.close();
    win?.print();
  }

  resetForm() {
  this.selectedAccountId = this.accountId || null; // ✅ keep selected account if embedded
  this.fromDate = '';
  this.toDate = '';
  this.format = '';
}
}