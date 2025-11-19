import https from 'https';
import { loadSSL } from '../loader.js';
import { watchFiles } from '../watcher.js';

/**
 * Creates an HTTPS Koa server with optional watcher for certificates
 *
 * @param {Object} options
 * @param {string} options.certPath - Path to certificate
 * @param {string} options.keyPath - Path to private key
 * @param {string} [options.caPath] - Path to CA bundle
 * @param {boolean} [options.watch] - Watch files for changes
 * @param {Function} [options.onReload] - Callback on reload
 * @param {number} [options.port] - Port to listen on
 * @param {Object} app - Koa app instance
 * @returns {https.Server} HTTPS server instance
 */
export function createHttpsKoaServer(options, app) {
  let ssl = loadSSL(options);
  
  const port = options.port || 443;
  
  // Create HTTPS server with Koa's callback
  let server = https.createServer(ssl, app.callback());

  server.listen(port, () => {
    console.log(`[SSL] Koa HTTPS server running on port ${port}`);
  });

  if (options.watch) {
    watchFiles([options.certPath, options.keyPath], () => {
      console.log('[SSL] Reloading certificates...');
      ssl = loadSSL(options);
      server.close(() => {
        server = https.createServer(ssl, app.callback());
        server.listen(port, () => {
          console.log('[SSL] Certificates reloaded');
          if (options.onReload) options.onReload();
        });
      });
    });
  }

  return server;
}
