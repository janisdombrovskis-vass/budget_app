import React, { useState, useEffect } from 'react';

const TransactionsList = () => {
  // State for incomes and expenses separately
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const response = await fetch("/odata/v4/budget/Incomes");
        if (!response.ok) {
          throw new Error('Network response was not ok for incomes');
        }
        const data = await response.json();
        setIncomes(data.value); // Assuming data.value is the array of income transactions
      } catch (error) {
        console.error("Error fetching incomes:", error);
      }
    }

    async function fetchExpenses() {
      try {
        const response = await fetch("/odata/v4/budget/Expenses");
        if (!response.ok) {
          throw new Error('Network response was not ok for expenses');
        }
        const data = await response.json();
        setExpenses(data.value); // Assuming data.value is the array of expense transactions
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    }

    fetchIncomes();
    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>Incomes</h2>
      <ul>
        {incomes.map((income) => (
          <li key={income.ID}>
            {income.category} - ${income.amount} - {income.date} - {income.description}
          </li>
        ))}
      </ul>

      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.ID}>
            {expense.category} - ${expense.amount} - {expense.date} - {expense.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;
