import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TransactionItem({ transaction, onDeleteClick }) {
  const navigate = useNavigate();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const isIncome = transaction.type === 'INCOME';

  return (
    <tr>
      <td>{transaction.transactionDate}</td>
      <td>
        <div style={{ fontWeight: 600 }}>{transaction.title}</div>
        {transaction.description && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {transaction.description}
          </div>
        )}
      </td>
      <td>
        <span className="badge-category">{transaction.category}</span>
      </td>
      <td>
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {transaction.type}
        </span>
      </td>
      <td className={isIncome ? 'amount-income' : 'amount-expense'}>
        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/edit/${transaction.id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteClick(transaction)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
