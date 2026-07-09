import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SummaryService, ExpenseService } from '../services/api';
import Loader from '../components/Loader';
import { PlusCircle, AlertCircle, TrendingUp, DollarSign, Wallet } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, expRes] = await Promise.all([
        SummaryService.getSummary(),
        ExpenseService.getAll({ page: 1, limit: 5 })
      ]);
      setSummary(sumRes.data || []);
      setRecentExpenses(expRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading dashboard statistics..." />;

  // Calculate high-level KPIs
  const totalSpent = summary.reduce((acc, curr) => acc + curr.spent, 0);
  const totalBudget = summary.reduce((acc, curr) => acc + curr.budget, 0);
  const overBudgetCatCount = summary.filter((cat) => cat.overBudget).length;
  const remainingBudget = totalBudget - totalSpent;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back! Here is a summary of your team's expenses.</p>
        </div>
        <Link to="/expenses/add" className="btn btn-primary">
          <PlusCircle size={18} />
          Add Expense
        </Link>
      </div>

      {error && (
        <div className="glass-panel" style={{ borderColor: 'var(--color-danger)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AlertCircle style={{ color: 'var(--color-danger)' }} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid-cols-3">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="subtitle">Total Spending</span>
            <DollarSign size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="stat-value">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="subtitle">Remaining Budget</span>
            <Wallet size={20} style={{ color: remainingBudget >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }} />
          </div>
          <div className="stat-value" style={{ color: remainingBudget >= 0 ? 'inherit' : 'var(--color-danger)' }}>
            ${remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="subtitle">Budget Status</span>
            <TrendingUp size={20} style={{ color: overBudgetCatCount > 0 ? 'var(--color-warning)' : 'var(--color-success)' }} />
          </div>
          <div className="stat-value" style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>
            {overBudgetCatCount > 0 ? (
              <span style={{ color: 'var(--color-warning)' }}>{overBudgetCatCount} Over Budget</span>
            ) : (
              <span style={{ color: 'var(--color-success)' }}>All in Budget</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid-cols-2">
        {/* Budget vs Spending Progress */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.25rem' }}>Budget Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {summary.length > 0 ? (
              summary.map((cat) => {
                const percentage = cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;
                let barColor = 'var(--color-primary)';
                if (cat.budget > 0) {
                  if (cat.spent > cat.budget) barColor = 'var(--color-danger)';
                  else if (cat.spent > cat.budget * 0.85) barColor = 'var(--color-warning)';
                  else barColor = 'var(--color-success)';
                }
                
                return (
                  <div key={cat.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat.category}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        ${cat.spent.toLocaleString()} of ${cat.budget ? cat.budget.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    {cat.budget > 0 ? (
                      <>
                        <div className="progress-container">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${percentage}%`, backgroundColor: barColor }}
                          />
                        </div>
                        {cat.spent > cat.budget && (
                          <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                            Over budget by ${(cat.spent - cat.budget).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>No budget configured</span>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No categories registered.</p>
            )}
          </div>
        </div>

        {/* Recent Expenses List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>Recent Expenses</h3>
            <Link to="/expenses" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
              View All
            </Link>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {recentExpenses.length > 0 ? (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.5rem 1rem' }}>Desc</th>
                    <th style={{ padding: '0.5rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.5rem 1rem', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((exp) => (
                    <tr key={exp.id}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: 500 }}>{exp.description}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{exp.expense_date}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge badge-success" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                          {exp.category_name}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>
                        ${exp.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No expenses recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
