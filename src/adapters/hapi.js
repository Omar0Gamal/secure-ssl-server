import { loadSSL } from '../loader.js';
import { watchFiles } from '../watcher.js';

/**
 * Creates an HTTPS Hapi server with optional watcher for certificates
 *
 * @param {Object} options
 * @param {string} options.certPath - Path to certificate
 * @param {string} options.keyPath - Path to private key
 * @param {string} [options.caPath] - Path to CA bundle
 * @param {boolean} [options.watch] - Watch files for changes
 * @param {Function} [options.onReload] - Callback on reload
 * @param {number} [options.port] - Port to listen on
 * @param {Object} server - Hapi server instance (pre-configured)
 * @returns {Promise<Object>} Hapi server instance
 */
export async function createHttpsHapiServer(options, server) {
  let ssl = loadSSL(options);
  
  const port = options.port || 443;
  
  // Configure Hapi server with TLS
  await server.connection({
    port: port,
    tls: ssl
  });

  await server.start();
  console.log(`[SSL] Hapi HTTPS server running on port ${port}`);

  if (options.watch) {
    watchFiles([options.certPath, options.keyPath], async () => {
      console.log('[SSL] Reloading certificates...');
      ssl = loadSSL(options);
      
      await server.stop();
      
      // Reconfigure with new certificates
      await server.connection({
        port: port,
        tls: ssl
      });
      
      await server.start();
      console.log('[SSL] Certificates reloaded');
      if (options.onReload) options.onReload();
    });
  }

  return server;
}
