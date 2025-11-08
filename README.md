# secure-ssl-server

> 🔒 Effortless HTTPS server creation for Node.js with automatic certificate reloading

A lightweight, zero-dependency SSL helper that simplifies HTTPS server setup in Express applications. Perfect for development environments and production deployments that need dynamic certificate management.

[![npm version](https://img.shields.io/npm/v/secure-ssl-server.svg)](https://www.npmjs.com/package/secure-ssl-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/node/v/secure-ssl-server.svg)](https://nodejs.org)

## ✨ Features

- **🚀 Quick Setup** - Create HTTPS servers with a single function call
- **🔄 Auto-Reload** - Watch SSL certificates and automatically reload when they change
- **🛡️ Secure by Default** - Built-in certificate validation and error handling
- **📦 Lightweight** - Zero dependencies, minimal footprint
- **⚡ Express Integration** - Seamless integration with Express.js
- **🔮 Future-Ready** - v2.0 planned with multi-framework support and Let's Encrypt integration

## 📋 Requirements

- Node.js 14.0.0 or higher
- SSL certificate and private key files

## 📦 Installation

```bash
npm install secure-ssl-server
```

## 🚀 Quick Start

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

## 📖 Usage

### Basic HTTPS Server

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

## 🔧 API Reference

### `createHttpsExpressServer(options, app)`

Creates and starts an HTTPS server with the provided Express app.

#### Parameters

- **options** `Object` - Configuration object
  - **certPath** `string` - Path to SSL certificate file (required)
  - **keyPath** `string` - Path to private key file (required)
  - **caPath** `string` - Path to CA bundle file (optional)
  - **port** `number` - Port to listen on (default: 443)
  - **watch** `boolean` - Enable certificate file watching (default: false)
  - **onReload** `Function` - Callback fired when certificates are reloaded (optional)
- **app** `Express` - Express application instance

#### Returns

- `https.Server` - HTTPS server instance

### `loadSSL(options)`

Loads SSL certificates from the filesystem with validation.

#### Parameters

- **options** `Object` - Configuration object
  - **certPath** `string` - Path to SSL certificate file
  - **keyPath** `string` - Path to private key file
  - **caPath** `string` - Path to CA bundle file (optional)

#### Returns

- `Object` - SSL configuration object
  - **cert** `string` - Certificate content
  - **key** `string` - Private key content
  - **ca** `string|null` - CA bundle content (if provided)

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

## 🗺️ Roadmap

### v2.0 (Coming Soon)

- 🌐 Multi-framework support (Fastify, Koa, Hapi)
- 🔐 Let's Encrypt integration with automatic certificate renewal
- 📊 Certificate expiration monitoring and alerts
- 🔧 Enhanced configuration options
- 📝 TypeScript definitions

## ❓ FAQ

**Q: Does this work in production?**  
A: Yes! The package is production-ready, especially useful for applications that need dynamic certificate management.

**Q: Can I use this with Let's Encrypt?**  
A: Currently, you need to manage Let's Encrypt certificates separately. Full integration is planned for v2.0.

**Q: What happens if certificate files are invalid?**  
A: The package validates certificates on load and throws descriptive errors if formats are invalid.

**Q: Does watching certificates impact performance?**  
A: No, the file watcher is efficient and only triggers on actual file changes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT © 2025 [Omar Gamal](https://github.com/Omar0Gamal)

## 🙏 Acknowledgments

Built with ❤️ for the Node.js community.

---

**Need help?** [Open an issue](https://github.com/Omar0Gamal/secure-ssl-server/issues)