export interface Transaction {
  id: number;
  accountId: number;
  amount: number;
  type: string;
  date: string;
  description: string;
}