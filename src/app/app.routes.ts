
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LayoutComponent } from './shared/components/layout/layout';

export const routes: Routes = [

  //  Public Routes
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

  //  Protected Routes
  {
    path: '',
    component:LayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },

      //  ACCOUNTS (Lazy Loaded Feature)
      {
        path: 'accounts',
        loadChildren: () =>
          import('./features/accounts/accounts.routing')
            .then(m => m.ACCOUNTS_ROUTES)
      }

    ]
  },

  //  Fallback
  {
    path: '**',
    redirectTo: ''
  }
];