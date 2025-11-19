import Fastify from 'fastify';
import { createHttpsFastifyServer } from '../src/index.js';

const app = Fastify({
  logger: true
});

app.get('/', async () => {
  return { message: 'Hello HTTPS with Fastify! 🔒' };
});

app.get('/health', async () => {
  return { status: 'ok', framework: 'fastify' };
});

// Create HTTPS server
const _server = createHttpsFastifyServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443,
  watch: true,
  onReload: () => {
    console.log('✅ Certificates reloaded successfully!');
  }
}, app);

console.log('🚀 Fastify HTTPS server running at https://localhost:8443');
