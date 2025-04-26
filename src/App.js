import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainApp from './pages/MainApp'; // MainApp route
import CategoryForm from './components/CategoryForm';
import TransactionForm from './components/TransactionForm';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<MainApp />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addCategory" element={<CategoryForm setToken={setToken} />} />
        <Route path="/addTransaction" element={<TransactionForm setToken={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
