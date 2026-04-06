const path = require('path');
const fs = require('fs');
const { FILENAME_REGEX, ALLOWED_EXTENSIONS } = require('../config');

function safeResolvePath(base, ...segments) {
  const resolved = path.resolve(base, ...segments);
  const normalizedBase = path.resolve(base) + path.sep;
  if (!resolved.startsWith(normalizedBase) && resolved !== path.resolve(base)) {
    return null;
  }
  return resolved;
}

function isSymlink(filePath) {
  try {
    return fs.lstatSync(filePath).isSymbolicLink();
  } catch {
    return false;
  }
}

function validateFilename(name) {
  return FILENAME_REGEX.test(name) && !name.includes('..');
}

function isAllowedExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS, PDF_EXTENSIONS } = require('../config');
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  if (PDF_EXTENSIONS.has(ext)) return 'pdf';
  return null;
}

module.exports = { safeResolvePath, isSymlink, validateFilename, isAllowedExtension, getFileType };
