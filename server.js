// ============================================
//  VOYAGR — server.js
//  Node.js backend proxy for Claude API
//  Keeps your API key safe on the server
// ============================================

const http     = require('http');
const https    = require('https');
const fs       = require('fs');
const path     = require('path');
require('dotenv').config();

const PORT       = process.env.PORT || 3000;
const API_KEY    = process.env.ANTHROPIC_API_KEY;

// ---- MIME TYPES for serving static files ----
const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};

// ---- MAIN REQUEST HANDLER ----
const server = http.createServer((req, res) => {

  // Allow cross-origin requests during development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── API PROXY ROUTE ──────────────────────
  // Frontend calls POST /api/chat
  // Server forwards it to Anthropic with the real API key
  if (req.method === 'POST' && req.url === '/api/chat') {
    handleAPIProxy(req, res);
    return;
  }

  // ── SERVE STATIC FILES ───────────────────
  serveStaticFile(req, res);
});

// ---- API PROXY ----
function handleAPIProxy(req, res) {
  if (!API_KEY) {
    sendJSON(res, 500, { error: 'ANTHROPIC_API_KEY is not set. Check your .env file.' });
    return;
  }

  let body = '';

  req.on('data', chunk => { body += chunk.toString(); });

  req.on('end', () => {
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      sendJSON(res, 400, { error: 'Invalid JSON in request body.' });
      return;
    }

    // Forward request to Anthropic
    const postData = JSON.stringify(payload);

    const options = {
      hostname: 'api.anthropic.com',
      path:     '/v1/messages',
      method:   'POST',
      headers: {
        'Content-Type':      'application/json',
        'Content-Length':    Buffer.byteLength(postData),
        'x-api-key':         API_KEY,
        'anthropic-version': '2023-06-01',
      },
    };

    const apiReq = https.request(options, apiRes => {
      let data = '';
      apiRes.on('data', chunk => { data += chunk; });
      apiRes.on('end', () => {
        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    });

    apiReq.on('error', err => {
      console.error('Anthropic API error:', err.message);
      sendJSON(res, 502, { error: 'Failed to reach Anthropic API.' });
    });

    apiReq.write(postData);
    apiReq.end();
  });
}

// ---- STATIC FILE SERVER ----
function serveStaticFile(req, res) {
  // Default to index.html
  let filePath = '.' + req.url;
  if (req.url === '/') filePath = './index.html';

  const ext      = path.extname(filePath);
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 — File not found');
      } else {
        res.writeHead(500);
        res.end('500 — Server error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  });
}

// ---- HELPER ----
function sendJSON(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// ---- START ----
server.listen(PORT, () => {
  console.log(`\n🌍 Voyagr is running!`);
  console.log(`   Open: http://localhost:${PORT}\n`);
});
