import React, { useState } from 'react';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';

const TransactionForm = ({ fetchTransactions }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const fetchCategories = async () => {
    const userToken = localStorage.getItem('token');

    if (!userToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5150/api/category', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);

      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
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
      navigate('/login');
      return;
    }

    if (!amount || !categoryId || !date) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const newTransaction = { amount, categoryId, date };

    try {
      const response = await axios.post('http://localhost:5150/api/transaction', newTransaction, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        console.log('Transaction added successfully', response.data);
        if (typeof fetchTransactions === 'function') {
          await fetchTransactions();
        }

        setAmount('');
        setCategoryId('');
        setDate('');
        setErrorMessage('');
        navigate('/dashboard')
      } else {
        setErrorMessage('There was an error adding the transaction.');
      }
    } catch (error) {
      console.error('Error adding transaction', error);

      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setErrorMessage('There was an error adding the transaction.');
      }
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
