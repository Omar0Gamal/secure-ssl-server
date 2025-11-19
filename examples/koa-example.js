import Koa from 'koa';
import Router from '@koa/router';
import { createHttpsKoaServer } from '../src/index.js';

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'Hello HTTPS with Koa! 🔒';
});

router.get('/health', (ctx) => {
  ctx.body = { status: 'ok', framework: 'koa' };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Create HTTPS server
const _server = createHttpsKoaServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443,
  watch: true,
  onReload: () => {
    console.log('✅ Certificates reloaded successfully!');
  }
}, app);

console.log('🚀 Koa HTTPS server running at https://localhost:8443');
