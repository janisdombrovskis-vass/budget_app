import React, { useState, useEffect } from 'react';
import { FlexBox, FlexBoxDirection, FlexBoxWrap, FlexBoxJustifyContent, List, StandardListItem, Title, Panel } from '@ui5/webcomponents-react';

const TransactionsList = ({ currentUser, dataVersion }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState(0);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [staticTransactions, setStaticTransactions] = useState({ incomes: [], expenses: [] });
  const [dailyAllowance, setDailyAllowance] = useState(0);
  const [totalMoneyLeft, setTotalMoneyLeft] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [financialStatus, setFinancialStatus] = useState({ lastMonthIncomes: 0, lastMonthExpenses: 0 });


  //fetch data
  useEffect(() => {
    async function fetchData(endpoint, setter) {
      try {
        const response = await fetch(`/odata/v4/budget/${endpoint}?$filter=user eq '${currentUser}'`);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${endpoint}`);
        }
        const data = await response.json();
        const sortedData = data.value.sort((a, b) => new Date(b.date) - new Date(a.date));
        setter(sortedData);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    }

    fetchData('Incomes', setIncomes);
    fetchData('Expenses', setExpenses);
    fetchData('Savings', setSavings);
    console.log(currentUser);
  }, [currentUser, dataVersion]);

  //expense categories
  useEffect(() => {
    const categorySum = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalExpenses(totalExpenses);
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

  //static transactions
  useEffect(() => {
    const staticIncomes = incomes.filter(income => income.static === 'Y');
    const staticExpenses = expenses.filter(expense => expense.static === 'Y');
    setStaticTransactions({ incomes: staticIncomes, expenses: staticExpenses });
  }, [incomes, expenses]);

  //daily allowance and money left
  useEffect(() => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysRemaining = (endOfMonth - today) / (1000 * 60 * 60 * 24);

    const totalStaticExpenses = staticTransactions.expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0);

    const allowance = ((totalIncome - totalStaticExpenses) / daysRemaining).toFixed(2);
    setDailyAllowance(allowance);

    const totalMoneyLeft = (totalIncome - totalExpenses).toFixed(2);
    setTotalMoneyLeft(totalMoneyLeft);
  }, [incomes, staticTransactions.expenses, totalExpenses]);

  //upcoming payments
  useEffect(() => {
    const today = new Date();
    const upcomingExpenses = expenses.filter(expense => new Date(expense.date) > today);
    const upcomingStaticExpenses = staticTransactions.expenses.map(expense => {
      const nextDueDate = new Date(expense.date);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      return { ...expense, date: nextDueDate.toISOString().split('T')[0] };
    }).filter(expense => new Date(expense.date) > today);

    setUpcomingPayments([...upcomingExpenses, ...upcomingStaticExpenses]);
  }, [expenses, staticTransactions.expenses]);

  //financial status
  useEffect(() => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const firstDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

    const lastMonthIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= firstDayLastMonth && incomeDate <= lastDayLastMonth;
    }).reduce((acc, income) => acc + parseFloat(income.amount), 0);

    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= firstDayLastMonth && expenseDate <= lastDayLastMonth;
    }).reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

    setFinancialStatus({
      lastMonthIncomes,
      lastMonthExpenses
    });
  }, [incomes, expenses]);

  return (
    <FlexBox direction={FlexBoxDirection.Row} style={{ height: 'calc(100vh-65px)', overflow: 'hidden' }} wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center}>

      <FlexBox direction={FlexBoxDirection.Column} style={{ width: 'calc(50% - 30px)', height: '100%', overflow: 'hidden', marginBottom: '15px', marginRight: '10px' }} wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.SpaceBetween}>
      
        <FlexBox direction={FlexBoxDirection.Row} style={{ marginBottom: '15px', overflow: 'hidden' }}>

          <Panel headerText="Recent Expenses" style={{ minWidth: '100%', maxHeight: 'calc(50vh - 40px)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
              <List style={{ flexGrow: 1, overflow: 'auto', height: '100%', width: '100%' }}>
                {expenses.map((expense) => (
                  <StandardListItem key={expense.ID} description={`$${expense.amount} - ${expense.date} - ${expense.description}`} style={{ maxHeight: '200px', overflow: 'auto' }}>
                    {expense.category}
                  </StandardListItem>
                ))}
              </List>
            </div>
          </Panel>

        </FlexBox>

        <FlexBox direction={FlexBoxDirection.Row} style={{ marginBottom: '15px', overflow: 'hidden' }}>

          <Panel headerText="Recent Incomes" style={{ minWidth: '100%', maxHeight: 'calc(40vh - 35px)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
              <List style={{ flexGrow: 1, overflow: 'auto', height: '100%', width: '100%' }}>
                {incomes.map((income) => (
                  <StandardListItem key={income.ID} description={`$${income.amount} - ${income.date} - ${income.description}`}>
                    {income.category}
                  </StandardListItem>
                ))}
              </List>
            </div>
          </Panel>

        </FlexBox>

        <Panel headerText="Financial Status" style={{ overflowY: 'auto', marginBottom: '15px', height: '100%' }}>
          <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: '15px' }}>
            <Title level="H4">Last Month's overview:</Title>
            <p>Total Income Last Month: ${financialStatus.lastMonthIncomes}</p>
            <p>Total Expenses Last Month: ${financialStatus.lastMonthExpenses}</p>
          </FlexBox>
        </Panel>

      </FlexBox>

      {/* 2 collumn */}
      <FlexBox direction={FlexBoxDirection.Column} style={{ width: 'calc(50% - 30px)', height: '100%', overflow: 'hidden', marginBottom: '15px', marginLeft: '10px' }} wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.SpaceBetween}>

        <FlexBox direction={FlexBoxDirection.Row} style={{ marginBottom: '15px', overflow: 'hidden', height: '100%' }}>

          <Panel headerText="Expense Categories" style={{ minWidth: '100%', maxHeight: 'calc(50vh - 40px)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
              <List style={{ marginBottom: '15px', flexGrow: 1, overflow: 'auto', height: '100%', width: '100%' }}>
                {expenseCategories.map(cat => (
                  <StandardListItem key={cat.category} description={`${cat.percentage}% of total`}>
                    {cat.category} - ${cat.amount}
                  </StandardListItem>
                ))}
              </List>
            </div>
          </Panel>

        </FlexBox>

        <FlexBox direction={FlexBoxDirection.Row} style={{ overflow: 'hidden' }} justifyContent={FlexBoxJustifyContent.SpaceBetween}>

          <FlexBox direction={FlexBoxDirection.Column} style={{ width: 'calc(50% - 10px)', height: '100%', overflow: 'hidden', marginBottom: '15px' }} justifyContent={FlexBoxJustifyContent.Center}>
            <Panel headerText="Money Left" style={{ minWidth: '100%' }}>
              <div style={{ minWidth: '100%', height: '34vh' }} >
                <p style={{ marginTop: '10px' }}>Daily Allowance:</p> <h2 style={{ marginBottom: '20px' }}>${dailyAllowance}</h2>
                <p style={{ marginTop: '40px' }}>Total Money Left:</p> <h2 style={{ marginBottom: '20px' }}>${totalMoneyLeft}</h2>
                {/* <p style={{ marginTop: '40px' }}>Savings:</p> <h2>${savings}</h2> */}
              </div>
            </Panel>
          </FlexBox>

          <FlexBox direction={FlexBoxDirection.Column} style={{ width: 'calc(50% - 10px)', height: '100%', overflow: 'hidden', marginBottom: '15px' }} justifyContent={FlexBoxJustifyContent.Center}>
            <Panel headerText="Upcoming Expenses" style={{ minWidth: '100%' }}>
              <div style={{ minWidth: '100%', height: 'calc(40vh - 40px)' }} >
                
                <List style={{ marginBottom: '15px', flexGrow: 1, overflow: 'auto', height: '100%', width: '100%' }}>
                  {upcomingPayments.map(payment => (
                    <StandardListItem key={payment.ID} description={`Due on: ${payment.date}`}>
                      ${payment.amount} - {payment.category}
                    </StandardListItem>
                  ))}
                </List>
              </div>
            </Panel>
          </FlexBox>

        </FlexBox>

      </FlexBox>
    </FlexBox >
  );
};

export default TransactionsList;
