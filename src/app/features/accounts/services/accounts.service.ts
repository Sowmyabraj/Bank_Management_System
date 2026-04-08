import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // 🔹 Accounts
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
  }

  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${id}`);
  }

  // 🔹 Transactions by account (basic)
  getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/transactions`,
      {
        params: { accountId }
      }
    );
  }

  // 🔥 ADVANCED: Transactions with filtering + pagination
  getTransactions(options: {
    accountId?: number;
    page?: number;
    pageSize?: number;
    type?: string;
    minAmount?: number;
    maxAmount?: number;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Observable<Transaction[]> {

    let params = new HttpParams();

    if (options.accountId) {
      params = params.set('accountId', options.accountId);
    }

    if (options.page) {
      params = params.set('_page', options.page);
    }

    if (options.pageSize) {
      params = params.set('_limit', options.pageSize);
    }

    if (options.type) {
      params = params.set('type', options.type);
    }

    if (options.minAmount) {
      params = params.set('amount_gte', options.minAmount);
    }

    if (options.maxAmount) {
      params = params.set('amount_lte', options.maxAmount);
    }

    if (options.fromDate) {
      params = params.set('date_gte', options.fromDate);
    }

    if (options.toDate) {
      params = params.set('date_lte', options.toDate);
    }

    if (options.sortBy) {
      params = params.set('_sort', options.sortBy);
      params = params.set('_order', options.order || 'desc');
    }

    return this.http.get<Transaction[]>(
      `${this.baseUrl}/transactions`,
      { params }
    );
  }

  // 🔹 Get all transactions (simple fallback)
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`);
  }

  // 🔹 Utility
  calculateTotalBalance(accounts: Account[]): number {
    return accounts.reduce(
      (sum, acc) => sum + Number(acc.balance || 0),
      0
    );
  }
}