const path = require('path');

const PORTFOLIO_ROOT = process.env.PORTFOLIO_ROOT || path.join(__dirname, '..', 'portfolio');

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.mp4', '.mov', '.webm',
  '.pdf'
]);

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);
const PDF_EXTENSIONS = new Set(['.pdf']);

const FILENAME_REGEX = /^[^<>:"\/\\|?*\x00-\x1f]+$/;

module.exports = {
  PORTFOLIO_ROOT,
  ALLOWED_EXTENSIONS,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  PDF_EXTENSIONS,
  FILENAME_REGEX
};
