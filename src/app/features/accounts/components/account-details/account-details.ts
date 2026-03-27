import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../../services/accounts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.scss'
})
export class AccountDetails implements OnInit {

  account: any = null;
  transactions: any[] = [];
  loading = true;

  // 🔥 Tabs
  viewMode: 'none' | 'transactions' | 'statement' = 'none';

  // 🔥 Filters
  type = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;
  fromDate: string = '';
  toDate: string = '';

  // 🔥 Pagination
  page = 1;
  limit = 5;

  filteredTransactions: any[] = [];
  pagedTransactions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: AccountsService,
    private router: Router,
     private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));

  this.loading = true;

  this.service.getAccount(id).subscribe({
    next: (data) => {
      console.log("Account API:", data); // 🔍 debug
      this.account = data;
      this.checkLoading();
    },
    error: (err) => {
      console.error("Account error:", err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });

  this.service.getTransactionsByAccount(id).subscribe({
    next: (data) => {
      console.log("Transactions API:", data); // 🔍 debug
      this.transactions = data;
      this.applyFilters();
      this.checkLoading();
    },
    error: (err) => {
      console.error("Txn error:", err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}
checkLoading() {
  if (this.account && this.transactions) {
    this.loading = false;
    this.cdr.detectChanges(); // 🔥 CRITICAL FIX
  }
}

  // 🔹 Filter Logic
  applyFilters() {
    let filtered = [...this.transactions];

    if (this.type) filtered = filtered.filter(t => t.type === this.type);
    if (this.minAmount != null) filtered = filtered.filter(t => t.amount >= this.minAmount!);
    if (this.maxAmount != null) filtered = filtered.filter(t => t.amount <= this.maxAmount!);
    if (this.fromDate) filtered = filtered.filter(t => t.date >= this.fromDate);
    if (this.toDate) filtered = filtered.filter(t => t.date <= this.toDate);

    this.filteredTransactions = filtered;
    this.page = 1;
    this.updatePagedData();
  }

  // 🔹 Pagination
  updatePagedData() {
    const start = (this.page - 1) * this.limit;
    this.pagedTransactions = this.filteredTransactions.slice(start, start + this.limit);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagedData();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagedData();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.limit) || 1;
  }

  // 🔹 Tabs
  showTransactions() {
    this.viewMode = 'transactions';
  }

  showStatement() {
    this.viewMode = 'statement';
  }

  // 🔹 Statement Download
  downloadCSV() {
  const bankName = 'ABC Bank Pvt Ltd';
  const title = 'Account Statement';

  const accountInfo = [
    `Customer Name:,${this.account.customerName}`,
    `Account Number:,${this.account.accountNumber}`,
    `Account Type:,${this.account.type}`,
    `From Date:,${this.fromDate || '-'}`,
    `To Date:,${this.toDate || '-'}`,
    ''
  ];

  const header = ['Date', 'Description', 'Type', 'Amount', 'Balance', 'Mode'];

  const rows = this.filteredTransactions.map(t => [
    t.date,
    t.description || 'Transaction',
    t.type,
    t.amount,
    t.balanceAfter,
    t.mode
  ]);

  const csvContent = [
    [bankName],
    [title],
    [],
    ...accountInfo.map(row => row.split(',')),
    header,
    ...rows
  ]
    .map(e => e.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${this.account.accountNumber}_statement.csv`;
  link.click();
}

  downloadPDF() {
  const content = `
    <html>
    <head>
      <title>Bank Statement</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h2, h3 { text-align: center; margin: 5px; }
        .details { margin-bottom: 20px; }
        .details p { margin: 2px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>

      <h2>ABC Bank Pvt Ltd</h2>
      <h3>Account Statement</h3>

      <div class="details">
        <p><strong>Customer Name:</strong> ${this.account.customerName}</p>
        <p><strong>Account Number:</strong> ${this.account.accountNumber}</p>
        <p><strong>Account Type:</strong> ${this.account.type}</p>
        <p><strong>From:</strong> ${this.fromDate || '-'} 
           <strong>To:</strong> ${this.toDate || '-'}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredTransactions.map(t => `
            <tr>
              <td>${t.date}</td>
              <td>${t.description || 'Transaction'}</td>
              <td>${t.type}</td>
              <td>${t.amount}</td>
              <td>${t.balanceAfter}</td>
              <td>${t.mode}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

    </body>
    </html>
  `;

  const win = window.open('', '', 'width=900,height=700');
  win!.document.write(content);
  win!.document.close();
  win!.print();
}

  goBack() {
    this.router.navigate(['/accounts']);
  }
}