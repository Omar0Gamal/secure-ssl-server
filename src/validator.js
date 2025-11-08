/**
 * Validates if a string contains a proper SSL certificate
 * @param {string} cert
 */
export function validateCert(cert) {
  if (!cert.includes('BEGIN CERTIFICATE')) {
    throw new Error('[SSL] Invalid certificate format');
  }
}

/**
 * Validates if a string contains a proper SSL private key
 * @param {string} key
 */
export function validateKey(key) {
  if (!key.includes('BEGIN')) {
    throw new Error('[SSL] Invalid key format');
  }
}
