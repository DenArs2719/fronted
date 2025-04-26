import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [expenseSummary, setExpenseSummary] = useState([]);
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
        const response = await axios.get('http://localhost:5150/api/expense', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenseSummary(response.data);
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

  if (expenseSummary.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-icon">📂</div>
          <h2 className="empty-title">No Expenses Recorded</h2>
          <p className="empty-description">
            It looks like you haven't recorded any expenses yet.<br />
            Start tracking your spending today!
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

  return (
    <div className="dashboard-container">
      <div className="chart-section">
        <div className="dashboard-header">
          <h1 className="dashboard-title">📊 Expenses Dashboard</h1>
          <p className="dashboard-subtitle">Track and manage your spending across all categories</p>
        </div>
        <ExpenseChart expenseSummary={expenseSummary} />
      </div>
    </div>
  );
};

export default Dashboard;
