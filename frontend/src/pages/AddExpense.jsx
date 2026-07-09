import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ExpenseService, CategoryService } from '../services/api';
import { Input, Select, Textarea } from '../components/Form';
import Loader from '../components/Loader';
import { Save, X, AlertCircle } from 'lucide-react';

const AddExpense = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    expense_date: new Date().toISOString().split('T')[0] // Defaults to today
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAll();
      setCategories(res.data || []);
      if (res.data && res.data.length > 0) {
        // Find default or keep blank
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load categories. Please configure categories first.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Amount is required and must be a positive number greater than 0.';
    }
    if (!formData.description || formData.description.trim() === '') {
      errors.description = 'Description is required.';
    }
    if (!formData.category_id) {
      errors.category_id = 'Please select a category.';
    }
    if (!formData.expense_date) {
      errors.expense_date = 'Expense Date is required.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Map id e.g. "amount" -> state key "amount"
    const stateKey = id;
    setFormData((prev) => ({ ...prev, [stateKey]: value }));
    // Clear validation error when editing
    if (formErrors[stateKey]) {
      setFormErrors((prev) => ({ ...prev, [stateKey]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setError('');
      await ExpenseService.create({
        amount: Number(formData.amount),
        description: formData.description,
        category_id: Number(formData.category_id),
        expense_date: formData.expense_date
      });
      navigate('/expenses');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to record expense. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading categories data..." />;

  return (
    <>
      <div>
        <h1>Record Expense</h1>
        <p className="subtitle">Add a new expense to track spending against category budgets.</p>
      </div>

      {error && (
        <div className="glass-panel" style={{ borderColor: 'var(--color-danger)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AlertCircle style={{ color: 'var(--color-danger)' }} />
          <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>{error}</span>
        </div>
      )}

      <div className="glass-panel" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Amount ($)"
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            error={formErrors.amount}
            disabled={submitting}
            required
          />

          <Input
            label="Description"
            id="description"
            type="text"
            placeholder="What was this expense for?"
            value={formData.description}
            onChange={handleChange}
            error={formErrors.description}
            disabled={submitting}
            required
          />

          <Select
            label="Category"
            id="category_id"
            value={formData.category_id}
            onChange={handleChange}
            error={formErrors.category_id}
            disabled={submitting}
            required
          >
            <option value="">-- Choose Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.monthly_budget ? `(Budget: $${c.monthly_budget})` : '(No Budget)'}
              </option>
            ))}
          </Select>

          <Input
            label="Expense Date"
            id="expense_date"
            type="date"
            value={formData.expense_date}
            onChange={handleChange}
            error={formErrors.expense_date}
            disabled={submitting}
            required
          />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <Link to="/expenses" className="btn btn-secondary" style={{ pointerEvents: submitting ? 'none' : 'auto' }}>
              <X size={16} />
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} />
              {submitting ? 'Saving...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddExpense;
