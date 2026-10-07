# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

---

## CUSTOM DOMAIN SETUP

### Parameters
- **DOMAIN:** `YOUR_DOMAIN_HERE`
- **HOST:** `CURRENT_HOSTING_PROVIDER`

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

