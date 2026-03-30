import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then(m => m.Landing)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then(m => m.Login)
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard),

    children: [

  {
    path: 'accounts',
    loadChildren: () =>
      import('./features/accounts/accounts-routing-module')
        .then(m => m.ACCOUNTS_ROUTES)
  },

  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/accounts/components/transaction-history/transaction-history')
        .then(m => m.TransactionHistory)
  },

  {
    path: 'statements',
    loadComponent: () =>
      import('./features/accounts/components/statement/statement')
        .then(m => m.Statements)
  }

]
  },

  { path: '**', redirectTo: '' }
];