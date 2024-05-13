import React from 'react';
import { Button } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

const Dialog = ({ onClose, onSubmit, children }) => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px', // Added border radius
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Softer shadow
    zIndex: 1000,
    width: 'auto', // Adjusted width
    minWidth: '320px', // Minimum width
  }}>
    {children}
    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
      <Button icon="add" design="Transparent" onClick={onSubmit} style={{ marginRight: '10px' }} />
      <Button icon="decline" design="Transparent" onClick={onClose} />
    </div>
  </div>
);

const TransactionDialogTrigger = ({ isVisible, onClose, onDataChange, currentUser }) => {
  if (!isVisible) return null;

  const handleSubmit = async () => {
    const type = document.querySelector('#type-selector').value;
    const amount = document.querySelector('#amount-input').value;
    const category = document.querySelector('#category-input').value;
    const date = document.querySelector('#date-input').value;
    const description = document.querySelector('#description-input').value;
    const isStatic = document.querySelector('#static-checkbox').checked;

    const transactionData = {
      amount,
      user : currentUser,
      category,
      date,
      description,
      static: isStatic ? 'Y' : 'N'
    };

    const apiEndpoint = type === 'Income' ? '/odata/v4/budget/Incomes' : '/odata/v4/budget/Expenses';

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        throw new Error(`Failed to submit ${type.toLowerCase()}`);
      }

      onDataChange();

      console.log(`${type} submitted successfully!`);
      onClose(); // Close the dialog upon successful submission
    } catch (error) {
      console.error(`Error submitting ${type}:`, error);
    }
  };

  return (
    <Dialog onClose={onClose} onSubmit={handleSubmit}>
      <div style={{
        display: 'flex',
        flexDirection: 'column', // Changed to column for better mobile responsiveness
        gap: '10px', // Consistent spacing between fields
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label>Type:</label>
          <select id="type-selector" style={{ flexGrow: 1, marginLeft: '10px' }}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label>Amount:</label>
          <input id="amount-input" type="number" placeholder="Enter amount" style={{ flexGrow: 1, marginLeft: '10px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label>Category:</label>
          <input id="category-input" type="text" placeholder="Enter category" style={{ flexGrow: 1, marginLeft: '10px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label>Date:</label>
          <input id="date-input" type="date" style={{ flexGrow: 1, marginLeft: '10px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label>Description:</label>
          <input id="description-input" type="text" placeholder="Enter description (optional)" style={{ flexGrow: 1, marginLeft: '10px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label>Repeats every month?</label>
          <input id="static-checkbox" type="checkbox" style={{ marginLeft: '10px' }} />
        </div>
      </div>
    </Dialog>
  );
};

export default TransactionDialogTrigger;
