import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, FolderTree, BarChart3, Wallet } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="brand">
            <Wallet className="nav-icon" style={{ color: '#6366f1' }} />
            <span>Team Expense Tracker</span>
          </div>
        </Link>
        
        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                <LayoutDashboard className="nav-icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/expenses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Receipt className="nav-icon" />
                <span>Expenses</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FolderTree className="nav-icon" />
                <span>Categories</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/summary" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <BarChart3 className="nav-icon" />
                <span>Summary</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', marginTop: 'auto' }}>
          v1.0.0 &copy; 2026 · SDL
        </div>
      </aside>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
