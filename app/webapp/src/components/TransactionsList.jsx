import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  background: #fff;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    setTransactions([
      { id: 1, type: 'Income', amount: 1000, category: 'Salary' },
      { id: 2, type: 'Expense', amount: 150, category: 'Groceries' }
    ]);
  }, []);

  return (
    <List>
      {transactions.map((transaction) => (
        <ListItem key={transaction.id}>
          {transaction.type} - {transaction.category} - ${transaction.amount}
        </ListItem>
      ))}
    </List>
  );
};

export default TransactionsList;
