import React from 'react';
import '../styles/topnav.css';

export default function TopNav({ searchQuery, onSearchChange, projectCount, isMobile }) {
  return (
    <header className="top-nav">
      <div className="top-nav-left">
        {isMobile && (
          <div className="mobile-logo">
            <div className="logo-icon-sm">F</div>
            <span className="logo-text-sm">File Stack</span>
          </div>
        )}
      </div>
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search folders..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearchChange('')}>✕</button>
        )}
      </div>
      <div className="top-nav-right">
        <div className="nav-pill">{projectCount} folders</div>
      </div>
    </header>
  );
}
