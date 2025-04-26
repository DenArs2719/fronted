import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from '../components/Dashboard';

const MainApp = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  const fetchCategories = async () => {
    try {
      const userToken = localStorage.getItem('token');
  
      if (!userToken) {
        console.log('User is not logged in.');
        return;
      }

      const response = await axios.get('http://localhost:5150/api/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchTransactions = async () => {
    const userToken = localStorage.getItem('token'); // Get the user's token from localStorage
  
    if (!userToken) {
      console.error('User is not logged in');
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:5150/api/transaction', {
        headers: {
          'Authorization': `Bearer ${userToken}`, // Include JWT token in the request header
        }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();

    // Assuming the user's email is stored in localStorage or can be decoded from JWT
    const decodedToken = JSON.parse(atob(localStorage.getItem('token').split('.')[1])); // Decode the JWT token to get email
    setUserEmail(decodedToken?.email || 'user@example.com');  // Set email, or default to a placeholder
  }, []);

  return (
    <div className="App" style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Personal Finance Tracker</h1>
        <p style={styles.emailText}>Logged in as: {userEmail}</p>
      </div>

      <Dashboard transactions={transactions} categories={categories} />
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    padding: '2rem 0',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: '0.5rem',
  },
  emailText: {
    fontSize: '1.1rem',
    fontWeight: '400',
    color: '#777',
  },
  content: {
    margin: '1.5rem 0',
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#333',
  },
};

export default MainApp;
