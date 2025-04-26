import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryRemove.css'; // Assuming you want custom styling for this component.

const CategoryRemove = () => {
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch categories when the component is mounted
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5150/api/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (error.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login'; // redirect to login page
        }
      }
    };
    fetchCategories();
  }, [token]);

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://localhost:5150/api/category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the category from the list after successful deletion
        setCategories(categories.filter((category) => category.id !== categoryId));
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete the category. Please try again.');
      }
    }
  };

  return (
    <div className="category-remove-container">
      <h2>Manage Categories</h2>
      {categories.length > 0 ? (
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.id} className="category-item">
              <span>{category.name}</span>
              <button
                onClick={() => handleDelete(category.id)}
                className="delete-button"
              >
                🗑️ Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories available to remove.</p>
      )}
    </div>
  );
};

export default CategoryRemove;
