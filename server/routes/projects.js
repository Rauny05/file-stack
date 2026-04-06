const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { PORTFOLIO_ROOT } = require('../config');
const { safeResolvePath, isSymlink, validateFilename, isAllowedExtension, getFileType } = require('../utils/security');

router.get('/projects', (req, res) => {
  try {
    const entries = fs.readdirSync(PORTFOLIO_ROOT, { withFileTypes: true });
    const projects = entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .map(e => {
        const dirPath = safeResolvePath(PORTFOLIO_ROOT, e.name);
        if (!dirPath || isSymlink(dirPath)) return null;
        try {
          const files = fs.readdirSync(dirPath).filter(f => isAllowedExtension(f));
          const previewFile = files.find(f => {
            const ext = path.extname(f).toLowerCase();
            return ['.jpg','.jpeg','.png','.gif','.webp','.svg'].includes(ext);
          }) || null;
          return { name: e.name, fileCount: files.length, previewFile };
        } catch { return null; }
      })
      .filter(Boolean);
    res.json(projects);
  } catch (err) {
    console.error('Error reading projects:', err);
    res.status(500).json({ error: 'Not found' });
  }
});

router.get('/projects/:name/files', (req, res) => {
  const { name } = req.params;
  if (!validateFilename(name)) return res.status(400).json({ error: 'Bad request' });
  const dirPath = safeResolvePath(PORTFOLIO_ROOT, name);
  if (!dirPath || isSymlink(dirPath)) return res.status(403).json({ error: 'Forbidden' });
  try {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return res.status(404).json({ error: 'Not found' });
    }
    const files = fs.readdirSync(dirPath)
      .filter(f => isAllowedExtension(f))
      .map(f => ({ name: f, type: getFileType(f), url: `/media/${encodeURIComponent(name)}/${encodeURIComponent(f)}` }));
    res.json(files);
  } catch (err) {
    console.error('Error reading files:', err);
    res.status(500).json({ error: 'Not found' });
  }
});

router.get('/projects/:name/download', (req, res) => {
  const { name } = req.params;
  if (!validateFilename(name)) return res.status(400).json({ error: 'Bad request' });
  const dirPath = safeResolvePath(PORTFOLIO_ROOT, name);
  if (!dirPath || isSymlink(dirPath)) return res.status(403).json({ error: 'Forbidden' });
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return res.status(404).json({ error: 'Not found' });
  }
  const { spawn } = require('child_process');
  const safeName = name.replace(/[^a-zA-Z0-9_\-. ]/g, '_');
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}.zip"`);
  const zip = spawn('zip', ['-r', '-', '.'], { cwd: dirPath });
  zip.stdout.pipe(res);
  zip.stderr.on('data', () => {});
  zip.on('error', () => res.status(500).end());
  zip.on('close', (code) => { if (code !== 0) res.end(); });
});

router.get('/config', (req, res) => {
  res.json({ portfolioRoot: PORTFOLIO_ROOT });
});

module.exports = router;
