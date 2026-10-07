# Avenza

React + TypeScript + Vite interactive platform with advanced 3D visual experiences and skill passport capabilities.

## Tech Stack
- React 19 + TypeScript
- Three.js + GSAP + Lenis Smooth Scroll
- Tailwind CSS + Lucide Icons
- Vite

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

## CUSTOM DOMAIN SETUP

### Application-Side Configuration
1. **Environment Variable**: Set your production domain base URL in `.env` or your hosting provider's environment variables:
   ```bash
   VITE_SITE_URL=https://YOUR_DOMAIN_HERE
   ```
2. **Canonical & Metadata Resolution**: The application automatically reads `VITE_SITE_URL` to configure:
   - Canonical `<link rel="canonical">` tags
   - Open Graph `<meta property="og:url">` URLs
   - Absolute URLs for social cards and sharing
   - Legal routes (`/privacy` and `/terms`)
3. **Single Page Application (SPA) Routing**:
   Ensure your hosting provider is configured to rewrite all routes to `/index.html`:
   - **Vercel / Netlify / Cloudflare Pages**: Ensure single-page rewrite rules (`/* -> /index.html`) are active so `/privacy` and `/terms` can be loaded directly on initial request or hard refresh.
