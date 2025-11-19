import express from 'express';
import { createHttpsExpressServer, monitorCertificate } from '../src/index.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello HTTPS with Express! 🔒');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', framework: 'express' });
});

// Create HTTPS server with certificate watching
const _server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443,
  watch: true,  // Auto-reload on certificate changes
  onReload: () => {
    console.log('✅ Certificates reloaded successfully!');
  }
}, app);

// Monitor certificate expiration
monitorCertificate('./certs/cert.pem', {
  warningThreshold: 30,
  criticalThreshold: 7,
  onWarning: (daysLeft) => {
    console.log(`⚠️  Certificate expires in ${daysLeft} days`);
  },
  onCritical: (daysLeft) => {
    console.error(`🚨 CRITICAL: Certificate expires in ${daysLeft} days!`);
  }
});

console.log('🚀 Express HTTPS server running at https://localhost:8443');
