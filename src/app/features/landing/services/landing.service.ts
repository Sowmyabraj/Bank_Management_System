import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getData() {
    return forkJoin({
      customers: this.http.get<any[]>(`${this.baseUrl}/customer`),
      accounts: this.http.get<any[]>(`${this.baseUrl}/accounts`),
      transactions: this.http.get<any[]>(`${this.baseUrl}/transactions`)
    });
  }
}