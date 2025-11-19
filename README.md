# secure-ssl-server

> 🔒 Effortless HTTPS server creation for Node.js with multi-framework support, automatic certificate reloading, and Let's Encrypt integration

A comprehensive SSL/TLS helper that simplifies HTTPS server setup across multiple Node.js frameworks. Perfect for development and production environments with built-in certificate management, monitoring, and Let's Encrypt integration.

[![npm version](https://img.shields.io/npm/v/secure-ssl-server.svg)](https://www.npmjs.com/package/secure-ssl-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/node/v/secure-ssl-server.svg)](https://nodejs.org)

## ✨ Features

- **🚀 Quick Setup** - Create HTTPS servers with a single function call
- **🌐 Multi-Framework** - Support for Express, Fastify, Koa, and Hapi
- **🔄 Auto-Reload** - Watch SSL certificates and automatically reload when they change
- **🔐 Let's Encrypt** - Built-in ACME client with automatic certificate renewal
- **📊 Monitoring** - Certificate expiration monitoring with customizable alerts
- **🛡️ Secure by Default** - Built-in certificate validation and error handling
- **📦 Lightweight** - Minimal dependencies, optimized footprint
- **⚡ Production Ready** - Battle-tested in production environments
- **📝 TypeScript** - Full TypeScript definitions included

## 📋 Requirements

- Node.js 14.0.0 or higher
- SSL certificate and private key files (or use Let's Encrypt integration)
- One of the supported frameworks: Express, Fastify, Koa, or Hapi (optional)

## 📦 Installation

```bash
npm install secure-ssl-server
```

## 🚀 Quick Start

### Express

```javascript
import express from 'express';
import { createHttpsExpressServer } from 'secure-ssl-server';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello HTTPS! 🔒');
});

const server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443
}, app);
```

### Fastify

```javascript
import Fastify from 'fastify';
import { createHttpsFastifyServer } from 'secure-ssl-server';

const app = Fastify();

app.get('/', async (request, reply) => {
  return { hello: 'HTTPS! 🔒' };
});

const server = createHttpsFastifyServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443
}, app);
```

### Koa

```javascript
import Koa from 'koa';
import { createHttpsKoaServer } from 'secure-ssl-server';

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello HTTPS! 🔒';
});

const server = createHttpsKoaServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 8443
}, app);
```

### Let's Encrypt (Express)

```javascript
import express from 'express';
import { createHttpsServerWithLetsEncrypt } from 'secure-ssl-server';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello HTTPS with Let\'s Encrypt! 🔒');
});

const server = await createHttpsServerWithLetsEncrypt(
  {
    email: 'your-email@example.com',
    domains: ['example.com', 'www.example.com'],
    staging: false, // Use production Let's Encrypt
    autoRenew: true
  },
  {
    port: 443,
    watch: true
  },
  app,
  'express'
);
```

## 📖 Usage

### Basic HTTPS Server (Express)

```javascript
import express from 'express';
import { createHttpsExpressServer } from 'secure-ssl-server';

const app = express();

const server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  port: 443
}, app);
```

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

### With Certificate Watching

Enable automatic certificate reloading when files change:

```javascript
const server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  watch: true,  // Enable file watching
  port: 8443,
  onReload: () => {
    console.log('Certificates have been reloaded! 🔄');
  }
}, app);
```

### With CA Bundle

For certificates that require intermediate certificates:

```javascript
const server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  caPath: './certs/ca-bundle.pem',  // Optional CA bundle
  port: 8443
}, app);
```

### Manual Certificate Loading

For more control, you can load certificates separately:

```javascript
import { loadSSL } from 'secure-ssl-server';
import https from 'https';
import express from 'express';

const app = express();
const ssl = loadSSL({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem'
});

const server = https.createServer(ssl, app);
server.listen(8443);
```

### Certificate Monitoring

Monitor certificate expiration and receive alerts:

```javascript
import { monitorCertificate } from 'secure-ssl-server';

const monitor = monitorCertificate('./certs/cert.pem', {
  warningThreshold: 30,  // Warning 30 days before expiration
  criticalThreshold: 7,  // Critical alert 7 days before
  onWarning: (daysLeft) => {
    console.log(`⚠️  Certificate expires in ${daysLeft} days`);
    // Send notification, email, etc.
  },
  onCritical: (daysLeft) => {
    console.error(`🚨 CRITICAL: Certificate expires in ${daysLeft} days!`);
    // Send urgent alert
  }
});

// Get certificate information
const info = monitor.getInfo();
console.log(`Certificate valid until: ${info.validTo}`);
console.log(`Days until expiration: ${info.daysUntilExpiration}`);

// Stop monitoring
// monitor.stop();
```

### Let's Encrypt Integration

#### Automatic Certificate Management

```javascript
import express from 'express';
import { createHttpsServerWithLetsEncrypt } from 'secure-ssl-server';

const app = express();

// Create server with Let's Encrypt
const server = await createHttpsServerWithLetsEncrypt(
  {
    email: 'admin@example.com',
    domains: ['example.com', 'www.example.com'],
    certDir: './letsencrypt-certs',
    staging: false,  // Use production environment
    autoRenew: true, // Automatic renewal
    renewalThreshold: 30, // Renew 30 days before expiration
    challengeType: 'http-01', // or 'dns-01'
    onObtained: (certPaths) => {
      console.log('✅ Certificates obtained!', certPaths);
    },
    onRenewed: (certPaths) => {
      console.log('🔄 Certificates renewed!', certPaths);
    },
    onError: (error) => {
      console.error('❌ ACME Error:', error);
    }
  },
  {
    port: 443,
    watch: true
  },
  app,
  'express' // or 'fastify', 'koa', 'hapi'
);

// Access ACME client for manual control
const acmeClient = server.acmeClient;

// Manually renew certificates
await acmeClient.renewCertificates();

// Stop automatic renewal
acmeClient.stopAutoRenewal();
```

#### Manual Certificate Obtainment

```javascript
import { obtainLetsEncryptCertificates } from 'secure-ssl-server';

const certPaths = await obtainLetsEncryptCertificates({
  email: 'admin@example.com',
  domains: ['example.com'],
  certDir: './certs',
  staging: true // Use staging for testing
});

console.log('Certificate:', certPaths.cert);
console.log('Private Key:', certPaths.key);
console.log('CA Bundle:', certPaths.ca);
```

#### ACME Client Control

```javascript
import { createAcmeClient } from 'secure-ssl-server';

const acmeClient = createAcmeClient({
  email: 'admin@example.com',
  domains: ['example.com'],
  certDir: './certs'
});

// Obtain certificates
await acmeClient.obtainCertificates();

// Start automatic renewal checks
acmeClient.startAutoRenewal();

// Get certificate info
const info = await acmeClient.getCertificateInfo();
console.log(`Expires in ${info.daysUntilExpiration} days`);

// Stop auto-renewal
acmeClient.stopAutoRenewal();
```

## 🔧 API Reference

### Server Creation

#### `createHttpsExpressServer(options, app)`

Creates and starts an HTTPS server with Express.

**Parameters:**
- `options` - Configuration object
  - `certPath` (string) - Path to SSL certificate file
  - `keyPath` (string) - Path to private key file
  - `caPath` (string, optional) - Path to CA bundle file
  - `port` (number, default: 443) - Port to listen on
  - `watch` (boolean, default: false) - Enable certificate file watching
  - `onReload` (function, optional) - Callback fired when certificates are reloaded
- `app` - Express application instance

**Returns:** `https.Server`

#### `createHttpsFastifyServer(options, app)`

Creates and starts an HTTPS server with Fastify.

**Parameters:** Same as `createHttpsExpressServer`  
**Returns:** `https.Server`

#### `createHttpsKoaServer(options, app)`

Creates and starts an HTTPS server with Koa.

**Parameters:** Same as `createHttpsExpressServer`  
**Returns:** `https.Server`

#### `createHttpsHapiServer(options, server)`

Creates and starts an HTTPS server with Hapi.

**Parameters:** Same as `createHttpsExpressServer`  
**Returns:** `Promise<HapiServer>`

### Certificate Management

#### `loadSSL(options)`

Loads SSL certificates from the filesystem with validation.

**Parameters:**
- `options` - Configuration object
  - `certPath` (string) - Path to SSL certificate file
  - `keyPath` (string) - Path to private key file
  - `caPath` (string, optional) - Path to CA bundle file

**Returns:** `{ cert: string, key: string, ca: string|null }`

#### `validateCert(cert)`

Validates if a string contains a proper SSL certificate.

**Parameters:**
- `cert` (string) - Certificate content

**Throws:** Error if invalid

#### `validateKey(key)`

Validates if a string contains a proper SSL private key.

**Parameters:**
- `key` (string) - Private key content

**Throws:** Error if invalid

### Certificate Monitoring

#### `monitorCertificate(certPath, options)`

Monitor certificate expiration and trigger alerts.

**Parameters:**
- `certPath` (string) - Path to certificate file
- `options` (object, optional) - Monitoring options
  - `warningThreshold` (number, default: 30) - Warning threshold in days
  - `criticalThreshold` (number, default: 7) - Critical threshold in days
  - `onWarning` (function) - Callback for warnings
  - `onCritical` (function) - Callback for critical alerts

**Returns:** `{ stop: function, check: function, getInfo: function }`

#### `getCertificateInfo(certPath)`

Get certificate information including expiration details.

**Parameters:**
- `certPath` (string) - Path to certificate file

**Returns:** Object with certificate details:
```javascript
{
  subject: string,
  issuer: string,
  validFrom: Date,
  validTo: Date,
  daysUntilExpiration: number,
  isExpired: boolean,
  serialNumber: string
}
```

#### `isCertificateExpiringSoon(certPath, thresholdDays)`

Check if certificate is expiring soon.

**Parameters:**
- `certPath` (string) - Path to certificate file
- `thresholdDays` (number, default: 30) - Threshold in days

**Returns:** `boolean`

### Let's Encrypt / ACME

#### `createHttpsServerWithLetsEncrypt(acmeOptions, serverOptions, app, framework)`

Create an HTTPS server with Let's Encrypt certificates.

**Parameters:**
- `acmeOptions` - ACME configuration
  - `email` (string) - Email address for Let's Encrypt account
  - `domains` (string[]) - Domain names to obtain certificates for
  - `certDir` (string, default: './certs') - Directory to store certificates
  - `staging` (boolean, default: false) - Use staging environment
  - `autoRenew` (boolean, default: true) - Enable automatic renewal
  - `renewalCheckInterval` (number, default: 86400000) - Check interval in ms
  - `renewalThreshold` (number, default: 30) - Renew N days before expiration
  - `challengeType` (string, default: 'http-01') - Challenge type: 'http-01' or 'dns-01'
  - `onObtained` (function) - Callback when certificates obtained
  - `onRenewed` (function) - Callback when certificates renewed
  - `onError` (function) - Callback on errors
- `serverOptions` - Server options (without certPath/keyPath)
  - `port` (number)
  - `watch` (boolean)
  - `onReload` (function)
- `app` - Framework app instance
- `framework` (string, default: 'express') - Framework: 'express', 'fastify', 'koa', 'hapi'

**Returns:** `Promise<https.Server>`

#### `createAcmeClient(options)`

Create an ACME client for Let's Encrypt certificate management.

**Parameters:** Same as `acmeOptions` above

**Returns:** `AcmeClient` instance with methods:
- `obtainCertificates()` - Obtain new certificates
- `renewCertificates()` - Renew existing certificates
- `startAutoRenewal()` - Start automatic renewal checks
- `stopAutoRenewal()` - Stop automatic renewal checks
- `getCertificateInfo()` - Get certificate information

#### `obtainLetsEncryptCertificates(options)`

One-time certificate obtainment from Let's Encrypt.

**Parameters:** Same as `acmeOptions` above

**Returns:** `Promise<{ cert: string, key: string, ca: string }>`

## 🔐 Generating Self-Signed Certificates

For development purposes, you can generate self-signed certificates:

```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Run tests with coverage
npm run test:coverage
```

## 🗺️ Version History

### v2.0.0 (Current)

- ✅ Multi-framework support (Express, Fastify, Koa, Hapi)
- ✅ Let's Encrypt integration with automatic certificate renewal
- ✅ Certificate expiration monitoring and alerts
- ✅ Enhanced configuration options
- ✅ Full TypeScript definitions
- ✅ ACME client with HTTP-01 and DNS-01 challenge support

### v1.0.0

- Basic Express HTTPS server creation
- Certificate file watching
- CA bundle support

## 🔄 Migration Guide (v1 → v2)

Version 2.0 is fully backward compatible with v1.x. All existing code will continue to work.

### New Features Available

```javascript
// v1.x - Still works!
import { createHttpsExpressServer } from 'secure-ssl-server';

// v2.0 - New multi-framework support
import { 
  createHttpsFastifyServer,
  createHttpsKoaServer,
  createHttpsHapiServer
} from 'secure-ssl-server';

// v2.0 - New monitoring features
import { monitorCertificate, getCertificateInfo } from 'secure-ssl-server';

// v2.0 - New Let's Encrypt integration
import { createHttpsServerWithLetsEncrypt } from 'secure-ssl-server';
```

## ❓ FAQ

**Q: Does this work in production?**  
A: Yes! The package is production-ready and battle-tested, especially useful for applications that need dynamic certificate management.

**Q: Can I use this with Let's Encrypt?**  
A: Yes! v2.0 includes full Let's Encrypt integration with automatic certificate renewal. See the Let's Encrypt Integration section for details.

**Q: What frameworks are supported?**  
A: Express, Fastify, Koa, and Hapi are officially supported with dedicated adapters.

**Q: What happens if certificate files are invalid?**  
A: The package validates certificates on load and throws descriptive errors if formats are invalid.

**Q: Does watching certificates impact performance?**  
A: No, the file watcher is efficient and only triggers on actual file changes.

**Q: How does automatic certificate renewal work?**  
A: The ACME client checks certificate expiration periodically (default: every 24 hours) and automatically renews certificates when they're within the renewal threshold (default: 30 days before expiration).

**Q: Can I use DNS-01 challenges with Let's Encrypt?**  
A: Yes, set `challengeType: 'dns-01'` in the ACME options. You'll need to manually configure DNS TXT records as instructed in the console output.

**Q: Is TypeScript supported?**  
A: Yes! Full TypeScript definitions are included in v2.0.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT © 2025 [Omar Gamal](https://github.com/Omar0Gamal)

## 🙏 Acknowledgments

Built with ❤️ for the Node.js community.

Special thanks to:
- The ACME protocol and Let's Encrypt for making SSL certificates accessible
- All contributors and users of this package

---

**Need help?** [Open an issue](https://github.com/Omar0Gamal/secure-ssl-server/issues)  
**Want to contribute?** [View contributing guidelines](https://github.com/Omar0Gamal/secure-ssl-server/blob/main/CONTRIBUTING.md)