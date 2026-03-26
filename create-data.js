const fs = require('fs');

const accounts = [];
const transactions = [];

// Description Pools
const debitDescriptions = ['Groceries', 'Electric Bill', 'Amazon Purchase', 'Rent Payment', 'Netflix Subscription', 'Gas Station', 'Restaurant'];
const creditDescriptions = ['Salary Credit', 'Freelance Payment', 'Cash Deposit', 'Tax Refund', 'Dividend Income', 'Gift'];

for (let i = 1; i <= 30; i++) {
  accounts.push({
    id: i,
    type: i % 2 === 0 ? 'Savings' : 'Current',
    balance: Math.floor(Math.random() * 100000),
    status: 'Active'
  });

  for (let j = 1; j <= 10; j++) {
    const isCredit = j % 2 === 0;
    const type = isCredit ? 'Credit' : 'Debit';
    
    // 🔹 Pick a random description based on the type
    const pool = isCredit ? creditDescriptions : debitDescriptions;
    const description = pool[Math.floor(Math.random() * pool.length)];

    // 🔹 Fix: Ensure the day is 2-digits (01, 02...) for proper filtering
    const day = ((j % 28) + 1).toString().padStart(2, '0');

    transactions.push({
      id: String((i - 1) * 10 + j),
      accountId: i,
      amount: Math.floor(Math.random() * 5000),
      type: type,
      date: `2025-03-${day}`,
      description: description // 👈 Now dynamic!
    });
  }
}

fs.writeFileSync(
  'db.json',
  JSON.stringify({ accounts, transactions }, null, 2)
);

console.log("✅ db.json updated with realistic descriptions and standard dates.");