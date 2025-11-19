import { createHttpsExpressServer } from '../express.js';
import { createHttpsFastifyServer } from '../adapters/fastify.js';
import { createHttpsKoaServer } from '../adapters/koa.js';
import { createHttpsHapiServer } from '../adapters/hapi.js';
import { createAcmeClient } from './client.js';

/**
 * Create an HTTPS server with Let's Encrypt certificates
 *
 * @param {Object} acmeOptions - ACME/Let's Encrypt options
 * @param {Object} serverOptions - Server options (without certPath/keyPath)
 * @param {Object} app - Framework app instance
 * @param {string} framework - Framework type: 'express', 'fastify', 'koa', 'hapi'
 * @returns {Promise<Object>} Server instance
 */
export async function createHttpsServerWithLetsEncrypt(
  acmeOptions,
  serverOptions,
  app,
  framework = 'express'
) {
  // Create ACME client
  const acmeClient = createAcmeClient(acmeOptions);

  // Obtain certificates
  console.log('[SSL] Obtaining Let\'s Encrypt certificates...');
  const certPaths = await acmeClient.obtainCertificates();

  // Merge certificate paths with server options
  const fullServerOptions = {
    ...serverOptions,
    certPath: certPaths.cert,
    keyPath: certPaths.key,
    caPath: certPaths.ca
  };

  // Create server based on framework
  let server;
  switch (framework) {
    case 'express':
      server = createHttpsExpressServer(fullServerOptions, app);
      break;
    case 'fastify':
      server = createHttpsFastifyServer(fullServerOptions, app);
      break;
    case 'koa':
      server = createHttpsKoaServer(fullServerOptions, app);
      break;
    case 'hapi':
      server = await createHttpsHapiServer(fullServerOptions, app);
      break;
    default:
      throw new Error(`[SSL] Unsupported framework: ${framework}`);
  }

  // Start auto-renewal if enabled
  if (acmeOptions.autoRenew !== false) {
    acmeClient.startAutoRenewal();
  }

  // Attach ACME client to server for manual control
  server.acmeClient = acmeClient;

  return server;
}
