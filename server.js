/**
 * Node Swatch - Color Palette Generator Server
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import apiRoutes from './src/api/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎨 Node Swatch running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/palette`);
});
