import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from './src/config.js';
import { createRunLog } from './src/logger.js';
import { runSignalAgent } from './src/agent.js';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5180);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

async function sendFile(res, path) {
  const body = await readFile(path);
  res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
  res.end(body);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (url.pathname === '/api/run') {
      const config = loadConfig(['--mode', url.searchParams.get('mode') || 'dry-run', '--json']);
      const log = createRunLog(config);
      const report = await runSignalAgent(config, log);
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(log.summary({ report }), null, 2));
      return;
    }
    const filePath = url.pathname === '/' ? join(root, 'public/index.html') : join(root, 'public', url.pathname);
    await sendFile(res, filePath);
  } catch (error) {
    res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'not_found' }));
  }
}).listen(port, () => {
  console.log(`OOBE Ace Signal Agent running at http://localhost:${port}`);
});
