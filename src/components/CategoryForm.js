import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = ({ fetchCategories }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCategory = { name: categoryName };

    try {
      const response = await axios.post('http://localhost:5150/api/category', newCategory);
      //fetchCategories();  // Refresh the categories list
      setCategoryName(''); // Clear the input field after submission
    } catch (error) {
      console.error('Error adding category', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default CategoryForm;
