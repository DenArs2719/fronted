import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';
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

        if (error.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  if (categories.length === 0 && transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-icon">📂</div>
          <h2 className="empty-title">No Categories or Transactions</h2>
          <p className="empty-description">
            It looks like you haven't added any categories or transactions yet.<br />
            Start organizing your expenses today!
          </p>
          <button 
            className="empty-button" 
            onClick={() => navigate('/addCategory')}
          >
            ➕ Add Category
          </button>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-icon">🗂️</div>
          <h2 className="empty-title">No Categories</h2>
          <p className="empty-description">
            You haven't added any categories yet.<br />
            Create your first category to start managing your expenses!
          </p>
          <button 
            className="empty-button" 
            onClick={() => navigate('/addCategory')}
          >
            ➕ Add Category
          </button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-icon">💸</div>
          <h2 className="empty-title">No Transactions</h2>
          <p className="empty-description">
            It looks like you haven't added any transactions yet.<br />
            Start tracking your expenses today!
          </p>
          <button 
            className="empty-button" 
            onClick={() => navigate('/addTransaction')}
          >
            ➕ Add Transaction
          </button>
        </div>
      </div>
    );
  }

  // === Normal dashboard ===

  return (
    <div className="dashboard-container">
      <div className="chart-section">
        <div className="dashboard-header">
          <h1 className="dashboard-title">📊 Expenses Dashboard</h1>
          <p className="dashboard-subtitle">Track and manage your spending across all categories</p>
        </div>
        <ExpenseChart categories={categories} transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
