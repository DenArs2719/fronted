import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TransactionList = ({ categories }) => {
  const token = localStorage.getItem('token');
  const [transactions, setTransactions] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    categoryId: '',
    minAmount: '',
    maxAmount: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ amount: '', date: '', categoryId: '' });

  const fetchTransactions = useCallback(async () => {
    try {
      const params = { page, pageSize };

      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minAmount) params.minAmount = filters.minAmount;
      if (filters.maxAmount) params.maxAmount = filters.maxAmount;

      const res = await axios.get('http://localhost:5150/api/transaction', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setTransactions(res.data.transactions);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      console.error('Error fetching transactions', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }, [token, page, pageSize, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await axios.delete(`http://localhost:5150/api/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleEditClick = (tx) => {
    setEditingId(tx.id);
    setFormData({
      amount: tx.amount,
      date: tx.date.split('T')[0],
      categoryId: tx.categoryId,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // сбрасываем на первую страницу при изменении фильтра
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5150/api/transaction/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      alert('Update failed.');
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div style={styles.container}>
      <h2>Your Transactions</h2>

      {/* Фильтры */}
      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label>From Date</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>
        <div style={styles.filterGroup}>
          <label>To Date</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>
        <div style={styles.filterGroup}>
          <label>Category</label>
          <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label>Min Amount</label>
          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleFilterChange}
          />
        </div>
        <div style={styles.filterGroup}>
          <label>Max Amount</label>
          <input
            type="number"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Список транзакций */}
      <ul style={styles.list}>
        {transactions.map((tx) => (
          <li key={tx.id} style={styles.item}>
            {editingId === tx.id ? (
              <form onSubmit={handleUpdate} style={styles.editForm}>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div style={styles.actionsRight}>
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={styles.transactionRow}>
                <div>
                  <strong>{tx.description}</strong> — {tx.amount} € on {new Date(tx.date).toLocaleDateString()}
                  <br />
                  <span style={styles.category}>Category: {getCategoryName(tx.categoryId)}</span>
                </div>
                <div style={styles.actionsRight}>
                  <button onClick={() => handleEditClick(tx)} style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(tx.id)} style={styles.deleteButton}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f4f4f4', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
  list: { listStyle: 'none', paddingLeft: 0, marginTop: '1rem' },
  item: {
    marginBottom: '1.5rem',
    background: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  transactionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: { fontStyle: 'italic', color: '#777' },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  editForm: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  actionsRight: {
    display: 'flex',
    gap: '0.5rem',
    marginLeft: '1rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
};

export default TransactionList;
