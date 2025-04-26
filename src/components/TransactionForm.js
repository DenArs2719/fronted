import React, { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ fetchTransactions }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5150/api/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      fetchCategories();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem('token');

    if (!userToken) {
      setErrorMessage('User is not logged in.');
      return;
    }

    if (!amount || !categoryId || !date) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const newTransaction = { amount, categoryId, date };

    try {
      await axios.post('http://localhost:5150/api/transaction', newTransaction, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      fetchTransactions();
      setAmount('');
      setCategoryId('');
      setDate('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding transaction', error);
      setErrorMessage('There was an error adding the transaction.');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Add Transaction</h2>
      {errorMessage && <div style={styles.error}>{errorMessage}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          onClick={handleDropdownToggle}
          style={styles.input}
        >
          <option value="">Select Category</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option value="">No categories available</option>
          )}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Transaction</button>
      </form>
    </div>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.7rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.8rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
};

export default TransactionForm;
