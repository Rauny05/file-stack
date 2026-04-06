import React, { useRef, useState, useEffect } from 'react';
import AssetCard from './AssetCard';
import '../styles/bottomsheet.css';

const API = import.meta.env.VITE_API_BASE || '';

export default function BottomSheet({ project, files, onClose, onImageClick, images }) {
  const sheetRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    dragging.current = true;
  };

  const onTouchMove = (e) => {
    if (!dragging.current) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setTranslateY(delta);
  };

  const onTouchEnd = (e) => {
    dragging.current = false;
    const delta = e.changedTouches[0].clientY - startY.current;
    if (delta > 100) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  let imgIdx = 0;
  const imageIndexMap = {};
  files.forEach(f => {
    if (f.type === 'image') { imageIndexMap[f.name] = imgIdx++; }
  });

  return (
    <>
      <div className="bs-overlay" onClick={onClose}></div>
      <div
        className="bottom-sheet"
        ref={sheetRef}
        style={{ transform: `translateY(${translateY}px)`, transition: translateY === 0 ? 'transform 0.3s ease' : 'none' }}
      >
        <div className="bs-handle-area" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <div className="bs-handle"></div>
        </div>
        <div className="bs-header">
          <div>
            <h2 className="bs-title">{project.name}</h2>
            <span className="bs-count">{project.fileCount} files</span>
          </div>
          <a
            href={`${API}/api/projects/${encodeURIComponent(project.name)}/download`}
            download={`${project.name}.zip`}
            className="bs-dl-all-btn"
          >
            ↓ All
          </a>
        </div>
        <div className="bs-body">
          {files.length === 0 && <p className="bs-empty">No files in this folder</p>}
          <div className="bs-asset-grid">
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
      </div>
    </>
  );
}
