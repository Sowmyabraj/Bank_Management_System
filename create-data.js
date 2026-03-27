const fs = require('fs');

const accounts = [];
const transactions = [];

// 🔹 Single Customer
const customer = {
  customerId: 1,
  name: 'Sowmya B',
  email: 'sowmya@bank.com',
  phone: '9876543210'
};

// 🔹 Data Pools
const branches = ['Chennai', 'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi'];
const accountTypes = ['Savings', 'Current', 'Salary'];

const debitDescriptions = [
  'ATM Withdrawal',
  'UPI Payment',
  'Grocery Store',
  'Electricity Bill',
  'Restaurant',
  'Online Shopping',
  'Fuel Payment'
];

const creditDescriptions = [
  'Salary Credit',
  'Cash Deposit',
  'Refund',
  'Interest Credit',
  'Dividend',
  'Transfer from Friend'
];

const modes = ['UPI', 'NEFT', 'IMPS', 'ATM', 'NetBanking'];

// 🔹 Helpers
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

// 🔹 Create 3 Accounts (Savings, Current, Salary)
for (let i = 1; i <= 3; i++) {
  const accountNumber = (1000000000 + i).toString();
  const type = accountTypes[i - 1];

  const balance =
    type === 'Salary'
      ? randomAmount(80000, 300000)
      : randomAmount(50000, 200000);

  const account = {
    id: i,
    customerId: customer.customerId,
    accountNumber,
    customerName: customer.name,
    email: customer.email,
    phone: customer.phone,
    type,
    balance,
    currency: 'INR',
    status: 'Active',
    branch: random(branches),
    ifsc: `SBIN000${1000 + i}`,
    createdDate: `2025-${pad(randomAmount(1, 12))}-01`
  };

  accounts.push(account);

  let runningBalance = balance;

  // 🔹 200 Transactions per account
  for (let j = 1; j <= 200; j++) {
    const isCredit = Math.random() > 0.5;
    const amount = randomAmount(100, 10000);

    const txnType = isCredit ? 'Credit' : 'Debit';

    let description;

    // 🔹 Salary-specific logic
    if (type === 'Salary' && isCredit && Math.random() > 0.7) {
      description = 'Monthly Salary Credit';
    } else {
      description = isCredit
        ? random(creditDescriptions)
        : random(debitDescriptions);
    }

    // Update balance
    if (txnType === 'Credit') {
      runningBalance += amount;
    } else {
      runningBalance -= amount;
    }

    const day = pad(randomAmount(1, 28));

    transactions.push({
      id: `TXN${i}${j}${Date.now().toString().slice(-4)}`,
      accountId: i,
      accountNumber,
      type: txnType,
      amount,
      balanceAfter: runningBalance,
      date: `2026-03-${day}`,
      description,
      mode: random(modes),
      status: 'Success'
    });
  }
}

// 🔹 Write file
fs.writeFileSync(
  'db.json',
  JSON.stringify({ customer, accounts, transactions }, null, 2)
);

console.log('✅ db.json created: 1 customer, 3 accounts, 200 transactions each');