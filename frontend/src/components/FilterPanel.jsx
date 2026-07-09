import React from 'react';
import { Select, Input } from './Form';
import { RotateCcw } from 'lucide-react';

const FilterPanel = ({ categories, filters, onFilterChange, onReset }) => {
  return (
    <div className="glass-panel filter-panel">
      <div className="filter-group">
        <Select
          label="Category Filter"
          id="filter-category"
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="filter-group">
        <Input
          label="Start Date"
          id="filter-start-date"
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <Input
          label="End Date"
          id="filter-end-date"
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />
      </div>

      <button
        className="btn btn-secondary"
        style={{ height: '41px', marginBottom: '1.25rem' }}
        onClick={onReset}
        title="Reset filters"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
};

export default FilterPanel;
