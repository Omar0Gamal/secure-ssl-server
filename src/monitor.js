import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Get certificate information including expiration details
 *
 * @param {string} certPath - Path to certificate file
 * @returns {Object} Certificate information
 */
export function getCertificateInfo(certPath) {
  const certFull = path.resolve(certPath);

  if (!fs.existsSync(certFull)) {
    throw new Error(`[Monitor] Certificate file not found at: ${certFull}`);
  }

  const certContent = fs.readFileSync(certFull, 'utf8');
  
  // Parse certificate using crypto module
  const certObj = crypto.X509Certificate 
    ? new crypto.X509Certificate(certContent)
    : null;

  if (!certObj) {
    throw new Error('[Monitor] X509Certificate API not available (requires Node.js 15.6.0+)');
  }

  const validFrom = new Date(certObj.validFrom);
  const validTo = new Date(certObj.validTo);
  const now = new Date();
  
  const daysUntilExpiration = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
  const isExpired = validTo < now;

  return {
    subject: certObj.subject,
    issuer: certObj.issuer,
    validFrom,
    validTo,
    daysUntilExpiration,
    isExpired,
    serialNumber: certObj.serialNumber
  };
}

/**
 * Check if certificate is expiring soon
 *
 * @param {string} certPath - Path to certificate file
 * @param {number} thresholdDays - Warning threshold in days (default: 30)
 * @returns {boolean} True if expiring soon
 */
export function isCertificateExpiringSoon(certPath, thresholdDays = 30) {
  const info = getCertificateInfo(certPath);
  return info.daysUntilExpiration <= thresholdDays && !info.isExpired;
}

/**
 * Monitor certificate expiration and trigger alerts
 *
 * @param {string} certPath - Path to certificate file
 * @param {Object} options - Monitoring options
 * @param {number} [options.warningThreshold] - Warning threshold in days (default: 30)
 * @param {number} [options.criticalThreshold] - Critical threshold in days (default: 7)
 * @param {Function} [options.onWarning] - Callback for warnings
 * @param {Function} [options.onCritical] - Callback for critical alerts
 * @returns {Object} Monitoring control object
 */
export function monitorCertificate(certPath, options = {}) {
  const warningThreshold = options.warningThreshold || 30;
  const criticalThreshold = options.criticalThreshold || 7;
  const onWarning = options.onWarning;
  const onCritical = options.onCritical;

  let lastWarningState = null;
  let lastCriticalState = null;

  const checkCertificate = () => {
    try {
      const info = getCertificateInfo(certPath);
      const daysLeft = info.daysUntilExpiration;

      // Check for critical state
      if (daysLeft <= criticalThreshold && !info.isExpired) {
        if (lastCriticalState !== true) {
          console.error(`[Monitor] ⚠️  CRITICAL: Certificate expires in ${daysLeft} days!`);
          if (onCritical) onCritical(daysLeft);
          lastCriticalState = true;
        }
      } else {
        lastCriticalState = false;
      }

      // Check for warning state
      if (daysLeft <= warningThreshold && daysLeft > criticalThreshold && !info.isExpired) {
        if (lastWarningState !== true) {
          console.warn(`[Monitor] ⚠️  WARNING: Certificate expires in ${daysLeft} days`);
          if (onWarning) onWarning(daysLeft);
          lastWarningState = true;
        }
      } else if (daysLeft > warningThreshold) {
        lastWarningState = false;
      }

      // Check if expired
      if (info.isExpired) {
        console.error(`[Monitor] ❌ EXPIRED: Certificate expired on ${info.validTo.toISOString()}`);
        if (onCritical) onCritical(0);
      }

    } catch (error) {
      console.error('[Monitor] Error checking certificate:', error.message);
    }
  };

  // Initial check
  checkCertificate();

  // Schedule periodic checks (every 12 hours)
  const intervalId = setInterval(checkCertificate, 12 * 60 * 60 * 1000);

  // Return control object
  return {
    stop: () => {
      clearInterval(intervalId);
      console.log('[Monitor] Certificate monitoring stopped');
    },
    check: checkCertificate,
    getInfo: () => getCertificateInfo(certPath)
  };
}
