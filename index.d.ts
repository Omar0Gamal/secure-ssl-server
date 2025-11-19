// Type definitions for secure-ssl-server v2.0.0
// Project: https://github.com/Omar0Gamal/secure-ssl-server
// Definitions by: Omar Gamal <https://github.com/Omar0Gamal>

/// <reference types="node" />

import { Server as HttpsServer } from 'https';
import { Application as ExpressApp } from 'express';

/**
 * SSL certificate content structure
 */
export interface SSLCertificate {
  cert: string;
  key: string;
  ca: string | null;
}

/**
 * Base SSL configuration options
 */
export interface SSLOptions {
  /** Path to SSL certificate file */
  certPath: string;
  /** Path to private key file */
  keyPath: string;
  /** Path to CA bundle file (optional) */
  caPath?: string;
  /** Enable file watching for automatic certificate reload */
  watch?: boolean;
  /** Callback fired when certificates are reloaded */
  onReload?: () => void;
}

/**
 * Server creation options
 */
export interface ServerOptions extends SSLOptions {
  /** Port to listen on (default: 443) */
  port?: number;
}

/**
 * Certificate expiration monitoring options
 */
export interface MonitorOptions {
  /** Warning threshold in days before expiration */
  warningThreshold?: number;
  /** Critical threshold in days before expiration */
  criticalThreshold?: number;
  /** Callback fired on warnings */
  onWarning?: (daysLeft: number) => void;
  /** Callback fired on critical alerts */
  onCritical?: (daysLeft: number) => void;
}

/**
 * Certificate information
 */
export interface CertificateInfo {
  /** Subject of the certificate */
  subject: string;
  /** Issuer of the certificate */
  issuer: string;
  /** Valid from date */
  validFrom: Date;
  /** Valid to date */
  validTo: Date;
  /** Days until expiration */
  daysUntilExpiration: number;
  /** Is certificate expired */
  isExpired: boolean;
  /** Serial number */
  serialNumber: string;
}

/**
 * Let's Encrypt ACME options
 */
export interface AcmeOptions {
  /** Email address for Let's Encrypt account */
  email: string;
  /** Domain names to obtain certificates for */
  domains: string[];
  /** Directory to store certificates (default: './certs') */
  certDir?: string;
  /** Use staging environment (default: false) */
  staging?: boolean;
  /** Enable automatic renewal (default: true) */
  autoRenew?: boolean;
  /** Renewal check interval in milliseconds (default: 86400000 - 24 hours) */
  renewalCheckInterval?: number;
  /** Days before expiration to renew (default: 30) */
  renewalThreshold?: number;
  /** Challenge type: 'http-01' or 'dns-01' (default: 'http-01') */
  challengeType?: 'http-01' | 'dns-01';
  /** Callback fired when certificates are obtained */
  onObtained?: (certPaths: { cert: string; key: string; ca: string }) => void;
  /** Callback fired when certificates are renewed */
  onRenewed?: (certPaths: { cert: string; key: string; ca: string }) => void;
  /** Callback fired on errors */
  onError?: (error: Error) => void;
}

/**
 * ACME client instance
 */
export interface AcmeClient {
  /** Obtain new certificates */
  obtainCertificates(): Promise<{ cert: string; key: string; ca: string }>;
  /** Renew existing certificates */
  renewCertificates(): Promise<{ cert: string; key: string; ca: string }>;
  /** Start automatic renewal checks */
  startAutoRenewal(): void;
  /** Stop automatic renewal checks */
  stopAutoRenewal(): void;
  /** Get certificate information */
  getCertificateInfo(): Promise<CertificateInfo>;
}

// ===== Core Functions =====

/**
 * Loads SSL certificates from the filesystem with validation
 */
export function loadSSL(options: SSLOptions): SSLCertificate;

/**
 * Validates if a string contains a proper SSL certificate
 */
export function validateCert(cert: string): void;

/**
 * Validates if a string contains a proper SSL private key
 */
export function validateKey(key: string): void;

/**
 * Watches files for changes and triggers a callback
 */
export function watchFiles(paths: string[], onChange: () => void): void;

// ===== Express Framework =====

/**
 * Creates an HTTPS Express server with optional certificate watching
 */
export function createHttpsExpressServer(
  options: ServerOptions,
  app: ExpressApp
): HttpsServer;

// ===== Fastify Framework =====

/**
 * Creates an HTTPS Fastify server with optional certificate watching
 */
export function createHttpsFastifyServer(
  options: ServerOptions,
  app: any
): HttpsServer;

// ===== Koa Framework =====

/**
 * Creates an HTTPS Koa server with optional certificate watching
 */
export function createHttpsKoaServer(
  options: ServerOptions,
  app: any
): HttpsServer;

// ===== Hapi Framework =====

/**
 * Creates an HTTPS Hapi server with optional certificate watching
 */
export function createHttpsHapiServer(
  options: ServerOptions,
  app: any
): Promise<any>;

// ===== Certificate Monitoring =====

/**
 * Monitor certificate expiration and trigger alerts
 */
export function monitorCertificate(
  certPath: string,
  options?: MonitorOptions
): void;

/**
 * Get certificate information including expiration details
 */
export function getCertificateInfo(certPath: string): CertificateInfo;

/**
 * Check if certificate is expiring soon
 */
export function isCertificateExpiringSoon(
  certPath: string,
  thresholdDays?: number
): boolean;

// ===== Let's Encrypt Integration =====

/**
 * Create an ACME client for Let's Encrypt certificate management
 */
export function createAcmeClient(options: AcmeOptions): AcmeClient;

/**
 * Obtain certificates from Let's Encrypt
 */
export function obtainLetsEncryptCertificates(
  options: AcmeOptions
): Promise<{ cert: string; key: string; ca: string }>;

/**
 * Create an HTTPS server with Let's Encrypt certificates (Express)
 */
export function createHttpsServerWithLetsEncrypt(
  acmeOptions: AcmeOptions,
  serverOptions: Omit<ServerOptions, 'certPath' | 'keyPath'>,
  app: ExpressApp,
  framework?: 'express'
): Promise<HttpsServer>;

/**
 * Create an HTTPS server with Let's Encrypt certificates (any framework)
 */
export function createHttpsServerWithLetsEncrypt(
  acmeOptions: AcmeOptions,
  serverOptions: Omit<ServerOptions, 'certPath' | 'keyPath'>,
  app: any,
  framework: 'express' | 'fastify' | 'koa' | 'hapi'
): Promise<HttpsServer | any>;
