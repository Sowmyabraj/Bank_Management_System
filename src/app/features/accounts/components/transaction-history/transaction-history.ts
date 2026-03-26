import { Component } from "@angular/core";

import { OnInit } from "@angular/core";

import { ChangeDetectorRef } from "@angular/core";

import { AccountsService } from '../../services/accounts';

import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";



@Component({

  selector: 'app-transaction-history',

  imports:[CommonModule,FormsModule],

  templateUrl: './transaction-history.html',

  styleUrl: './transaction-history.scss',

})

export class TransactionHistory implements OnInit {

  allTransactions: any[] = []; // Stores all 300 (or filtered) records

  transactions: any[] = [];    // Stores only the 5 records visible on screen

  loading = false;



  // Filter States

  type = '';

  minAmount: number | null = null;

  maxAmount: number | null = null;

  sortBy = '';

  order = 'asc';



  // Pagination States

  page = 1;

  limit = 5;

 



  constructor(private service: AccountsService, private cdr: ChangeDetectorRef) {}



  ngOnInit(): void {

    this.loadTransactions();

  }



  loadTransactions() {

    this.loading = true;

   

    let params: any = {};

    if (this.type) params.type = this.type;

    if (this.minAmount != null) params.amount_gte = Number(this.minAmount);

    if (this.maxAmount != null) params.amount_lte = Number(this.maxAmount);

    if (this.sortBy) {

      params._sort = this.sortBy;

      params._order = this.order;

    }



    this.service.getAllTransactions(params).subscribe({

      next: (response: any) => {

        // Handle if backend returns {data: []} or just []

        const data = response?.data ? response.data : response;

        this.allTransactions = Array.isArray(data) ? data : [];



        // ✨ Refresh the 5 visible items immediately

        this.updatePagedData();



        this.loading = false;

        this.cdr.detectChanges();

      },

      error: () => { this.loading = false; }

    });

  }



  updatePagedData() {

    const start = (this.page - 1) * this.limit;

    const end = start + this.limit;

    // Slice the full list to get just the current page

    this.transactions = this.allTransactions.slice(start, end);

  }



  applyFilters() {

    this.page = 1; // Reset to page 1 for new search

    this.loadTransactions();

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

    return Math.ceil(this.allTransactions.length / this.limit) || 1;

  }

}