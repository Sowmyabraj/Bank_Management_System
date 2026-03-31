import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../Models/account.model';
import { Transaction } from '../Models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
  return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
}

getAccount(id: number): Observable<Account> {
  return this.http.get<Account>(`${this.baseUrl}/accounts/${id}`);
}

getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
  return this.http.get<Transaction[]>(
    `${this.baseUrl}/transactions?accountId=${accountId}`
  );
}

  // ✅ Get all transactions
 getAllTransactions(params?: any): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/transactions`, {
    params: params || {}
  });
}

  calculateTotalBalance(accounts: Account[]): number {
    return accounts.reduce(
      (sum, acc) => sum + Number(acc.balance || 0),
      0
    );
  }
}