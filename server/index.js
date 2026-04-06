const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const projectsRouter = require('./routes/projects');
const mediaRouter = require('./routes/media');

const app = express();
const PORT = 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "blob:", "data:"],
      mediaSrc: ["'self'", "blob:", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"]
    }
  },
  xFrameOptions: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer' }
}));

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], methods: ['GET'] }));

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false }));
app.use('/media', rateLimit({ windowMs: 15 * 60 * 1000, max: 5000, standardHeaders: true, legacyHeaders: false }));

app.use('/api', projectsRouter);
app.use('/media', mediaRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Not found');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
