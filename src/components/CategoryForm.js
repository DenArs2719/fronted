import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './CategoryForm.css';
import { useNavigate } from 'react-router-dom';

const CategoryForm = ({ fetchCategories }) => {
  const [categoryName, setCategoryName] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    if (!categoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }

    const newCategory = { name: categoryName.trim() };

    try {
      const response = await axios.post('http://localhost:5150/api/category', newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Category added successfully', response.data);
        alert('Category added successfully!');
        setCategoryName('');
        if (fetchCategories) fetchCategories();
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Error adding category:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to add category. Please try again.');
      }
    }
  }, [categoryName, token, fetchCategories, navigate]);

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <input
        type="text"
        placeholder="Enter category name..."
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="category-input"
      />
      <button type="submit" className="category-button">
        ➕ Add Category
      </button>
    </form>
  );
};

export default CategoryForm;