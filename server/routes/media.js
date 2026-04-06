const express = require('express');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const router = express.Router();
const { PORTFOLIO_ROOT } = require('../config');
const { safeResolvePath, isSymlink, validateFilename, isAllowedExtension } = require('../utils/security');

router.get('/:project/:file', (req, res) => {
  const { project, file } = req.params;
  if (!validateFilename(project) || !validateFilename(file)) return res.status(400).send('Bad request');
  if (!isAllowedExtension(file)) return res.status(403).send('Forbidden');
  const filePath = safeResolvePath(PORTFOLIO_ROOT, project, file);
  if (!filePath || isSymlink(path.join(PORTFOLIO_ROOT, project)) || isSymlink(filePath)) {
    return res.status(403).send('Forbidden');
  }
  try {
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return res.status(404).send('Not found');
    }
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    const stat = fs.statSync(filePath);
    const isVideo = contentType.startsWith('video/');

    if (isVideo) {
      const range = req.headers.range;
      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
        const chunkSize = end - start + 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
          'Cache-Control': 'private, max-age=3600',
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': stat.size,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, max-age=3600',
        });
        fs.createReadStream(filePath).pipe(res);
      }
      return;
    }

    res.set({ 'Content-Type': contentType, 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' });
    res.sendFile(filePath);
  } catch (err) {
    console.error('Error serving file:', err);
    res.status(404).send('Not found');
  }
});

module.exports = router;
