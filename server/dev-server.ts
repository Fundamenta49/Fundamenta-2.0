import express from 'express';
import { log } from './vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(process.cwd(), 'dist/public');

// Log the resolved paths
log(`Current directory: ${process.cwd()}`);
log(`Server file: ${__filename}`);
log(`Server directory: ${__dirname}`);
log(`Dist directory: ${DIST_DIR}`);
log(`Dist directory exists: ${fs.existsSync(DIST_DIR)}`);

if (fs.existsSync(DIST_DIR)) {
  log(`Contents of ${DIST_DIR}:`);
  fs.readdirSync(DIST_DIR).forEach(file => {
    log(` - ${file}`);
  });
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the dist/public directory
app.use(express.static(DIST_DIR));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', environment: 'development' });
});

// Chat endpoint
app.post('/api/chat', (_req, res) => {
  res.json({
    response: "I'm a development server. Please set up your API keys for full functionality.",
    category: 'general',
    confidence: 1,
    actions: [],
    suggestions: [],
    questions: [],
    sentiment: 'neutral',
    followUpQuestions: []
  });
});

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (_req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  log(`Trying to serve: ${indexPath}`);
  log(`File exists: ${fs.existsSync(indexPath)}`);
  
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('index.html not found');
  }
  res.sendFile(indexPath);
});

app.listen(port, () => {
  log(`Development server running at http://localhost:${port}`);
}); 