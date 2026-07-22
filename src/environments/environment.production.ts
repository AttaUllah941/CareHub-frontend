export const environment = {
  production: true,
  // Overwritten at Netlify build time by scripts/set-env.js (API_URL / SOCKET_URL).
  apiUrl: '/api/v1',
  socketUrl: '',
  apiTimeoutMs: 30000,
};
