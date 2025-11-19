import express from 'express';
import { createHttpsServerWithLetsEncrypt } from '../src/index.js';

async function main() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello HTTPS with Let\'s Encrypt! 🔒');
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', ssl: 'letsencrypt' });
  });

  // Create server with Let's Encrypt
  const server = await createHttpsServerWithLetsEncrypt(
  {
    email: 'your-email@example.com',
    domains: ['example.com', 'www.example.com'],
    certDir: './letsencrypt-certs',
    staging: true,  // Use staging for testing, set to false for production
    autoRenew: true,
    renewalThreshold: 30,
    challengeType: 'http-01', // or 'dns-01' for DNS validation
    onObtained: (certPaths) => {
      console.log('✅ Certificates obtained!');
      console.log('   Cert:', certPaths.cert);
      console.log('   Key:', certPaths.key);
    },
    onRenewed: (certPaths) => {
      console.log('🔄 Certificates renewed!');
    },
    onError: (error) => {
      console.error('❌ ACME Error:', error.message);
    }
  },
  {
    port: 443,
    watch: true
  },
  app,
  'express'
  );

  console.log('🚀 HTTPS server with Let\'s Encrypt running at https://example.com');

  // Access ACME client for manual control
  const acmeClient = server.acmeClient;

  // Example: Manually trigger renewal
  // await acmeClient.renewCertificates();

  // Example: Get certificate info
  const certInfo = await acmeClient.getCertificateInfo();
  console.log(`📅 Certificate expires in ${certInfo.daysUntilExpiration} days`);
}

main().catch(console.error);
