# secure-ssl-server v2.0 - Upgrade Guide

Welcome to secure-ssl-server v2.0! This guide will help you upgrade from v1.x and take advantage of the new features.

## 🎉 What's New in v2.0

### 🌐 Multi-Framework Support
- **Express** (v1 compatible)
- **Fastify** (NEW)
- **Koa** (NEW)
- **Hapi** (NEW)

### 🔐 Let's Encrypt Integration
- Automatic certificate obtainment
- Auto-renewal with configurable thresholds
- HTTP-01 and DNS-01 challenge support
- ACME client for manual control

### 📊 Certificate Monitoring
- Real-time expiration tracking
- Configurable warning and critical alerts
- Certificate information extraction
- Automated monitoring with callbacks

### 📝 TypeScript Support
- Full type definitions included
- IntelliSense support in VSCode
- Type-safe API usage

## 📦 Installation

```bash
npm install secure-ssl-server@2.0.0
```

## ✅ Backward Compatibility

**Good news!** v2.0 is 100% backward compatible with v1.x. Your existing code will continue to work without any changes.

```javascript
// v1.x code - still works perfectly in v2.0!
import { createHttpsExpressServer } from 'secure-ssl-server';

const server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443
}, app);
```

## 🚀 New Features Usage

### Multi-Framework Support

#### Fastify

```javascript
import Fastify from 'fastify';
import { createHttpsFastifyServer } from 'secure-ssl-server';

const app = Fastify();
const server = createHttpsFastifyServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443
}, app);
```

#### Koa

```javascript
import Koa from 'koa';
import { createHttpsKoaServer } from 'secure-ssl-server';

const app = new Koa();
const server = createHttpsKoaServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443
}, app);
```

#### Hapi

```javascript
import Hapi from '@hapi/hapi';
import { createHttpsHapiServer } from 'secure-ssl-server';

const server = Hapi.server();
await createHttpsHapiServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443
}, server);
```

### Let's Encrypt Integration

Replace manual certificate management with automatic Let's Encrypt:

**Before (v1.x):**
```javascript
// Manual certificate files
const server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 443
}, app);
```

**After (v2.0):**
```javascript
// Automatic Let's Encrypt
const server = await createHttpsServerWithLetsEncrypt(
  {
    email: 'admin@example.com',
    domains: ['example.com'],
    autoRenew: true
  },
  { port: 443 },
  app,
  'express'
);
```

### Certificate Monitoring

Add proactive certificate expiration monitoring:

```javascript
import { monitorCertificate } from 'secure-ssl-server';

const monitor = monitorCertificate('./certs/cert.pem', {
  warningThreshold: 30,
  criticalThreshold: 7,
  onWarning: (daysLeft) => {
    console.log(`⚠️  Certificate expires in ${daysLeft} days`);
    // Send notification
  },
  onCritical: (daysLeft) => {
    console.error(`🚨 CRITICAL: ${daysLeft} days left!`);
    // Send urgent alert
  }
});
```

## 🔄 Migration Checklist

- [ ] Update package: `npm install secure-ssl-server@2.0.0`
- [ ] Test existing functionality (should work without changes)
- [ ] Consider adding certificate monitoring
- [ ] Evaluate Let's Encrypt integration for production
- [ ] Update TypeScript types if using TypeScript
- [ ] Review new configuration options
- [ ] Update documentation/README

## 📚 API Changes

### New Exports

```javascript
import {
  // v1.x (still available)
  createHttpsExpressServer,
  loadSSL,
  
  // v2.0 additions
  createHttpsFastifyServer,
  createHttpsKoaServer,
  createHttpsHapiServer,
  createHttpsServerWithLetsEncrypt,
  createAcmeClient,
  obtainLetsEncryptCertificates,
  monitorCertificate,
  getCertificateInfo,
  isCertificateExpiringSoon,
  validateCert,
  validateKey,
  watchFiles
} from 'secure-ssl-server';
```

### No Breaking Changes

All v1.x APIs remain unchanged:
- `createHttpsExpressServer()` - Same signature, same behavior
- `loadSSL()` - Same signature, same behavior
- Certificate watching - Same behavior
- Error handling - Same behavior

## 🔧 Configuration Enhancements

### Server Options (All Frameworks)

```javascript
{
  certPath: string,        // Path to certificate (required)
  keyPath: string,         // Path to private key (required)
  caPath?: string,         // Path to CA bundle (optional)
  port?: number,           // Port (default: 443)
  watch?: boolean,         // Watch for cert changes (default: false)
  onReload?: Function      // Reload callback (optional)
}
```

### ACME Options (Let's Encrypt)

```javascript
{
  email: string,                    // Required
  domains: string[],                // Required
  certDir?: string,                 // Default: './certs'
  staging?: boolean,                // Default: false
  autoRenew?: boolean,              // Default: true
  renewalCheckInterval?: number,    // Default: 86400000 (24h)
  renewalThreshold?: number,        // Default: 30 days
  challengeType?: 'http-01' | 'dns-01', // Default: 'http-01'
  onObtained?: Function,
  onRenewed?: Function,
  onError?: Function
}
```

### Monitor Options

```javascript
{
  warningThreshold?: number,   // Default: 30 days
  criticalThreshold?: number,  // Default: 7 days
  onWarning?: Function,
  onCritical?: Function
}
```

## 💡 Best Practices

### Development

```javascript
// Use self-signed certificates with monitoring
const server = createHttpsExpressServer({
  certPath: './dev-certs/cert.pem',
  keyPath: './dev-certs/key.pem',
  port: 8443,
  watch: true
}, app);

monitorCertificate('./dev-certs/cert.pem');
```

### Production

```javascript
// Use Let's Encrypt with auto-renewal
const server = await createHttpsServerWithLetsEncrypt(
  {
    email: 'admin@example.com',
    domains: ['example.com', 'www.example.com'],
    staging: false,
    autoRenew: true,
    renewalThreshold: 30,
    onRenewed: (certPaths) => {
      console.log('Certificates renewed');
      // Notify monitoring system
    }
  },
  {
    port: 443,
    watch: true
  },
  app
);
```

## 🐛 Troubleshooting

### Issue: Module not found errors
**Solution:** Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
**Solution:** Update your tsconfig.json to include type definitions
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Issue: Let's Encrypt challenges failing
**Solution:** 
- Ensure port 80 is accessible for HTTP-01
- Verify DNS records for DNS-01
- Use staging environment for testing
- Check domain points to your server

## 📖 Further Reading

- [Full API Documentation](./README.md#-api-reference)
- [Examples](./examples/)
- [Changelog](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)

## 🆘 Getting Help

- [GitHub Issues](https://github.com/Omar0Gamal/secure-ssl-server/issues)
- [Documentation](https://github.com/Omar0Gamal/secure-ssl-server#readme)

## 🎊 Welcome to v2.0!

Thank you for upgrading! We hope you enjoy the new features and improvements.
