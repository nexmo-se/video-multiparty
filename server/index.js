import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import cors from 'cors';
import { vcr } from '@vonage/vcr-sdk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = false; // Determine the environment

const port = process.env.VCR_PORT || 3000;

// const { preload, css, js } = await parser({ input, outDir, publicPath, isDev });
const session = vcr.createSession();
const state = vcr.getInstanceState();
const app = express();
app.use(cors());
app.use(bodyParser.json());

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

app.get('/', (req, res) => {
  console.log('testing');
  // res.sendFile(frontendFiles + '/index.html');
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  // res.sendFile('/Users/jmolinasanz/Desktop/projects/my-vveapp/dist/index.html');
});

app.post('/issue', async (req, res) => {
  try {
    // console.log(req.body);
    const state = vcr.getInstanceState();
    const issue = req.body.issue;
    const issueid = issue.issueId;
    const resp = await state.mapSet('issues', { [issueid]: JSON.stringify(issue) });
    // const resp = await state.set(issueid, issue);
    console.log(resp);
    res.send(resp);
  } catch (e) {
    console.log(e);
    res.sendStatus(200);
  }
});

app.get('/issues', async (req, res) => {
  try {
    const state = vcr.getInstanceState();
    // console.log(req.body);
    const issue = req.body.issue;
    console.log(issue);

    const resp = await state.mapGetAll('issues');
    console.log(resp);
    res.send(resp);
  } catch (e) {
    console.log(e);
    res.sendStatus(200);
  }
});
// app.listen(port);
// }

app.listen(port, () => {
  console.log('Server listening on port', port);
});
