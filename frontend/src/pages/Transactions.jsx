import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import transactionService from '../services/transactionService';
import TransactionList from '../components/TransactionList';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    fromDate: '',
    toDate: '',
  });

  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const searchTimerRef = useRef(null);

  // Fetch all transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
      setAllTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Unable to load transactions. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Perform search query against backend with client-side fallback
  const executeSearch = async (queryText) => {
    const term = (queryText !== undefined ? queryText : searchQuery).trim();
    if (!term) {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      if (filters.type || filters.category || filters.fromDate || filters.toDate) {
        handleApplyFilters();
      } else {
        setTransactions(allTransactions);
      }
      return;
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    setIsSearching(true);
    setError(null);
    try {
      const results = await transactionService.searchTransactions(term);
      // Filter results if additional filters are set
      let filteredResults = results;
      if (filters.type) {
        filteredResults = filteredResults.filter((t) => t.type === filters.type);
      }
      if (filters.category) {
        filteredResults = filteredResults.filter(
          (t) => t.category && t.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      setTransactions(filteredResults);
    } catch (err) {
      console.error('Search failed, falling back to local search:', err);
      // Client-side fallback search
      const lower = term.toLowerCase();
      const localResults = allTransactions.filter((t) => {
        const titleMatch = t.title && t.title.toLowerCase().includes(lower);
        const catMatch = t.category && t.category.toLowerCase().includes(lower);
        const descMatch = t.description && t.description.toLowerCase().includes(lower);
        const amountMatch = t.amount && t.amount.toString().includes(lower);
        const typeMatch = t.type && t.type.toLowerCase().includes(lower);
        return titleMatch || catMatch || descMatch || amountMatch || typeMatch;
      });
      setTransactions(localResults);
    } finally {
      setIsSearching(false);
    }
  };

  // Keystroke handler with 300ms debounce
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!query.trim()) {
      if (filters.type || filters.category || filters.fromDate || filters.toDate) {
        handleApplyFilters();
      } else {
        setTransactions(allTransactions);
      }
      return;
    }

    searchTimerRef.current = setTimeout(() => {
      executeSearch(query);
    }, 300);
  };

  // Immediate search on submit (Enter key or Search button)
  const handleSearchSubmit = (query) => {
    executeSearch(query);
  };

  // Clear search input and restore transaction list
  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    if (filters.type || filters.category || filters.fromDate || filters.toDate) {
      handleApplyFilters();
    } else {
      setTransactions(allTransactions);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      const results = await transactionService.filterTransactions(filters);
      // If there is also an active search query, refine the filtered results
      if (searchQuery.trim()) {
        const lower = searchQuery.trim().toLowerCase();
        const refined = results.filter((t) => {
          const titleMatch = t.title && t.title.toLowerCase().includes(lower);
          const catMatch = t.category && t.category.toLowerCase().includes(lower);
          const descMatch = t.description && t.description.toLowerCase().includes(lower);
          const amountMatch = t.amount && t.amount.toString().includes(lower);
          return titleMatch || catMatch || descMatch || amountMatch;
        });
        setTransactions(refined);
      } else {
        setTransactions(results);
      }
    } catch (err) {
      console.error('Filter failed:', err);
      setError('Failed to apply filters.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({ type: '', category: '', fromDate: '', toDate: '' });
    if (searchQuery.trim()) {
      executeSearch(searchQuery);
    } else {
      setTransactions(allTransactions);
    }
  };

  const confirmDelete = async () => {
    if (!deletingTransaction) return;
    try {
      await transactionService.deleteTransaction(deletingTransaction.id);
      setSuccessMessage('Transaction deleted successfully.');
      setDeletingTransaction(null);
      fetchTransactions();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete transaction.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Manage, search, filter, and track all your financial entries</p>
        </div>
        <NavLink to="/add" className="btn btn-primary">
          + Add Transaction
        </NavLink>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ marginBottom: '1rem' }}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onClear={handleClearSearch}
          isLoading={isSearching}
        />
      </div>

      {searchQuery.trim() && (
        <div className="search-results-info">
          <span>
            {isSearching ? (
              'Searching transactions...'
            ) : (
              <>
                Found <strong>{transactions.length}</strong> result
                {transactions.length === 1 ? '' : 's'} for "<strong>{searchQuery.trim()}</strong>"
              </>
            )}
          </span>
          <button
            type="button"
            className="search-clear-link"
            onClick={handleClearSearch}
          >
            Clear search
          </button>
        </div>
      )}

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Loading transactions...</div>
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          searchQuery={searchQuery.trim()}
          onClearSearch={handleClearSearch}
          onDeleteClick={(t) => setDeletingTransaction(t)}
        />
      )}

      {deletingTransaction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Delete Transaction</h3>
            <p className="modal-desc">
              Are you sure you want to delete <strong>"{deletingTransaction.title}"</strong> (₹{deletingTransaction.amount})? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeletingTransaction(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
