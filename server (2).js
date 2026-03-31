// ============================================
//  VOYAGR — server.js
//  Node.js backend proxy for Claude API
// ============================================

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

// Render assigns PORT automatically — must use it
const PORT = process.env.PORT || 3000;

require('dotenv').config();
const API_KEY = process.env.ANTHROPIC_API_KEY;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    handleAPIProxy(req, res);
    return;
  }

  serveStaticFile(req, res);
});

function handleAPIProxy(req, res) {
  if (!API_KEY) {
    sendJSON(res, 500, { error: 'ANTHROPIC_API_KEY is not set in environment variables.' });
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      sendJSON(res, 400, { error: 'Invalid JSON.' });
      return;
    }

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

function serveStaticFile(req, res) {
  let filePath = '.' + req.url;
  if (req.url === '/') filePath = './index.html';

  const ext      = path.extname(filePath);
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  });
}

function sendJSON(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// Must bind to 0.0.0.0 for Render to detect the port
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Voyagr is running on port ${PORT}`);
});
