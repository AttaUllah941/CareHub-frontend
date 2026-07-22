/**
 * Writes production environment values from Netlify (or CI) env vars
 * before `ng build`. Set these in Netlify → Site settings → Environment variables:
 *
 *   API_URL    = https://YOUR_SERVICE.onrender.com/api/v1
 *   SOCKET_URL = https://YOUR_SERVICE.onrender.com
 */
const fs = require('fs');
const path = require('path');

const apiUrl = (process.env.API_URL || '/api/v1').replace(/\/$/, '');
const socketUrl = (process.env.SOCKET_URL || '').replace(/\/$/, '');
const apiTimeoutMs = Number(process.env.API_TIMEOUT_MS || 30000);

const target = path.join(__dirname, '..', 'src', 'environments', 'environment.production.ts');

const contents = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  socketUrl: '${socketUrl}',
  apiTimeoutMs: ${apiTimeoutMs},
};
`;

fs.writeFileSync(target, contents, 'utf8');
console.log(`[set-env] Wrote ${target}`);
console.log(`[set-env] apiUrl=${apiUrl}`);
console.log(`[set-env] socketUrl=${socketUrl || '(same-origin / empty)'}`);
