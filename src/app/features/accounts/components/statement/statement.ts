import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../../services/accounts';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statement.html',
  styleUrl: './statement.scss'
})
export class Statements implements OnInit {

  accounts: any[] = [];

  selectedAccountId: string = '';
  fromDate: string = '';
  toDate: string = '';
  format: string = '';
  loading = false;

  constructor(private service: AccountsService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {

  this.service.getAccounts().subscribe({
    next: (data) => {
      this.accounts = data;

      // 🔥 FORCE UI UPDATE
      this.cdr.detectChanges();
    },
    error: () => {
      this.cdr.detectChanges();
    }
  });

}
  downloadStatement() {

  // 🔥 ADD HERE (FIRST LINE INSIDE FUNCTION)
  if (!this.selectedAccountId || !this.fromDate || !this.toDate || !this.format) {
    alert("Please fill all fields");
    return;
  }

  this.loading = true;

  this.service.getAllTransactions().subscribe({
    next: (data: any[]) => {

      const filtered = data.filter(t =>
        t.accountId == this.selectedAccountId &&
        t.date >= this.fromDate &&
        t.date <= this.toDate
      );

      if (!filtered.length) {
        alert("No transactions found");
        this.loading = false;
        return;
      }

      if (this.format === 'csv') {
        this.downloadCSV(filtered);
      } else {
        this.downloadPDF(filtered);
      }

      this.loading = false;
    },
    error: () => {
      this.loading = false;
      alert("Error generating statement");
    }
  });
}

  // ✅ CSV DOWNLOAD
  downloadCSV(data: any[]) {

    const header = ['Date', 'Type', 'Amount', 'Balance', 'Mode'];

    const rows = data.map(t => [
      t.date,
      t.type,
      t.amount,
      t.balanceAfter,
      t.mode
    ]);

    const csvContent =
      [header, ...rows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `statement_${this.selectedAccountId}.csv`;
    link.click();
  }

  // ✅ PDF DOWNLOAD
  downloadPDF(data: any[]) {

  const account = this.accounts.find(a => a.id == this.selectedAccountId);

  const rows = data.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.description || 'Transaction'}</td>
      <td>${t.type}</td>
      <td>₹ ${t.amount}</td>
      <td>₹ ${t.balanceAfter}</td>
      <td>${t.mode}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <title>Account Statement</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }

          h2, h3 {
            text-align: center;
            margin: 5px;
          }

          .bank {
            font-size: 20px;
            font-weight: bold;
          }

          .details {
            margin-top: 20px;
            margin-bottom: 20px;
          }

          .details p {
            margin: 3px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th {
            background: #0a2540;
            color: white;
            padding: 10px;
          }

          td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }

          tr:nth-child(even) {
            background: #f5f5f5;
          }
        </style>
      </head>

      <body>

        <h2 class="bank">MyBank Pvt Ltd</h2>
        <h3>Account Statement</h3>

        <div class="details">
          <p><strong>Customer Name:</strong> ${account?.customerName}</p>
          <p><strong>Account Number:</strong> ${account?.accountNumber}</p>
          <p><strong>Account Type:</strong> ${account?.type}</p>
          <p><strong>From:</strong> ${this.fromDate} 
             <strong>To:</strong> ${this.toDate}</p>
        </div>

        <table>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Mode</th>
          </tr>

          ${rows}

        </table>

      </body>
    </html>
  `;

  const win = window.open('', '', 'width=1000,height=800');
  win?.document.write(html);
  win?.document.close();
  win?.print();
}

resetForm() {
  this.selectedAccountId = '';
  this.fromDate = '';
  this.toDate = '';
  this.format = '';
}
}