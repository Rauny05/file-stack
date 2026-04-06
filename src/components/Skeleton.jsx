import React from 'react';
import '../styles/skeleton.css';

export default function Skeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-folder"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-meta"></div>
    </div>
  );
}
