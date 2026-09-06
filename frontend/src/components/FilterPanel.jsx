import React from 'react';

const CATEGORIES = [
  'Salary',
  'Freelancing',
  'Business',
  'Investment',
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Health',
  'Entertainment',
  'Rent',
  'Groceries',
  'Other'
];

export default function FilterPanel({ filters, onFilterChange, onApplyFilters, onClearFilters }) {
  return (
    <div className="filter-bar">
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">Type</label>
          <select
            className="form-control"
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="form-control"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">From Date</label>
          <input
            type="date"
            className="form-control"
            value={filters.fromDate}
            onChange={(e) => onFilterChange('fromDate', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">To Date</label>
          <input
            type="date"
            className="form-control"
            value={filters.toDate}
            onChange={(e) => onFilterChange('toDate', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={onApplyFilters}>
            Apply
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClearFilters}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
