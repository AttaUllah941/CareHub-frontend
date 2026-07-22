export const environment = {
  production: true,
  /**
   * Replace YOUR_BACKEND_URL with your live API host (no trailing slash), e.g.:
   *   apiUrl: 'https://carehub-api.onrender.com/api/v1'
   *   socketUrl: 'https://carehub-api.onrender.com'
   *
   * Or keep relative paths and set Netlify redirects in netlify.toml to proxy /api and /uploads.
   */
  apiUrl: '/api/v1',
  socketUrl: '',
  apiTimeoutMs: 30000,
};
