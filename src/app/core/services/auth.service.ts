import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.get<any[]>(`${this.apiUrl}/customer`).pipe(
      switchMap(users => {

        const user = users.find(
          u => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
          return throwError(() => ({
            message: 'Invalid email or password'
          }));
        }

        if (user.password !== password) {
          return throwError(() => ({
            message: 'Invalid email or password'
          }));
        }

        const { password: _, ...safeUser } = user;
        sessionStorage.setItem('user', JSON.stringify(safeUser));

        // ✅ Return mock token response
        return of({
          token: 'mock-jwt-token',
          userId: user.id,
          name: user.name
        });
      })
    );
  }

  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
  return !!sessionStorage.getItem('token');
}

  getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    sessionStorage.clear();
  }
}