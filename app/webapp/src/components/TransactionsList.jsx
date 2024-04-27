import React, { useState, useEffect } from 'react';
import { FlexBox, FlexBoxDirection, FlexBoxWrap, FlexBoxJustifyContent, List, StandardListItem, Title, Panel } from '@ui5/webcomponents-react';

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
        setter(data.value);
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

  useEffect(() => {
    const staticIncomes = incomes.filter(income => income.static === 'Y');
    const staticExpenses = expenses.filter(expense => expense.static === 'Y');
    setStaticTransactions({ incomes: staticIncomes, expenses: staticExpenses });
  }, [incomes, expenses]);

  return (
    <FlexBox direction={FlexBoxDirection.Row} style={{ height: 'calc(100vh-65px)', overflow: 'hidden' }} wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center}>

      <FlexBox direction={FlexBoxDirection.Column} style={{ minWidth: '48%', height: '100%', overflowY: 'hidden', marginBottom: '15px', marginLeft: '5px', marginRight: '5px' }} wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center}>
        <Panel headerText="Recent Transactions" style={{ overflowY: 'auto', marginBottom: '15px' }}>
          <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: '15px' }}>
            <Title level="H3" style={{ marginBottom: '8px' }}>Expenses</Title>

            <List style={{ flexGrow: 1 }}>
              {expenses.map((expense) => (

                <StandardListItem key={expense.ID} description={`$${expense.amount} - ${expense.date} - ${expense.description}`} style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {expense.category}
                </StandardListItem>


              ))}
            </List>

          </FlexBox>
          <FlexBox direction={FlexBoxDirection.Column}>
            <Title level="H3" style={{ marginBottom: '8px' }}>Incomes</Title>
            <List style={{ marginBottom: '15px', flexGrow: 1 }}>
              {incomes.map((income) => (
                <StandardListItem key={income.ID} description={`$${income.amount} - ${income.date} - ${income.description}`}>
                  {income.category}
                </StandardListItem>
              ))}
            </List>

          </FlexBox>
        </Panel>
        <Panel headerText="FEATURE1" style={{ overflowY: 'auto', marginBottom: '15px' }}>
          <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: '15px' }}>
            <Title level="H3" style={{ marginBottom: '8px' }}>Title</Title>
          </FlexBox>
        </Panel>
      </FlexBox>

      {/* 2 collumn */}
      <FlexBox direction={FlexBoxDirection.Column} style={{ minWidth: '48%', height: '100%', overflowY: 'hidden', marginBottom: '15px', marginLeft: '10px', marginRight: '5px' }} wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center}>

        <FlexBox direction={FlexBoxDirection.Row} style={{ marginBottom: '15px' }} wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center}>

          <Panel headerText="FEATURE2222" style={{ overflowY: 'auto', marginBottom: '15px', minWidth: 'calc(96% + 10px)' }}>
            <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: '15px' }}>
              <Title level="H3" style={{ marginBottom: '8px' }}>Title</Title>

            </FlexBox>
          </Panel>


          <FlexBox direction={FlexBoxDirection.Column} style={{ minWidth: '48%', marginRight: '10px' }}>
            <Panel headerText="Financial Overview" style={{ overflowY: 'auto', marginBottom: '15px', minWidth: '100%', marginRight: '10px' }}>
              <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: '15px' }}>
                <Title level="H3" style={{ marginBottom: '8px' }}>Expense Categories</Title>
                <List style={{ marginBottom: '15px', flexGrow: 1 }}>
                  {expenseCategories.map(cat => (
                    <StandardListItem key={cat.category} info={`${cat.percentage}% of total`} infoState="Success">
                      {cat.category} - ${cat.amount}
                    </StandardListItem>
                  ))}
                </List>
              </FlexBox>
              <FlexBox direction={FlexBoxDirection.Column}>
                <Title level="H3" style={{ marginBottom: '8px' }}>All Static Transactions</Title>
                <List style={{ flexGrow: 1 }}>
                  <Title level="H5">Static Expenses:</Title>
                  {staticTransactions.expenses.map(expense => (
                    <StandardListItem key={expense.ID} description={`$${expense.amount} - ${expense.date} - ${expense.description}`}>
                      {expense.category}
                    </StandardListItem>
                  ))}
                  <Title level="H5">Static Incomes:</Title>
                  {staticTransactions.incomes.map(income => (
                    <StandardListItem key={income.ID} description={`$${income.amount} - ${income.date} - ${income.description}`}>
                      {income.category}
                    </StandardListItem>
                  ))}
                </List>
              </FlexBox>
            </Panel>
          </FlexBox>
          <FlexBox direction={FlexBoxDirection.Column} style={{ minWidth: '48%' }}>
            <Panel headerText="FEATURE2222" style={{ overflowY: 'auto', minWidth: '100%', marginBottom: '15px' }}>
              <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: '15px' }}>
                <Title level="H3" style={{ marginBottom: '8px' }}>Title</Title>
              </FlexBox>
            </Panel>
          </FlexBox>
        </FlexBox>





      </FlexBox>



    </FlexBox>
  );
};

export default TransactionsList;
