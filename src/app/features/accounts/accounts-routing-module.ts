import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [

  // 🔹 Account Overview
  {
    path: '',
    loadComponent: () =>
      import('./components/account-overview/account-overview')
        .then(m => m.AccountOverview)
  },

  // 🔹 Transactions (Required feature)
  {
    path: 'transactions',
    loadComponent: () =>
      import('./components/transaction-history/transaction-history')
        .then(m => m.TransactionHistory)
  },

  // 🔹 Statements
  {
    path: 'statements',
    loadComponent: () =>
      import('./components/statement/statement')
        .then(m => m.Statements)
  },

  // 🔹 Account Details (SAFE dynamic route)
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/account-details/account-details')
        .then(m => m.AccountDetails)
  }

];