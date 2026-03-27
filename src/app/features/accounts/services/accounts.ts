import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ✅ Get all accounts
  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/accounts`);
  }

  // ✅ Get single account
  getAccount(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${id}`);
  }

  // ✅ Get all transactions
 getAllTransactions(params?: any): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/transactions`, {
    params: params || {}
  });
}

  // ✅ Get transactions by account
  getTransactionsByAccount(accountId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/transactions?accountId=${accountId}`
    );
  }
}