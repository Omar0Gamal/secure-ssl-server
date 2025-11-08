import https from 'https';
import { loadSSL } from './loader.js';
import { watchFiles } from './watcher.js';

/**
 * Creates an HTTPS Express server with optional watcher for certificates
 *
 * @param {Object} options
 * @param {string} options.certPath - Path to certificate
 * @param {string} options.keyPath - Path to private key
 * @param {boolean} [options.watch] - Watch files for changes
 * @param {Function} [options.onReload] - Callback on reload
 * @param {number} [options.port] - Port to listen on
 * @param {Object} app - Express app
 * @returns {https.Server} HTTPS server instance
 */
export function createHttpsExpressServer(options, app) {
  let ssl = loadSSL(options);
  let server = https.createServer(ssl, app);

  const port = options.port || 443;
  server.listen(port, () => {
    console.log(`[SSL] Express HTTPS server running on port ${port}`);
  });

  if (options.watch) {
    watchFiles([options.certPath, options.keyPath], () => {
      console.log('[SSL] Reloading certificates...');
      ssl = loadSSL(options);
      server.close(() => {
        server = https.createServer(ssl, app);
        server.listen(port, () => {
          console.log('[SSL] Certificates reloaded');
          if (options.onReload) options.onReload();
        });
      });
    });
  }

  return server;
}
