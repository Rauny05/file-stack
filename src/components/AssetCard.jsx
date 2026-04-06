import React, { useState, useRef, useCallback } from 'react';
import '../styles/assetcard.css';

const API = import.meta.env.VITE_API_URL || '';

function fileIcon(type) {
  if (type === 'video') return '🎬';
  if (type === 'pdf') return '📄';
  return '📎';
}

function formatName(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function CommentContent({ text }) {
  const re = /https?:\/\/[^\s]+/g;
  const parts = [];
  let last = 0, match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(<span key={`t${last}`}>{text.slice(last, match.index)}</span>);
    const url = match[0];
    parts.push(
      <a key={`l${match.index}`} href={url} target="_blank" rel="noopener noreferrer"
        className="ac-comment-link" onClick={e => e.stopPropagation()}>{url}</a>
    );
    last = match.index + url.length;
  }
  if (last < text.length) parts.push(<span key={`t${last}`}>{text.slice(last)}</span>);
  return <>{parts}</>;
}

const RATING = { up: '👍', tick: '✅', cross: '❌' };

export default function AssetCard({ file, projectName, onImageClick, imageIndex }) {
  const fileUrl = `${API}${file.url}`;
  const k = (t) => `filestack_${t}_${projectName}_${file.name}`;

  const [displayName, setDisplayName] = useState(() =>
    localStorage.getItem(k('name')) || formatName(file.name)
  );
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState('');
  const [comment, setComment] = useState(() => localStorage.getItem(k('comment')) || '');
  const [editingComment, setEditingComment] = useState(false);
  const [commentVal, setCommentVal] = useState('');
  const [rating, setRating] = useState(() => localStorage.getItem(k('rating')) || null);
  const [showPopup, setShowPopup] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const holdTimer = useRef(null);
  const videoRef = useRef(null);
  const [videoAspect, setVideoAspect] = useState(null);
  const isImage = file.type === 'image';
  const isVideo = file.type === 'video';

  const onVideoMeta = useCallback((e) => {
    const v = e.target;
    if (v.videoWidth && v.videoHeight) {
      setVideoAspect(v.videoWidth / v.videoHeight);
      // seek slightly off 0 to force browsers to paint a frame
      v.currentTime = 0.1;
    }
  }, []);

  const startHold = () => {
    holdTimer.current = setTimeout(() => setShowPopup(true), 600);
  };
  const cancelHold = () => clearTimeout(holdTimer.current);

  const applyRating = (r) => {
    setRating(r);
    localStorage.setItem(k('rating'), r);
    setShowPopup(false);
  };

  const startRename = (e) => {
    e.stopPropagation();
    setRenameVal(displayName);
    setIsRenaming(true);
  };

  const confirmRename = () => {
    const v = renameVal.trim() || displayName;
    setDisplayName(v);
    localStorage.setItem(k('name'), v);
    setIsRenaming(false);
  };

  const openComment = () => {
    setCommentVal(comment);
    setEditingComment(true);
  };

  const saveComment = () => {
    setComment(commentVal);
    localStorage.setItem(k('comment'), commentVal);
    setEditingComment(false);
  };

  return (
    <div className="ac-card">
      {/* Video player modal */}
      {showVideo && (
        <div className="ac-video-modal" onClick={() => setShowVideo(false)}>
          <div className="ac-video-wrap" onClick={e => e.stopPropagation()}>
            <button className="ac-video-close" onClick={() => setShowVideo(false)}>✕</button>
            <video
              src={fileUrl}
              controls
              autoPlay
              className="ac-video-player"
            >
              Your browser does not support this video format. Try downloading it.
            </video>
            <a href={fileUrl} download={file.name} className="ac-video-dl">↓ Download</a>
          </div>
        </div>
      )}

      {/* Hold-to-rate popup */}
      {showPopup && (
        <div className="ac-rating-popup">
          {Object.entries(RATING).map(([r, icon]) => (
            <button key={r} className="ac-rating-btn" onClick={() => applyRating(r)}>
              {icon}
            </button>
          ))}
          <button className="ac-rating-close" onClick={() => setShowPopup(false)}>✕</button>
        </div>
      )}

      {/* Thumbnail area */}
      <div
        className={`ac-thumb${isImage ? ' ac-thumb--image' : isVideo ? ' ac-thumb--video' : ' ac-thumb--fixed'}`}
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        onClick={isImage ? () => onImageClick(imageIndex) : isVideo ? () => setShowVideo(true) : undefined}
        style={{
          cursor: (isImage || isVideo) ? 'pointer' : 'default',
          ...(isVideo ? {
            aspectRatio: videoAspect || undefined,
            height: videoAspect ? 'auto' : '150px',
          } : {}),
        }}
      >
        {isImage ? (
          <img src={fileUrl} alt={displayName} className="ac-thumb-img" loading="lazy" />
        ) : isVideo ? (
          <>
            <video
              ref={videoRef}
              src={fileUrl}
              className="ac-thumb-video"
              preload="metadata"
              muted
              playsInline
              onLoadedMetadata={onVideoMeta}
            />
            <div className="ac-play-btn">▶</div>
          </>
        ) : (
          <div className="ac-thumb-icon">{fileIcon(file.type)}</div>
        )}

        {rating && <div className="ac-rating-badge">{RATING[rating]}</div>}
        <a
          href={fileUrl}
          download={file.name}
          className="ac-dl-overlay"
          onClick={e => e.stopPropagation()}
          title="Download"
        >↓</a>
      </div>

      {/* Info */}
      <div className="ac-info">
        <div className="ac-name-row">
          {isRenaming ? (
            <input
              className="ac-rename-input"
              value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') confirmRename();
                if (e.key === 'Escape') setIsRenaming(false);
              }}
              onBlur={confirmRename}
              autoFocus
            />
          ) : (
            <span className="ac-name" title={file.name}>{displayName}</span>
          )}
          <button className="ac-rename-btn" onClick={startRename} title="Rename">✏️</button>
        </div>
        <span className="ac-type">{file.type.toUpperCase()}</span>

        {editingComment ? (
          <div className="ac-comment-edit">
            <textarea
              className="ac-comment-input"
              value={commentVal}
              onChange={e => setCommentVal(e.target.value)}
              placeholder="Add a comment or paste a link…"
              rows={2}
              autoFocus
            />
            <button className="ac-comment-save" onClick={saveComment}>Save</button>
          </div>
        ) : (
          <div className="ac-comment-area" onClick={openComment}>
            {comment
              ? <span className="ac-comment-text"><CommentContent text={comment} /></span>
              : <span className="ac-comment-placeholder">+ comment</span>
            }
          </div>
        )}
      </div>
    </div>
  );
}
