import React, { useState, useEffect } from 'react';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // Fetch incomes
        const incomesResponse = await fetch("/odata/v4/budget/Incomes");
        if (!incomesResponse.ok) {
          throw new Error('Network response was not ok for incomes');
        }
        const incomesData = await incomesResponse.json();
        const incomesWithTypes = incomesData.value.map(income => ({ ...income, type: 'Income' }));

        // Fetch expenses
        const expensesResponse = await fetch("/odata/v4/budget/Expenses");
        if (!expensesResponse.ok) {
          throw new Error('Network response was not ok for expenses');
        }
        const expensesData = await expensesResponse.json();
        const expensesWithTypes = expensesData.value.map(expense => ({ ...expense, type: 'Expense' }));

        // Combine incomes and expenses with types
        const combinedTransactions = [...incomesWithTypes, ...expensesWithTypes];
        console.log(combinedTransactions);
        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Call the function to fetch and combine transactions
    fetchTransactions();
  }, []);

  if (!transactions || !Array.isArray(transactions)) return null;

  return (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction.ID}>
          <strong>{transaction.type}:</strong> {transaction.category} - ${transaction.amount} - {transaction.date}
          {/* Type added to each transaction display */}
        </li>
      ))}
    </ul>
  );
};

export default TransactionsList;
