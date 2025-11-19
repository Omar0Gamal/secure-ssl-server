import { describe, it, expect } from '@jest/globals';

describe('Certificate Monitoring', () => {
  describe('Module Exports', () => {
    it('should export getCertificateInfo function', async () => {
      const { getCertificateInfo } = await import('../src/monitor.js');
      expect(typeof getCertificateInfo).toBe('function');
    });

    it('should export isCertificateExpiringSoon function', async () => {
      const { isCertificateExpiringSoon } = await import('../src/monitor.js');
      expect(typeof isCertificateExpiringSoon).toBe('function');
    });

    it('should export monitorCertificate function', async () => {
      const { monitorCertificate } = await import('../src/monitor.js');
      expect(typeof monitorCertificate).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-existent certificate', async () => {
      const { getCertificateInfo } = await import('../src/monitor.js');
      expect(() => {
        getCertificateInfo('/non/existent/cert.pem');
      }).toThrow('Certificate file not found');
    });
  });
});
