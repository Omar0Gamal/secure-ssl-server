// Main export file for the package
import { loadSSL } from './loader.js';
import { validateCert, validateKey } from './validator.js';
import { watchFiles } from './watcher.js';
import { createHttpsExpressServer } from './express.js';
import { createHttpsFastifyServer } from './adapters/fastify.js';
import { createHttpsKoaServer } from './adapters/koa.js';
import { createHttpsHapiServer } from './adapters/hapi.js';
import { monitorCertificate, getCertificateInfo, isCertificateExpiringSoon } from './monitor.js';
import { createAcmeClient, obtainLetsEncryptCertificates } from './acme/client.js';
import { createHttpsServerWithLetsEncrypt } from './acme/server.js';

// Export all public APIs
export {
  // Core functions
  loadSSL,
  validateCert,
  validateKey,
  watchFiles,
  
  // Express (v1 compatibility)
  createHttpsExpressServer,
  
  // Multi-framework support (v2)
  createHttpsFastifyServer,
  createHttpsKoaServer,
  createHttpsHapiServer,
  
  // Certificate monitoring (v2)
  monitorCertificate,
  getCertificateInfo,
  isCertificateExpiringSoon,
  
  // Let's Encrypt integration (v2)
  createAcmeClient,
  obtainLetsEncryptCertificates,
  createHttpsServerWithLetsEncrypt
};
