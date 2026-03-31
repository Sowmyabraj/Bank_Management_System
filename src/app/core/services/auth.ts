// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, map, throwError } from 'rxjs';
// import { Customer } from '../../models/customer';
// import { environment } from '../../../environments/environment';

// export interface LoginResponse {
//   token: string;
//   user: Customer;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class Auth {

//   private apiUrl: string = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   login(email: string, password: string): Observable<LoginResponse> {
//     return this.http.get<Customer[]>(`${this.apiUrl}/customer`).pipe(
//       map(users => {
//         const user = users.find(
//           u => u.email === email && u.password === password
//         );

//         if (!user) {
//           return null;
//         }

//         return {
//           token: 'mock-token',
//           user
//         };
//       }),
//       map(res => {
//         if (!res) {
//           throw { code: 'INVALID_CREDENTIALS' }; // ✅ clean custom error
//         }

//         // ✅ Save username here (important)
//         localStorage.setItem('username', res.user.name);

//         return res;
//       })
//     );
//   }

//   saveToken(token: string) {
//     localStorage.setItem('token', token);
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   getUserName(): string {
//     return localStorage.getItem('username') || 'Customer';
//   }

//   logout() {
//     localStorage.clear();
//     sessionStorage.clear();
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Customer } from '../../models/customer';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  user: Customer;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customer`).pipe(
      map(users => {
        const user = users.find(
          u => u.email === email && u.password === password
        );

        if (!user) {
          throw { code: 'INVALID_CREDENTIALS' };
        }

        // ✅ Save full user
        localStorage.setItem('user', JSON.stringify(user));

        return {
          token: 'mock-token',
          user
        };
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserName(): string {
    const user = this.getUser();
    return user?.name || 'Customer';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }
}