import React from 'react';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClear,
  isLoading = false,
  placeholder = 'Search by title, category, description...',
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onSearchChange('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form" role="search">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search transactions"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            title="Clear search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="search-submit-btn"
        disabled={isLoading}
        aria-label="Submit search"
      >
        {isLoading ? (
          <>
            <span className="search-spinner" aria-hidden="true">⏳</span> Searching...
          </>
        ) : (
          'Search'
        )}
      </button>
    </form>
  );
}
