import React from 'react';
import CategoryForm from './CategoryForm';

const AddCategorySection = ({ fetchCategories }) => {
  return (
    <div style={styles.content}>
      <h2 style={styles.sectionTitle}>Add Category</h2>
      <CategoryForm fetchCategories={fetchCategories} />
    </div>
  );
};

const styles = {
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

export default AddCategorySection;
