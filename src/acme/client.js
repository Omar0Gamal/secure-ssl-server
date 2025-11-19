import acme from 'acme-client';
import fs from 'fs';
import path from 'path';
import { getCertificateInfo } from '../monitor.js';

/**
 * ACME Client for Let's Encrypt certificate management
 */
export class AcmeClient {
  constructor(options) {
    this.email = options.email;
    this.domains = options.domains;
    this.certDir = options.certDir || './certs';
    this.staging = options.staging || false;
    this.autoRenew = options.autoRenew !== false;
    this.renewalCheckInterval = options.renewalCheckInterval || 86400000; // 24 hours
    this.renewalThreshold = options.renewalThreshold || 30; // days
    this.challengeType = options.challengeType || 'http-01';
    this.onObtained = options.onObtained;
    this.onRenewed = options.onRenewed;
    this.onError = options.onError;
    
    this.client = null;
    this.renewalTimer = null;
    
    // Ensure cert directory exists
    if (!fs.existsSync(this.certDir)) {
      fs.mkdirSync(this.certDir, { recursive: true });
    }
  }

  /**
   * Initialize the ACME client
   */
  async _initClient() {
    if (this.client) return;

    const directoryUrl = this.staging
      ? acme.directory.letsencrypt.staging
      : acme.directory.letsencrypt.production;

    this.client = new acme.Client({
      directoryUrl,
      accountKey: await acme.crypto.createPrivateKey()
    });
  }

  /**
   * Challenge handler for HTTP-01
   */
  async _handleHttpChallenge(authz, challenge, keyAuthorization) {
    const challengePath = path.join(this.certDir, '.well-known', 'acme-challenge');
    if (!fs.existsSync(challengePath)) {
      fs.mkdirSync(challengePath, { recursive: true });
    }

    const token = challenge.token;
    const filePath = path.join(challengePath, token);
    
    // Write challenge response
    fs.writeFileSync(filePath, keyAuthorization);
    
    console.log(`[ACME] HTTP-01 challenge file created: ${filePath}`);
    console.log(`[ACME] Make sure this file is accessible at: http://${authz.identifier.value}/.well-known/acme-challenge/${token}`);
    
    return () => {
      // Cleanup function
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };
  }

  /**
   * Challenge handler for DNS-01
   */
  async _handleDnsChallenge(authz, _challenge, keyAuthorization) {
    const dnsRecord = `_acme-challenge.${authz.identifier.value}`;
    const dnsValue = keyAuthorization;
    
    console.log('[ACME] DNS-01 challenge required:');
    console.log(`[ACME] Create TXT record: ${dnsRecord}`);
    console.log(`[ACME] With value: ${dnsValue}`);
    console.log('[ACME] Waiting for DNS propagation...');
    
    // Wait for user to set up DNS record
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
    
    return () => {
      console.log(`[ACME] You can now remove the DNS TXT record: ${dnsRecord}`);
    };
  }

