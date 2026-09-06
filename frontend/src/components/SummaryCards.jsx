import React from 'react';

export default function SummaryCards({ summary }) {
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="summary-grid">
      <div className="summary-card card-income">
        <div className="summary-card-header">
          <span className="summary-card-title">Total Income</span>
          <div className="summary-card-icon">↓</div>
        </div>
        <div className="summary-card-amount">
          {formatCurrency(summary.totalIncome)}
        </div>
      </div>

      <div className="summary-card card-expense">
        <div className="summary-card-header">
          <span className="summary-card-title">Total Expenses</span>
          <div className="summary-card-icon">↑</div>
        </div>
        <div className="summary-card-amount">
          {formatCurrency(summary.totalExpense)}
        </div>
      </div>

      <div className="summary-card card-balance">
        <div className="summary-card-header">
          <span className="summary-card-title">Current Balance</span>
          <div className="summary-card-icon">₹</div>
        </div>
        <div className="summary-card-amount">
          {formatCurrency(summary.balance)}
        </div>
      </div>

      <div className="summary-card card-count">
        <div className="summary-card-header">
          <span className="summary-card-title">Transactions</span>
          <div className="summary-card-icon">#</div>
        </div>
        <div className="summary-card-amount">
          {summary.transactionCount || 0}
        </div>
      </div>
    </div>
  );
}
