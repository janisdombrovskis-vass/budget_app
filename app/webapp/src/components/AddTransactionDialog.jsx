import React, { useState } from 'react';
import styled from 'styled-components';

const Dialog = styled.div`
  background: #f3f3f3;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const AddTransactionDialog = () => {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with actual API call to add transaction
    console.log(formData);
  };

  return (
    <Dialog>
      <Form onSubmit={handleSubmit}>
        <Input
          name="type"
          placeholder="Type (Income/Expense)"
          onChange={handleChange}
          value={formData.type}
          required
        />
        <Input
          name="amount"
          type="number"
          placeholder="Amount"
          onChange={handleChange}
          value={formData.amount}
          required
        />
        <Input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          value={formData.category}
          required
        />
        <Button type="submit">Add Transaction</Button>
      </Form>
    </Dialog>
  );
};

export default AddTransactionDialog;
