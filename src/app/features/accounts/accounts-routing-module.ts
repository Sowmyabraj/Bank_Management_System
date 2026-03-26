import { Routes } from '@angular/router';
import { AccountOverview } from './components/account-overview/account-overview';
import { TransactionHistory } from './components/transaction-history/transaction-history';

export const ACCOUNTS_ROUTES: Routes = [
  { path: '', component: AccountOverview },
  { path: 'transactions', component: TransactionHistory }
];