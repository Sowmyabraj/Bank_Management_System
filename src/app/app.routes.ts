import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
export const routes: Routes = [

   { path: '', component: Dashboard }, // default

  {
    path: 'accounts',
    loadChildren: () =>
      import('./features/accounts/accounts-routing-module')
        .then(m => m.ACCOUNTS_ROUTES)
  },

  { path: '**', redirectTo: '' }
];
