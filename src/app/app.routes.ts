import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
//import { Statements } from './features/accounts/components/statement/statement';
//import { TransactionHistory } from './features/accounts/components/transaction-history/transaction-history';


export const routes: Routes = [

   { path: '', component: Dashboard }, // default

  {
    path: 'accounts',
    loadChildren: () =>
      import('./features/accounts/accounts-routing-module')
        .then(m => m.ACCOUNTS_ROUTES)
  },
//   {
//   path: 'transactions/:id',
//   component: TransactionHistory
// },
// {
//   path: 'statement/:id',
//   component: Statements
// },

  { path: '**', redirectTo: '' }
];
