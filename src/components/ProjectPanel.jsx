import React, { useEffect } from 'react';
import AssetCard from './AssetCard';
import '../styles/panel.css';

const API = import.meta.env.VITE_API_URL || '';

export default function ProjectPanel({ project, files, onClose, onImageClick, images }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  let imgIdx = 0;
  const imageIndexMap = {};
  files.forEach(f => {
    if (f.type === 'image') { imageIndexMap[f.name] = imgIdx++; }
  });

  return (
    <>
      <div className="panel-overlay" onClick={onClose}></div>
      <aside className="project-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">{project.name}</h2>
            <span className="panel-count">{project.fileCount} file{project.fileCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="panel-header-actions">
            <a
              href={`${API}/api/projects/${encodeURIComponent(project.name)}/download`}
              download={`${project.name}.zip`}
              className="dl-folder-btn"
              title="Download entire folder as ZIP"
            >
              ↓ Download All
            </a>
            <button className="panel-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="panel-body">
          {files.length === 0 && (
            <div className="panel-empty">No files in this folder</div>
          )}
          <div className="asset-grid">
            {files.map(file => (
              <AssetCard
                key={file.name}
                file={file}
                projectName={project.name}
                onImageClick={onImageClick}
                imageIndex={file.type === 'image' ? imageIndexMap[file.name] : -1}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
