import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import Categories from './pages/Categories';
import Summary from './pages/Summary';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route path="/expenses/edit/:id" element={<EditExpense />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
