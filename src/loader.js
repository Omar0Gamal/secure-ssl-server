import fs from 'fs';
import path from 'path';
import { validateCert, validateKey } from './validator.js';

/**
 * Loads SSL certificate, key, and optional CA.
 * Validates their format before returning.
 *
 * @param {Object} options
 * @param {string} options.certPath - Path to certificate
 * @param {string} options.keyPath - Path to private key
 * @param {string} [options.caPath] - Path to CA bundle
 * @returns {Object} { cert, key, ca }
 */
export function loadSSL({ certPath, keyPath, caPath }) {
  const certFull = path.resolve(certPath);
  const keyFull = path.resolve(keyPath);

  if (!fs.existsSync(certFull)) {
    throw new Error(`[SSL] Certificate file not found at: ${certFull}`);
  }
  if (!fs.existsSync(keyFull)) {
    throw new Error(`[SSL] Private key file not found at: ${keyFull}`);
  }

  const cert = fs.readFileSync(certFull, 'utf8');
  const key = fs.readFileSync(keyFull, 'utf8');
  const ca = caPath ? fs.readFileSync(path.resolve(caPath), 'utf8') : null;

  // Validate formats
  validateCert(cert);
  validateKey(key);

  return { cert, key, ca };
}
