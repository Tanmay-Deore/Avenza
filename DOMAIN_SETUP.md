# AVENZA — Custom Domain Setup Guide

## CUSTOM DOMAIN SETUP

### Placeholders
- **DOMAIN:** `YOUR_DOMAIN_HERE`
- **HOST:** `CURRENT_HOSTING_PROVIDER`

---

## 1. Application-Side Configuration

1. **Configure Base Site URL:**
   In your production deployment environment or `.env` file, specify your domain:
   ```env
   VITE_SITE_URL=https://YOUR_DOMAIN_HERE
   ```
   *(Do not include a trailing slash.)*

2. **Metadata & Open Graph Resolution:**
   The application uses `src/services/siteConfig.ts` to automatically populate:
   - `<link rel="canonical" href="https://YOUR_DOMAIN_HERE/...">`
   - `<meta property="og:url" content="https://YOUR_DOMAIN_HERE/...">`
   - `<meta name="twitter:image" content="https://YOUR_DOMAIN_HERE/icon-512.png">`
   - Dynamically adapts to subroutes `/privacy` and `/terms`.

3. **SPA Fallback Routing:**
   Because AVENZA is a single-page application built on Vite and React:
   - All browser requests (e.g. `https://YOUR_DOMAIN_HERE/privacy`, `https://YOUR_DOMAIN_HERE/terms`) must route to `index.html`.
   - **Vercel**: Handled automatically or via `vercel.json`:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```
   - **Netlify**: Ensure `public/_redirects` exists with `/* /index.html 200`.
   - **Cloudflare Pages / Nginx**: Rewrite 404 to `/index.html`.

---

## 2. DNS & Provider Configuration

Follow your hosting provider's (`CURRENT_HOSTING_PROVIDER`) instructions to connect `YOUR_DOMAIN_HERE`:
1. Add the custom domain in your host's dashboard.
2. Configure the recommended CNAME or A records provided by your specific host.
3. Verify SSL certificate issuance (Let's Encrypt / Cloudflare SSL).
4. AVENZA does not display "Custom domain connected" or claim domain verification status until real DNS and SSL provisioning is complete on your provider.
