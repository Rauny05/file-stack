import React from 'react';
import ProjectCard from './ProjectCard';
import Skeleton from './Skeleton';
import '../styles/grid.css';

export default function ProjectGrid({ projects, loading, error, onRetry, onOpenProject, config }) {
  if (loading) {
    return (
      <div className="grid-container">
        <div className="section-header">
          <h2 className="section-title">📁 Folders</h2>
        </div>
        <div className="project-grid">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid-empty-state">
        <div className="empty-icon">⚠️</div>
        <h3>{error}</h3>
        <p>Make sure the backend server is running</p>
        <button className="retry-btn" onClick={onRetry}>Retry</button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="grid-empty-state">
        <div className="empty-icon">📂</div>
        <h3>No projects found</h3>
        {config && <p className="empty-path">{config.portfolioRoot}</p>}
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="section-header">
        <h2 className="section-title">📁 Folders</h2>
        <span className="section-count">{projects.length}</span>
      </div>
      <div className="project-grid">
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} onClick={onOpenProject} />
        ))}
      </div>
    </div>
  );
}
