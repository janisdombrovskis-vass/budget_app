import React, { useState } from 'react';
import { ThemeProvider, ShellBar, Button } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

import TransactionsList from './components/TransactionsList';
import TransactionDialogTrigger from './components/TransactionDialogTrigger';

const App = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleOpenDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  return (
    <div style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      <ThemeProvider withToastContainer theme="sap_horizon" style={{ maxHeight: '100vh' }}>
        <ShellBar
          primaryTitle="Budget Tracker"
          style={{ height: '50px' }}
        />
        <Button icon="add" design="Transparent" onClick={handleOpenDialog} style={{ position: 'absolute', top: '10px', right: '10px' }} />
        <main style={{ paddingTop: '1rem', background: '#edeff0', minHeight: 'calc(100vh - 66px)' }}>
          <TransactionsList />
          <TransactionDialogTrigger
            isVisible={dialogVisible}
            onClose={handleCloseDialog}
          />
        </main>
      </ThemeProvider>
    </div>
  );
};

export default App;
