import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [

  // 🔹 Accounts list
  {
    path: '',
    loadComponent: () =>
      import('./components/account-overview/account-overview')
        .then(m => m.AccountOverview)
  },

  // 🔹 Account details (parent)
  {
    path: ':id',
    loadComponent: () =>
      import('./components/account-details/account-details')
        .then(m => m.AccountDetails),

    children: [
      {
        path: 'transactions',
        loadComponent: () =>
          import('./components/transaction-history/transaction-history')
            .then(m => m.TransactionHistory)
      },
      {
        path: 'statements',
        loadComponent: () =>
          import('./components/statement/statement')
            .then(m => m.Statements)
      }
    ]
  }
];