# secure-ssl-server

A simple Node.js SSL helper for Express apps with automatic certificate reloading.

## Features

- Load SSL certificates easily in Express
- Watch certificates for changes and auto-reload
- Simple API for HTTPS server creation
- Ready for v2.0 with multi-framework support and Let's Encrypt

## Installation

```bash
npm install secure-ssl-server
```

## Usage

```js
import express from 'express';
import { createHttpsExpressServer } from 'secure-ssl-server';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello HTTPS!');
});

const server = createHttpsExpressServer({
  certPath: './certs/cert.pem',
  keyPath: './certs/key.pem',
  watch: true,
  port: 8443
}, app);
```

## License
MIT © 2025 Omar Gamal