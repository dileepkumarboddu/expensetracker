import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const INCOME_CATEGORIES = [
  'Salary',
  'Freelancing',
  'Business',
  'Investment',
  'Other'
];

const EXPENSE_CATEGORIES = [
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

export default function TransactionForm({ initialData, onSubmit, isEditing }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'EXPENSE',
    category: 'Food',
    transactionDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'EXPENSE',
        category: initialData.category || 'Food',
        transactionDate: initialData.transactionDate || new Date().toISOString().split('T')[0],
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleTypeChange = (newType) => {
    const defaultCategory = newType === 'INCOME' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCategory,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be greater than zero';
    }
    if (!formData.category) {
      errs.category = 'Category is required';
    }
    if (!formData.transactionDate) {
      errs.transactionDate = 'Transaction date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      navigate('/transactions');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Failed to save transaction' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const currentCategories = formData.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="form-card">
      <div className="card-header">
        <h2 className="card-title">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
      </div>

      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Transaction Type *</label>
          <select
            className="form-control"
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Monthly Rent, Client Invoice"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Amount (₹) *</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            placeholder="e.g. 1500"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className="form-control"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {currentCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Date *</label>
          <input
            type="date"
            className="form-control"
            value={formData.transactionDate}
            onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
          />
          {errors.transactionDate && (
            <span className="error-text">{errors.transactionDate}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Additional details about this transaction..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/transactions')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}
