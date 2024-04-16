import React, { useState } from 'react';
import ReactiveButton from 'reactive-button';

const Dialog = ({ onClose, onSubmit, children }) => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
    zIndex: 1000
  }}>
    {children}
    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
      <ReactiveButton onClick={onSubmit} color='primary' style={{ marginRight: '20px' }} idleText='Submit' />
      <ReactiveButton onClick={onClose} color='dark' idleText='Cancel' />
    </div>
  </div>
);

const AddTransactionDialog = ({ isVisible, onClose, onSubmit }) => (
  isVisible ? <Dialog onClose={onClose} onSubmit={onSubmit}>
    <div style={{ marginBottom: '20px' }}>
      <label>
        Type:
        <select style={{ marginLeft: '10px' }}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </label>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label>
        Amount:
        <input type="number" placeholder="Enter amount" style={{ marginLeft: '10px' }} />
      </label>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label>
        Category:
        <input type="text" placeholder="Enter category" style={{ marginLeft: '10px' }} />
      </label>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label>
        Date:
        <input type="date" style={{ marginLeft: '10px' }} />
      </label>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label>
        Description:
        <input type="text" placeholder="Enter description (optional)" style={{ marginLeft: '10px' }} />
      </label>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label>
        Static Transaction:
        <input type="checkbox" style={{ marginLeft: '10px' }} />
      </label>
    </div>
  </Dialog> : null
);

const AddTransactionButton = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [buttonState, setButtonState] = useState('idle');

  const handleOpenDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleSubmit = async () => {
    setButtonState('loading');
    const type = document.querySelector('select').value;
    const amount = document.querySelector('input[type="number"]').value;
    const category = document.querySelector('input[type="text"]').value;
    const date = document.querySelector('input[type="date"]').value;
    const description = document.querySelectorAll('input[type="text"]')[1].value;
    const isStatic = document.querySelector('input[type="checkbox"]').checked ? 'Y' : 'N'; // Determine if the transaction is marked as static

    const transactionData = {
      amount,
      category,
      date,
      description,
      static: isStatic
    };

    const apiEndpoint = type === 'Income' ? '/odata/v4/budget/Incomes' : '/odata/v4/budget/Expenses';

    try {
      const response = await fetch(apiEndpoint, {
        method: "post",
        body: JSON.stringify(transactionData),
        headers: {
          "Content-type": "application/json"
        }
      });

      if (!response.ok) {
        setButtonState('error');
        throw new Error(`Failed to submit ${type.toLowerCase()}`);
      }

      setButtonState('success');
      console.log(`${type} submitted successfully!`);
      setTimeout(() => setButtonState('idle'), 2000); // Reset button state after 2 seconds
    } catch (error) {
      console.error(`Error submitting ${type.toLowerCase()}:`, error);
      setTimeout(() => setButtonState('idle'), 2000); // Reset button state after 2 seconds
    }

    handleCloseDialog();
  };

  return (
    <div>
      <ReactiveButton
        onClick={handleOpenDialog}
        color='primary'
        idleText='Add Transaction'
        loadingText='Adding...'
        successText='Added'
        errorText='Error'
        buttonState={buttonState}
      />
      <AddTransactionDialog
        isVisible={dialogVisible}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddTransactionButton;
