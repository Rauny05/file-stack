import React from 'react';
import '../styles/sidebar.css';

const filters = [
  { key: 'all', label: 'All Folders', icon: '📁' },
  { key: 'has-files', label: 'With Files', icon: '📄' },
  { key: 'empty', label: 'Empty', icon: '📂' },
];

export default function Sidebar({ projectCount, filterType, onFilterChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">F</div>
        <span className="logo-text">File Stack</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Browse</div>
        {filters.map(f => (
          <button
            key={f.key}
            className={`nav-item ${filterType === f.key ? 'active' : ''}`}
            onClick={() => onFilterChange(f.key)}
          >
            <span className="nav-icon">{f.icon}</span>
            <span className="nav-label">{f.label}</span>
            {f.key === 'all' && <span className="nav-badge">{projectCount}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-value">{projectCount}</span>
            <span className="stat-label">Folders</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
