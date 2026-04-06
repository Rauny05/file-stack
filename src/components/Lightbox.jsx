import React, { useEffect, useCallback } from 'react';
import '../styles/lightbox.css';

export default function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  const current = images[currentIndex];

  const prev = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  }, [currentIndex, images.length, onNavigate]);

  const next = useCallback(() => {
    onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, prev, next]);

  if (!current) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <img src={current.url} alt={current.name} className="lightbox-image" />
        <div className="lightbox-caption">{current.name}</div>
      </div>
      <button className="lb-arrow lb-prev" onClick={e => { e.stopPropagation(); prev(); }}>‹</button>
      <button className="lb-arrow lb-next" onClick={e => { e.stopPropagation(); next(); }}>›</button>
      <button className="lb-close" onClick={onClose}>✕</button>
      <div className="lb-counter">{currentIndex + 1} / {images.length}</div>
    </div>
  );
}
