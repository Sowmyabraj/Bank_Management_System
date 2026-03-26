import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../Models/account.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAccounts() {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
  }

  getAccount(id: number) {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${id}`);
  }

getAllTransactions(params?: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/transactions`, { params: params || {} });
  }

}