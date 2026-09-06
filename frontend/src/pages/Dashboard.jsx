import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';
import SummaryCards from '../components/SummaryCards';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categorySummaries, setCategorySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumData, allTrans, catData] = await Promise.all([
        transactionService.getSummary(),
        transactionService.getAllTransactions(),
        transactionService.getCategorySummary(),
      ]);

      setSummary(sumData);
      setRecentTransactions(allTrans.slice(0, 5));
      setCategorySummaries(catData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load dashboard data. Please ensure the backend server and MongoDB are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const maxCategoryAmount = categorySummaries.reduce(
    (max, item) => Math.max(max, item.amount),
    0
  );

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <div className="empty-state-text">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Expense Tracker</h1>
          <p className="page-subtitle">Overview of your personal income, expenses, and financial balance</p>
        </div>
        <NavLink to="/add" className="btn btn-primary">
          + Add Transaction
        </NavLink>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <SummaryCards summary={summary} />

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Transactions</h2>
            <NavLink to="/transactions" className="btn btn-secondary btn-sm">
              View All
            </NavLink>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💸</div>
              <div className="empty-state-text">No transactions recorded yet</div>
              <p>Add your first income or expense to get started!</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="table">
                <tbody>
                  {recentTransactions.map((t) => (
                    <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/transactions')}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {t.transactionDate} • {t.category}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={t.type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
                          {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Expense by Category</h2>
          </div>

          {categorySummaries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">No expense data</div>
              <p>Expenses will be categorized here once added.</p>
            </div>
          ) : (
            <div className="category-list">
              {categorySummaries.map((item) => {
                const percentage = maxCategoryAmount > 0
                  ? Math.round((item.amount / maxCategoryAmount) * 100)
                  : 0;
                return (
                  <div key={item.category} className="category-item">
                    <div className="category-info">
                      <span>{item.category}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="category-progress-bg">
                      <div
                        className="category-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
