import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [categoriesRes, transactionsRes] = await Promise.all([
          axios.get('http://localhost:5150/api/category', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5150/api/transaction', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(categoriesRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5150/api/transaction', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Error fetching transactions.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="chart-section">
        <div className="dashboard-header">
          <h1 className="dashboard-title">📊 Expenses Dashboard</h1>
          <p className="dashboard-subtitle">Track and manage your spending across all categories</p>
        </div>
        <ExpenseChart categories={categories} transactions={transactions} />
      </div>
      <div className="form-section">
        <TransactionForm fetchTransactions={fetchTransactions} />
        <TransactionList
          categories={categories}
          transactions={transactions}
          fetchTransactions={fetchTransactions}
        />
      </div>
    </div>
  );
};

export default Dashboard;
