import React from 'react';
import TransactionItem from './TransactionItem';

export default function TransactionList({ transactions, onDeleteClick, searchQuery, onClearSearch }) {
  if (!transactions || transactions.length === 0) {
    if (searchQuery) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">No transactions found matching "{searchQuery}"</div>
          <p>Check the spelling or try searching by category or description.</p>
          {onClearSearch && (
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '0.75rem' }}
              onClick={onClearSearch}
            >
              Clear Search
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-text">No transactions found</div>
        <p>Try adding a new transaction or clearing your filters.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
