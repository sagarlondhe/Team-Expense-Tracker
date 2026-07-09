import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ExpenseService, CategoryService } from '../services/api';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import FilterPanel from '../components/FilterPanel';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

const Expenses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filtering & Pagination State
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1,
  });

  // Modal deletion state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sorting state (local sorting for the current page)
  const [sortConfig, setSortConfig] = useState({ key: 'expense_date', direction: 'desc' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [pagination.page, filters]);

  const fetchInitialData = async () => {
    try {
      const catRes = await CategoryService.getAll();
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
      setErrorMessage('Failed to fetch categories list.');
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await ExpenseService.getAll({
        category: filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: pagination.page,
        limit: pagination.limit,
      });

      setExpenses(res.data || []);
      setPagination({
        page: res.pagination.page,
        limit: res.pagination.limit,
        totalRecords: res.pagination.totalRecords,
        totalPages: res.pagination.totalPages,
      });
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load expenses list.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleFilterReset = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted expenses to render
  const sortedExpenses = React.useMemo(() => {
    let sortable = [...expenses];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Format dates, names or numbers for comparison
        if (sortConfig.key === 'expense_date') {
          return sortConfig.direction === 'asc'
            ? new Date(valA) - new Date(valB)
            : new Date(valB) - new Date(valA);
        }
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
          if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }
    return sortable;
  }, [expenses, sortConfig]);

  const triggerDelete = (expense) => {
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    try {
      setIsDeleting(true);
      await ExpenseService.delete(expenseToDelete.id);
      setSuccessMessage('Expense deleted successfully.');
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
      // Reload current page (or adjust page if deleted last item on page)
      if (expenses.length === 1 && pagination.page > 1) {
        setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to delete expense.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Headers for Table component
  const headers = [
    { key: 'description', label: 'Description', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'category_name', label: 'Category', sortable: true },
    { key: 'expense_date', label: 'Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Expenses</h1>
          <p className="subtitle">Manage and track your team's shared expenses.</p>
        </div>
        <Link to="/expenses/add" className="btn btn-primary">
          <PlusCircle size={18} />
          Add Expense
        </Link>
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

      <FilterPanel
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      <div className="glass-panel">
        {loading ? (
          <Loader message="Loading expenses..." />
        ) : (
          <>
            <Table
              headers={headers}
              data={sortedExpenses}
              sortConfig={sortConfig}
              onSort={handleSort}
              renderRow={(expense) => (
                <tr key={expense.id}>
                  <td style={{ fontWeight: 500 }}>{expense.description}</td>
                  <td style={{ fontWeight: 600 }}>${expense.amount.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-success" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      {expense.category_name}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{expense.expense_date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/expenses/edit/${expense.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Edit expense"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.65rem' }}
                        onClick={() => triggerDelete(expense)}
                        title="Delete expense"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              limit={pagination.limit}
              totalRecords={pagination.totalRecords}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Confirm Deletion"
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
      >
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Are you sure you want to delete this expense of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            ${expenseToDelete?.amount.toFixed(2)}
          </strong>{' '}
          for "<strong style={{ color: 'var(--text-primary)' }}>{expenseToDelete?.description}</strong>"?
          This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Expense'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Expenses;