  /**
   * Obtain new certificates from Let's Encrypt
   */
  async obtainCertificates() {
    try {
      await this._initClient();

      console.log(`[ACME] Obtaining certificates for: ${this.domains.join(', ')}`);

      // Create Certificate Signing Request (CSR)
      const [key, csr] = await acme.crypto.createCsr({
        commonName: this.domains[0],
        altNames: this.domains.slice(1)
      });

      // Order certificate
      const cert = await this.client.auto({
        csr,
        email: this.email,
        termsOfServiceAgreed: true,
        challengePriority: [this.challengeType],
        challengeCreateFn: async (authz, challenge, keyAuthorization) => {
          if (challenge.type === 'http-01') {
            return this._handleHttpChallenge(authz, challenge, keyAuthorization);
          } else if (challenge.type === 'dns-01') {
            return this._handleDnsChallenge(authz, challenge, keyAuthorization);
          }
        },
        challengeRemoveFn: async (_authz, _challenge, _keyAuthorization) => {
          console.log(`[ACME] Challenge completed for ${_authz.identifier.value}`);
        }
      });

      // Save certificates
      const certPath = path.join(this.certDir, 'cert.pem');
      const keyPath = path.join(this.certDir, 'key.pem');
      const caPath = path.join(this.certDir, 'ca.pem');

      fs.writeFileSync(certPath, cert);
      fs.writeFileSync(keyPath, key);
      
      // Extract CA from certificate chain if available
      const certChain = cert.split('-----END CERTIFICATE-----');
      if (certChain.length > 1) {
        const ca = certChain.slice(1).join('-----END CERTIFICATE-----');
        fs.writeFileSync(caPath, ca);
      }

      console.log('[ACME] Certificates obtained successfully!');
      console.log(`[ACME] Certificate: ${certPath}`);
      console.log(`[ACME] Private Key: ${keyPath}`);

      const result = { cert: certPath, key: keyPath, ca: caPath };
      
      if (this.onObtained) {
        this.onObtained(result);
      }

      return result;
    } catch (error) {
      console.error('[ACME] Failed to obtain certificates:', error.message);
      if (this.onError) {
        this.onError(error);
      }
      throw error;
    }
  }

  /**
   * Renew existing certificates
   */
  async renewCertificates() {
    try {
      console.log('[ACME] Renewing certificates...');
      
      const result = await this.obtainCertificates();
      
      console.log('[ACME] Certificates renewed successfully!');
      
      if (this.onRenewed) {
        this.onRenewed(result);
      }
      
      return result;
    } catch (error) {
      console.error('[ACME] Failed to renew certificates:', error.message);
      if (this.onError) {
        this.onError(error);
      }
      throw error;
    }
  }

  /**
   * Check if certificates need renewal
   */
  async _checkRenewal() {
    const certPath = path.join(this.certDir, 'cert.pem');
    
    if (!fs.existsSync(certPath)) {
      console.log('[ACME] No certificate found, obtaining new certificates...');
      await this.obtainCertificates();
      return;
    }

    try {
      const certInfo = getCertificateInfo(certPath);
      
      if (certInfo.daysUntilExpiration <= this.renewalThreshold) {
        console.log(`[ACME] Certificate expiring in ${certInfo.daysUntilExpiration} days, renewing...`);
        await this.renewCertificates();
      } else {
        console.log(`[ACME] Certificate valid for ${certInfo.daysUntilExpiration} more days`);
      }
    } catch (error) {
      console.error('[ACME] Error checking certificate:', error.message);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  /**
   * Start automatic renewal checks
   */
  startAutoRenewal() {
    if (!this.autoRenew) {
      console.log('[ACME] Auto-renewal is disabled');
      return;
    }

    console.log(`[ACME] Starting automatic renewal checks (every ${this.renewalCheckInterval / 1000 / 60 / 60} hours)`);
    
    // Initial check
    this._checkRenewal();
    
    // Schedule periodic checks
    this.renewalTimer = setInterval(() => {
      this._checkRenewal();
    }, this.renewalCheckInterval);
  }

  /**
   * Stop automatic renewal checks
   */
  stopAutoRenewal() {
    if (this.renewalTimer) {
      clearInterval(this.renewalTimer);
      this.renewalTimer = null;
      console.log('[ACME] Automatic renewal checks stopped');
    }
  }

  /**
   * Get certificate information
   */
  async getCertificateInfo() {
    const certPath = path.join(this.certDir, 'cert.pem');
    
    if (!fs.existsSync(certPath)) {
      throw new Error('[ACME] No certificate found');
    }
    
    return getCertificateInfo(certPath);
  }
}

/**
 * Create an ACME client for Let's Encrypt certificate management
 */
export function createAcmeClient(options) {
  return new AcmeClient(options);
}

/**
 * Obtain certificates from Let's Encrypt (one-time operation)
 */
export async function obtainLetsEncryptCertificates(options) {
  const client = new AcmeClient(options);
  return await client.obtainCertificates();
}
