import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ExpenseService, CategoryService } from '../services/api';
import { Input, Select, Textarea } from '../components/Form';
import Loader from '../components/Loader';
import { Save, X, AlertCircle } from 'lucide-react';

const EditExpense = () => {
  const { id } = useParams();
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
    expense_date: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [catRes, expRes] = await Promise.all([
        CategoryService.getAll(),
        ExpenseService.getById(id)
      ]);
      setCategories(catRes.data || []);
      
      const expense = expRes.data;
      if (expense) {
        setFormData({
          amount: expense.amount.toString(),
          description: expense.description,
          category_id: expense.category_id.toString(),
          expense_date: expense.expense_date
        });
      } else {
        setError('Expense not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load initial data. Make sure the backend server is running.');
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
    const stateKey = id;
    setFormData((prev) => ({ ...prev, [stateKey]: value }));
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
      await ExpenseService.update(id, {
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
        setError('Failed to update expense. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading expense details..." />;

  return (
    <>
      <div>
        <h1>Edit Expense</h1>
        <p className="subtitle">Modify details of an existing expense transaction.</p>
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
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditExpense;
