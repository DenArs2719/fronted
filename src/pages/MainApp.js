import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from '../components/Dashboard';
import './MainApp.css'; // Добавляем сюда стили
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import CategoryForm from '../components/CategoryForm';
import CategoryRemove from '../components/CategoryRemove';

const MainApp = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState('dashboard');

  const fetchCategories = async () => {
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        console.log('User is not logged in.');
        return;
      }
      const response = await axios.get('http://localhost:5150/api/category', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchTransactions = async () => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      console.error('User is not logged in');
      return;
    }
    try {
      const response = await axios.get('http://localhost:5150/api/transaction', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(decodedToken?.email || 'user@example.com');
    }
  }, []);

  const renderContent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return <Dashboard transactions={transactions} categories={categories} />;
      case 'add-transaction':
        return <TransactionForm fetchTransactions={fetchTransactions} />;
      case 'view-transactions':
        return <TransactionList transactions={transactions} categories={categories} fetchTransactions={fetchTransactions} />;
      case 'add-category':
        return <CategoryForm fetchCategories={fetchCategories} />;
      case 'remove-category':
        return <CategoryRemove fetchCategories={fetchCategories} />;
      default:
        return null;
    }
  };

  return (
    <div className="main-app-container">
      <div className="main-content">
        <div className="header">
          <h1>Personal Finance Tracker</h1>
          <p>Logged in as: {userEmail}</p>
        </div>
        <div className="content">
          {renderContent()}
        </div>
      </div>

      <div className="sidebar">
        <h3>Menu</h3>
        <button onClick={() => setSelectedOption('dashboard')}>📊 Dashboard</button>
        <button onClick={() => setSelectedOption('add-transaction')}>➕ Add Transaction</button>
        <button onClick={() => setSelectedOption('view-transactions')}>📋 View Transactions</button>
        <button onClick={() => setSelectedOption('add-category')}>➕ Add Category</button>
        <button onClick={() => setSelectedOption('remove-category')}>❌ Remove Category</button>
      </div>
    </div>
  );
};

export default MainApp;
