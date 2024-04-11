import React from 'react';
import styled from 'styled-components';
import TransactionsList from './components/TransactionsList';
import AddTransactionDialog from './components/AddTransactionDialog';

const StyledApp = styled.div`
  text-align: center;
`;

const Header = styled.header`
  background-color: #282c34;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const Main = styled.main`
  padding: 20px;
`;

const App = () => {
  return (
    <StyledApp>
      <Header>
        <h1>Budget Tracker</h1>
      </Header>
      <Main>
        <TransactionsList />
        <AddTransactionDialog />
      </Main>
    </StyledApp>
  );
}

export default App;
