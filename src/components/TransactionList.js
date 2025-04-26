import React, { useState } from 'react';
import axios from 'axios';

const TransactionList = ({ transactions, categories, fetchTransactions }) => {
  const token = localStorage.getItem('token');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ amount: '', date: '', categoryId: '' });

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

  return (
    <div style={styles.container}>
      <h2>Your Transactions</h2>
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
                <select name="categoryId" value={formData.categoryId} onChange={handleInputChange}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div style={styles.actionsRight}>
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
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
    </div>
  );
};

const styles = {
    container: { backgroundColor: '#f4f4f4', padding: '1rem', borderRadius: '8px' },
    list: { listStyle: 'none', paddingLeft: 0 },
    item: {
      marginBottom: '1rem',
      background: '#fff',
      padding: '0.75rem',
      borderRadius: '6px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    transactionRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    category: { fontStyle: 'italic', color: '#777' },
    editButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#4CAF50', // Green background
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease', // Smooth transition for hover effect
    },
    deleteButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f44336', // Red background
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s ease', // Smooth transition for hover effect
    },
    editForm: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    actionsRight: {
      display: 'flex',
      gap: '0.5rem',
      marginLeft: '1rem',
    },
    // Hover effects for buttons
    editButtonHover: {
      backgroundColor: '#45a049', // Darker green on hover
    },
    deleteButtonHover: {
      backgroundColor: '#d32f2f', // Darker red on hover
    },
  };

export default TransactionList;
