// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AccountsService } from '../../services/accounts';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-statements',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './statement.html',
//   styleUrl: './statement.scss'
// })
// export class Statements implements OnInit {

//   accounts: any[] = [];
//   selectedAccountId: number | null = null;

//   fromDate: string = '';
//   toDate: string = '';

//   transactions: any[] = [];
//   loading = false;

//   constructor(private service: AccountsService,
//   private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {

//   const accountId = Number(this.route.snapshot.paramMap.get('id'));

//   if (accountId) {
//     this.selectedAccountId = accountId;
//     this.generateStatement(); // 🔥 auto load
//   } else {
//     this.service.getAccounts().subscribe(data => {
//       this.accounts = data;
//     });
//   }
// }

//   // 🔹 Generate Statement
//   generateStatement() {
//     if (!this.selectedAccountId) return;

//     this.loading = true;

//     let params: any = {
//       accountId: this.selectedAccountId
//     };

//     if (this.fromDate) params.date_gte = this.fromDate;
//     if (this.toDate) params.date_lte = this.toDate;

//     this.service.getAllTransactions(params).subscribe({
//       next: (data) => {
//         this.transactions = data;
//         this.loading = false;
//       },
//       error: () => {
//         this.loading = false;
//       }
//     });
//   }

//   // 🔹 Download CSV
//   downloadCSV() {
//     if (!this.transactions.length) return;

//     const header = ['Date', 'Type', 'Amount', 'Balance', 'Mode'];

//     const rows = this.transactions.map(t => [
//       t.date,
//       t.type,
//       t.amount,
//       t.balanceAfter,
//       t.mode
//     ]);

//     let csvContent =
//       'data:text/csv;charset=utf-8,' +
//       [header, ...rows].map(e => e.join(',')).join('\n');

//     const link = document.createElement('a');
//     link.setAttribute('href', encodeURI(csvContent));
//     link.setAttribute('download', 'statement.csv');
//     link.click();
//   }

//   // 🔹 Download PDF (Simple version)
//   downloadPDF() {
//     window.print(); // simple browser print → save as PDF
//   }
// }