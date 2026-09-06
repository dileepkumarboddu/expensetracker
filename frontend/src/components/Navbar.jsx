import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink to="/" className="nav-brand">
          <div className="brand-icon">₹</div>
          <span>ExpenseTracker</span>
        </NavLink>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/transactions" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Transactions
          </NavLink>
          <NavLink 
            to="/add" 
            className="btn btn-primary btn-sm btn-nav-add"
          >
            + Add Transaction
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
