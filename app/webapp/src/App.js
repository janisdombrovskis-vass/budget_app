import React from 'react';

import TransactionsList from './components/TransactionsList';
import AddTransactionDialog from './components/AddTransactionDialog';




const App = () => {
  return (
    <div>

      <h1>Budget Tracker</h1>
      <br></br>
      <AddTransactionDialog />

      <br></br>
      <TransactionsList />



    </div>
  );
}

export default App;
