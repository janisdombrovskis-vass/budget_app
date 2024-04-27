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
    boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
    zIndex: 1000
  }}>
    {children}
    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
      <Button icon="add" design="Transparent" onClick={onSubmit} style={{ marginRight: '20px' }} />
      <Button icon="decline" design="Transparent" onClick={onClose} />
    </div>
  </div>
);

const TransactionDialogTrigger = ({ isVisible, onClose }) => {
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

      console.log(`${type} submitted successfully!`);
      onClose(); // Close the dialog upon successful submission
    } catch (error) {
      console.error(`Error submitting ${type}:`, error);
    }
  };

  return (
    <Dialog onClose={onClose} onSubmit={handleSubmit}>
      <div>
        <label>Type: <select id="type-selector">
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select></label>
        <label>Amount: <input id="amount-input" type="number" placeholder="Enter amount" /></label>
        <label>Category: <input id="category-input" type="text" placeholder="Enter category" /></label>
        <label>Date: <input id="date-input" type="date" /></label>
        <label>Description: <input id="description-input" type="text" placeholder="Enter description (optional)" /></label>
        <label>Static Transaction: <input id="static-checkbox" type="checkbox" /></label>
      </div>
    </Dialog>
  );
};

export default TransactionDialogTrigger;
