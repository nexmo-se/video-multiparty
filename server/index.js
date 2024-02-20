import express from 'express';
import path from 'path';

import { fileURLToPath } from 'url';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = false; // Determine the environment

const port = process.env.VCR_PORT || 3000;
const publicPath = path.join(path.resolve(), 'public');
const distPath = path.join(path.resolve(), 'dist');
const input = path.join(path.resolve(), 'src', 'main.jsx');
const outDir = distPath; // Your build directory
// const { preload, css, js } = await parser({ input, outDir, publicPath, isDev });

export const app = express();

app.get('/api/v1/hello', (_req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

// if (!process.env['VITE']) {
//   const frontendFiles = process.cwd() + '/dist';
//   app.use(express.static(frontendFiles));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(cors());
app.get('/', (req, res, next) => {
  console.log('testing');
  // res.sendFile(frontendFiles + '/index.html');
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  // res.sendFile('/Users/jmolinasanz/Desktop/projects/my-vveapp/dist/index.html');
});
// app.listen(port);
// }

app.listen(port, () => {
  console.log('Server listening on port', port);
});
