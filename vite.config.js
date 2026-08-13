import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

function securityHeadersPlugin() {
  return {
    name: 'security-headers',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', PROD_CSP);
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), securityHeadersPlugin()],
  css: {
    transformer: 'postcss',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api-dialitech-core-v2.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 120000,
        proxyTimeout: 120000,
        configure(proxy) {
          proxy.on('error', (err, req, res) => {
            if (res.headersSent) {
              res.destroy();
              return;
            }
            const message = err.code === 'ECONNRESET' || /TLS|socket hang up/i.test(err.message)
              ? 'Server is starting up, please retry.'
              : 'Could not reach the server.';
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ title: 'Gateway Error', message, status: 502 }));
          });
        },
      },
      '/api/ml': {
        // En desarrollo: proxy a Netlify Functions local (netlify dev) para inyectar X-API-Key.
        // netlify dev expone functions en http://localhost:8888/.netlify/functions/*
        // En producción: Netlify redirect /api/ml/* -> /.netlify/functions/ml-proxy/*
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        timeout: 60000,
        proxyTimeout: 60000,
        rewrite: (path) => path.replace(/^\/api\/ml/, '/.netlify/functions/ml-proxy'),
        configure(proxy) {
          proxy.on('error', (err, req, res) => {
            if (res.headersSent) {
              res.destroy();
              return;
            }
            console.warn('[vite:ml-proxy] Netlify Functions no disponible. Ejecuta `netlify dev`.', err.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ title: 'Gateway Error', message: 'ML proxy not running. Use `netlify dev`.', status: 502 }));
          });
        },
      },
    },
  },
});