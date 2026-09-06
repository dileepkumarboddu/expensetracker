import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import transactionService from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';

export default function EditTransaction({ isEditing }) {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(isEditing));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && id) {
      const fetchTransaction = async () => {
        try {
          const data = await transactionService.getTransactionById(id);
          setInitialData(data);
        } catch (err) {
          console.error('Failed to load transaction:', err);
          setError('Transaction not found or unable to fetch details.');
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [isEditing, id]);

  const handleSubmit = async (formData) => {
    if (isEditing) {
      return await transactionService.updateTransaction(id, formData);
    } else {
      return await transactionService.createTransaction(formData);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <div className="empty-state-text">Loading transaction details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ maxWidth: '650px', margin: '2rem auto' }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <TransactionForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  );
}
