// test/loader.test.js
import fs from 'fs';
import path from 'path';
import { loadSSL } from '../src/loader.js';

const tempCertPath = path.join(__dirname, 'temp-cert.pem');
const tempKeyPath = path.join(__dirname, 'temp-key.pem');

beforeAll(() => {
  // Create dummy valid cert and key files for testing
  fs.writeFileSync(tempCertPath, '-----BEGIN CERTIFICATE-----\nDummyCertificate\n-----END CERTIFICATE-----');
  fs.writeFileSync(tempKeyPath, '-----BEGIN PRIVATE KEY-----\nDummyKey\n-----END PRIVATE KEY-----');
});

afterAll(() => {
  // Clean up temp files
  fs.unlinkSync(tempCertPath);
  fs.unlinkSync(tempKeyPath);
});

describe('loadSSL', () => {
  it('should load cert and key correctly', () => {
    const ssl = loadSSL({ certPath: tempCertPath, keyPath: tempKeyPath });
    expect(ssl.cert).toContain('BEGIN CERTIFICATE');
    expect(ssl.key).toContain('BEGIN PRIVATE KEY');
    expect(ssl.ca).toBeNull();
  });

  it('should throw error if cert file is missing', () => {
    expect(() => {
      loadSSL({ certPath: 'nonexistent-cert.pem', keyPath: tempKeyPath });
    }).toThrow(/Certificate file not found/);
  });

  it('should throw error if key file is missing', () => {
    expect(() => {
      loadSSL({ certPath: tempCertPath, keyPath: 'nonexistent-key.pem' });
    }).toThrow(/Private key file not found/);
  });

  it('should throw error if cert format is invalid', () => {
    const invalidCertPath = path.join(__dirname, 'invalid-cert.pem');
    fs.writeFileSync(invalidCertPath, 'INVALID CERT CONTENT');

    expect(() => {
      loadSSL({ certPath: invalidCertPath, keyPath: tempKeyPath });
    }).toThrow(/Invalid certificate format/);

    fs.unlinkSync(invalidCertPath);
  });

  it('should throw error if key format is invalid', () => {
    const invalidKeyPath = path.join(__dirname, 'invalid-key.pem');
    fs.writeFileSync(invalidKeyPath, 'INVALID KEY CONTENT');

    expect(() => {
      loadSSL({ certPath: tempCertPath, keyPath: invalidKeyPath });
    }).toThrow(/Invalid key format/);

    fs.unlinkSync(invalidKeyPath);
  });
});
