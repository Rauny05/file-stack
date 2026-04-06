import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import ProjectGrid from './components/ProjectGrid';
import ProjectPanel from './components/ProjectPanel';
import BottomSheet from './components/BottomSheet';
import Lightbox from './components/Lightbox';
import './styles/layout.css';

const API = import.meta.env.VITE_API_BASE || '';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/projects`);
      if (!res.ok) throw new Error();
      setProjects(await res.json());
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => {
    fetch(`${API}/api/config`).then(r => r.json()).then(setConfig).catch(() => {});
  }, []);

  const openProject = useCallback(async (project) => {
    setSelectedProject(project);
    try {
      const res = await fetch(`${API}/api/projects/${encodeURIComponent(project.name)}/files`);
      if (!res.ok) throw new Error();
      setProjectFiles(await res.json());
    } catch {
      setProjectFiles([]);
    }
  }, []);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    setProjectFiles([]);
  }, []);

  const images = projectFiles.filter(f => f.type === 'image');

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(-1), []);

  const filtered = projects.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType === 'empty' && p.fileCount > 0) return false;
    if (filterType === 'has-files' && p.fileCount === 0) return false;
    return true;
  });

  return (
    <div className="app-layout">
      {!isMobile && (
        <Sidebar
          projectCount={projects.length}
          filterType={filterType}
          onFilterChange={setFilterType}
        />
      )}
      <main className="main-content">
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          projectCount={projects.length}
          isMobile={isMobile}
        />
        <div className="content-area">
          <ProjectGrid
            projects={filtered}
            loading={loading}
            error={error}
            onRetry={fetchProjects}
            onOpenProject={openProject}
            config={config}
          />
        </div>
      </main>

      {selectedProject && !isMobile && (
        <ProjectPanel
          project={selectedProject}
          files={projectFiles}
          onClose={closeProject}
          onImageClick={openLightbox}
          images={images}
        />
      )}

      {selectedProject && isMobile && (
        <BottomSheet
          project={selectedProject}
          files={projectFiles}
          onClose={closeProject}
          onImageClick={openLightbox}
          images={images}
        />
      )}

      {lightboxIndex >= 0 && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
