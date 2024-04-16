import React, { useState, useEffect } from 'react';
import SplitPane from 'react-split-pane'; // Import only SplitPane

const TransactionsList = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [staticTransactions, setStaticTransactions] = useState({ incomes: [], expenses: [] });

  useEffect(() => {
    async function fetchData(endpoint, setter) {
      try {
        const response = await fetch(`/odata/v4/budget/${endpoint}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${endpoint}`);
        }
        const data = await response.json();
        setter(data.value); // Assuming data.value is the array of transactions
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    }

    fetchData('Incomes', setIncomes);
    fetchData('Expenses', setExpenses);
  }, []);

  useEffect(() => {
    const categorySum = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    const categories = Object.entries(categorySum)
      .sort((a, b) => b[1] - a[1]) // Sort by amount, descending
      .slice(0, 5) // Top 5 categories
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalExpenses) * 100).toFixed(2) // Calculate percentage
      }));

    setExpenseCategories(categories);
  }, [expenses]);

 // Filter static transactions based on "Y" in the static field
 useEffect(() => {
  const staticIncomes = incomes.filter(income => income.static === 'Y');
  const staticExpenses = expenses.filter(expense => expense.static === 'Y');
  setStaticTransactions({ incomes: staticIncomes, expenses: staticExpenses });
}, [incomes, expenses]);


  return (
    <div>
      <SplitPane split="vertical" defaultSize="50%">
        <div>
          <h2>Recent Transactions</h2>
          <h3>Incomes</h3>
          <ul>
            {incomes.map((income) => (
              <li key={income.ID}>
                {income.category} - ${income.amount} - {income.date} - {income.description}
              </li>
            ))}
          </ul>
          <h3>Expenses</h3>
          <ul>
            {expenses.map((expense) => (
              <li key={expense.ID}>
                {expense.category} - ${expense.amount} - {expense.date} - {expense.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Financial Overview</h2>
          <SplitPane split="horizontal" defaultSize="33%">
            <div>
              <h2>Expense Categories</h2>
              <ul>
                {expenseCategories.map(cat => (
                  <li key={cat.category}>{cat.category} - {cat.percentage}% of total expenses</li>
                ))}
              </ul>
            </div>
            {/* <div>
              <h2>Daily Allowance</h2>
            </div> */}
            <div>
              <h2>All Static Transactions</h2>
              <ul>
                <p><strong>Static Expenses:</strong></p>
                {staticTransactions.expenses.map(expense => (
                  <li key={expense.ID}>
                    {expense.category} - ${expense.amount} - {expense.date} - {expense.description}
                  </li>
                ))}
                <p><strong>Static Incomes:</strong></p>
                {staticTransactions.incomes.map(income => (
                  <li key={income.ID}>
                    {income.category} - ${income.amount} - {income.date} - {income.description}
                  </li>
                ))}
              </ul>
            </div>
          </SplitPane>
        </div>
      </SplitPane>
    </div>
  );
};

export default TransactionsList;
