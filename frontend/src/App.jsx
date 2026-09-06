import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import EditTransaction from './pages/EditTransaction';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add" element={<EditTransaction isEditing={false} />} />
            <Route path="/edit/:id" element={<EditTransaction isEditing={true} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
