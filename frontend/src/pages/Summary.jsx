import React, { useState, useEffect } from 'react';
import { SummaryService } from '../services/api';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { AlertCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const Summary = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await SummaryService.getSummary();
      setSummaryData(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load spending summary. Please verify that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    { key: 'category', label: 'Category', sortable: false },
    { key: 'budget', label: 'Budget ($)', sortable: false },
    { key: 'spent', label: 'Total Spent ($)', sortable: false },
    { key: 'remaining', label: 'Remaining ($)', sortable: false },
    { key: 'status', label: 'Budget Status', sortable: false }
  ];

  return (
    <>
      <div>
        <h1>Spending Summary</h1>
        <p className="subtitle">Real-time aggregate data calculating team expenditures against budget targets.</p>
      </div>

      {error && (
        <div className="glass-panel" style={{ borderColor: 'var(--color-danger)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <AlertCircle style={{ color: 'var(--color-danger)' }} />
          <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>{error}</span>
        </div>
      )}

      <div className="glass-panel">
        {loading ? (
          <Loader message="Aggregating spending logs..." />
        ) : (
          <Table
            headers={headers}
            data={summaryData}
            renderRow={(row) => {
              const hasBudget = row.budget > 0;
              const isOver = row.overBudget;
              
              return (
                <tr key={row.category}>
                  <td style={{ fontWeight: 600 }}>{row.category}</td>
                  <td style={{ fontWeight: 500 }}>
                    {hasBudget ? `$${row.budget.toFixed(2)}` : <span style={{ color: 'var(--text-muted)' }}>N/A</span>}
                  </td>
                  <td style={{ fontWeight: 600, color: isOver ? 'var(--color-danger)' : 'inherit' }}>
                    ${row.spent.toFixed(2)}
                  </td>
                  <td style={{ 
                    fontWeight: 600, 
                    color: !hasBudget ? 'inherit' : row.remaining >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                  }}>
                    {hasBudget ? `$${row.remaining.toFixed(2)}` : <span style={{ color: 'var(--text-muted)' }}>N/A</span>}
                  </td>
                  <td>
                    {!hasBudget ? (
                      <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                        <Minus size={12} style={{ marginRight: '4px' }} />
                        Unregulated
                      </span>
                    ) : isOver ? (
                      <span className="badge badge-danger">
                        <ArrowUpRight size={12} style={{ marginRight: '4px' }} />
                        Over Budget
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        <ArrowDownRight size={12} style={{ marginRight: '4px' }} />
                        Within Budget
                      </span>
                    )}
                  </td>
                </tr>
              );
            }}
          />
        )}
      </div>
    </>
  );
};

export default Summary;
