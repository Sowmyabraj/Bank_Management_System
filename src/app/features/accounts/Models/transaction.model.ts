export interface Transaction {
  id: string;
  accountId: number;
  accountNumber: string;
  type: 'Credit' | 'Debit';
  amount: number;
  balanceAfter: number;
  date: string;
  description: string;
  mode: string;
  status: string;

  transactions?: Transaction[];
}