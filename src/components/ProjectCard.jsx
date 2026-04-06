import React, { useState } from 'react';
import '../styles/card.css';

function getFileIcon(name) {
  const ext = name?.split('.').pop()?.toLowerCase();
  if (['jpg','jpeg','png','gif','webp','svg','avif'].includes(ext)) return '🖼';
  if (['mp4','mov','avi','webm','mkv'].includes(ext)) return '🎬';
  if (['pdf'].includes(ext)) return '📄';
  if (['zip','rar','7z','tar','gz'].includes(ext)) return '🗜';
  return '📎';
}

export default function ProjectCard({ project, index, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={`project-card ${hovered ? 'hovered' : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={() => onClick(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-folder-area">
        <div className="folder-icon-clean">
          <svg width="64" height="52" viewBox="0 0 64 52" fill="none">
            <rect x="0" y="10" width="64" height="40" rx="6" fill="#5AC8FA"/>
            <rect x="0" y="10" width="64" height="40" rx="6" fill="url(#fg)"/>
            <path d="M0 14C0 11.8 1.8 10 4 10H22L26 6H60C62.2 6 64 7.8 64 10V14H0Z" fill="#4AB8E8"/>
            <defs>
              <linearGradient id="fg" x1="0" y1="10" x2="64" y2="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7DD8FF"/>
                <stop offset="100%" stopColor="#5AC8FA"/>
              </linearGradient>
            </defs>
          </svg>
          {project.fileCount > 0 && (
            <div className="folder-count-badge">{project.fileCount}</div>
          )}
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{project.name}</h3>
        <div className="card-meta">
          <span className="card-file-count">{project.fileCount} file{project.fileCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </button>
  );
}
