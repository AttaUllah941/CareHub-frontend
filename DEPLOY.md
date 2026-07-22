# CareHub frontend → Netlify

Companion guide: see `CareHub-Backend/DEPLOY.md` for the full stack (Render + Atlas).

## Quick Netlify setup

1. Deploy the **backend on Render first** and copy its URL.
2. Netlify → Site → Environment variables:

```
API_URL=https://YOUR_SERVICE.onrender.com/api/v1
SOCKET_URL=https://YOUR_SERVICE.onrender.com
```

3. Build command: `npm run build:netlify` (runs `scripts/set-env.js` then Angular production build)
4. Publish: `dist/CareHub-frontend/browser`
5. Node: `22`

After the site URL exists, set on Render:

```
FRONTEND_URL=https://YOUR_SITE.netlify.app
CORS_ORIGIN=https://YOUR_SITE.netlify.app
CORS_ALLOW_NETLIFY=true
```
