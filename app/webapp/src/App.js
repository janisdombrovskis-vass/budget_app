import React, { useState } from 'react';
import { ThemeProvider, ShellBar, Button } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

import TransactionsList from './components/TransactionsList';
import TransactionDialogTrigger from './components/TransactionDialogTrigger';

const App = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState('1a81b6ee-kd88-45af-9d2c-64a8131865a1');
  const [dataVersion, setDataVersion] = useState(0);


  const handleOpenDialog = () => {
    setDialogVisible(true);
  };

  const handleChangeUser = () => {
    console.log("Changing user.");
    const newUser = currentUser === '1a81b6ee-kd88-45af-9d2c-64a8131865a1' ? '1a81b6ee-kd88-45af-9d2c-64a8131865a2' : '1a81b6ee-kd88-45af-9d2c-64a8131865a1';
    setCurrentUser(newUser);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleDataChange = () => {
    setDataVersion(prev => prev + 1);  // Increment to trigger useEffect
  };

  return (
    <div style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      <ThemeProvider withToastContainer theme="sap_horizon" style={{ maxHeight: '100vh' }}>
        <ShellBar
          primaryTitle="Budget Tracker"
          style={{ height: '50px' }}
        />
        <Button icon="employee" design="Transparent" text="" onClick={handleChangeUser} style={{ position: 'absolute', top: '10px', right: '50px' }}></Button>
        <Button icon="add" design="Transparent" text="" onClick={handleOpenDialog} style={{ position: 'absolute', top: '10px', right: '10px' }} />


        <main style={{ paddingTop: '15px', background: '#edeff0', minHeight: 'calc(100vh - 66px)' }}>
          <TransactionsList currentUser={currentUser} dataVersion={dataVersion} />
          {/* pass current user to transaction list to read filtered data */}
          <TransactionDialogTrigger
            currentUser={currentUser}
            isVisible={dialogVisible}
            onClose={handleCloseDialog}
            onDataChange={handleDataChange}
          />
        </main>
      </ThemeProvider>
    </div>
  );
};

export default App;
