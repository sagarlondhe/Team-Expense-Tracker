import React, { useState, useEffect } from 'react';
import { CategoryService } from '../services/api';
import Table from '../components/Table';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { Input } from '../components/Form';
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

const Categories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form states
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: '', monthly_budget: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to fetch categories list.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', monthly_budget: '' });
    setFormErrors({});
    setErrorMessage('');
    setCreateModalOpen(true);
  };

  const openEditModal = (cat) => {
    setCategoryToEdit(cat);
    setFormData({
      name: cat.name,
      monthly_budget: cat.monthly_budget ? cat.monthly_budget.toString() : ''
    });
    setFormErrors({});
    setErrorMessage('');
    setEditModalOpen(true);
  };

  const openDeleteModal = (cat) => {
    setCategoryToDelete(cat);
    setErrorMessage('');
    setDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Category name is required.';
    }
    if (formData.monthly_budget) {
      const budgetNum = Number(formData.monthly_budget);
      if (isNaN(budgetNum) || budgetNum < 0) {
        errors.monthly_budget = 'Budget must be a positive number.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrorMessage('');
      await CategoryService.create({
        name: formData.name,
        monthly_budget: formData.monthly_budget ? Number(formData.monthly_budget) : null
      });
      setSuccessMessage('Category created successfully.');
      setCreateModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to create category.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrorMessage('');
      await CategoryService.update(categoryToEdit.id, {
        name: formData.name,
        monthly_budget: formData.monthly_budget ? Number(formData.monthly_budget) : null
      });
      setSuccessMessage('Category updated successfully.');
      setEditModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to update category.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      setSubmitting(true);
      setErrorMessage('');
      await CategoryService.delete(categoryToDelete.id);
      setSuccessMessage('Category deleted successfully.');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        // Intercept conflict error e.g. "Category contains expenses and cannot be deleted."
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to delete category.');
      }
      setDeleteModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const headers = [
    { key: 'name', label: 'Category Name', sortable: false },
    { key: 'monthly_budget', label: 'Monthly Budget ($)', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Categories</h1>
          <p className="subtitle">Configure expense categories and set monthly spending thresholds.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <PlusCircle size={18} />
          Create Category
        </button>
      </div>

      {successMessage && (
        <div className="glass-panel" style={{ borderColor: 'var(--color-success)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
          <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>{successMessage}</span>
          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setSuccessMessage('')}>Dismiss</button>
        </div>
      )}

      {errorMessage && (
        <div className="glass-panel" style={{ borderColor: 'var(--color-danger)', display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem 2rem' }}>
          <AlertCircle style={{ color: 'var(--color-danger)' }} />
          <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>{errorMessage}</span>
          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', marginLeft: 'auto' }} onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}

      <div className="glass-panel">
        {loading ? (
          <Loader message="Loading categories..." />
        ) : (
          <Table
            headers={headers}
            data={categories}
            renderRow={(cat) => (
              <tr key={cat.id}>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td style={{ fontWeight: 500 }}>
                  {cat.monthly_budget !== null ? `$${cat.monthly_budget.toFixed(2)}` : 'No Budget'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.65rem' }}
                      onClick={() => openEditModal(cat)}
                      title="Edit Category"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.35rem 0.65rem' }}
                      onClick={() => openDeleteModal(cat)}
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        )}
      </div>

      {/* Create Category Modal */}
      <Modal isOpen={createModalOpen} title="Create Category" onClose={() => !submitting && setCreateModalOpen(false)}>
        <form onSubmit={handleCreateSubmit}>
          <Input
            label="Category Name"
            id="name"
            type="text"
            placeholder="e.g. Food, Transport, Rent"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            disabled={submitting}
            required
          />
          <Input
            label="Monthly Budget ($) - Optional"
            id="monthly_budget"
            type="number"
            step="0.01"
            placeholder="e.g. 1000.00"
            value={formData.monthly_budget}
            onChange={handleInputChange}
            error={formErrors.monthly_budget}
            disabled={submitting}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setCreateModalOpen(false)} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={editModalOpen} title="Edit Category" onClose={() => !submitting && setEditModalOpen(false)}>
        <form onSubmit={handleEditSubmit}>
          <Input
            label="Category Name"
            id="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            disabled={submitting}
            required
          />
          <Input
            label="Monthly Budget ($) - Optional"
            id="monthly_budget"
            type="number"
            step="0.01"
            placeholder="e.g. 1000.00"
            value={formData.monthly_budget}
            onChange={handleInputChange}
            error={formErrors.monthly_budget}
            disabled={submitting}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} title="Delete Category" onClose={() => !submitting && setDeleteModalOpen(false)}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Are you sure you want to delete the category "<strong style={{ color: 'var(--text-primary)' }}>{categoryToDelete?.name}</strong>"?
          This action will fail if there are active expenses logged under this category.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)} disabled={submitting}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Categories;
