# Examples

This directory contains example implementations for secure-ssl-server v2.0.

## Examples

- [Express Server](./express-example.js) - Basic Express HTTPS server
- [Fastify Server](./fastify-example.js) - Fastify HTTPS server
- [Koa Server](./koa-example.js) - Koa HTTPS server
- [Let's Encrypt](./letsencrypt-example.js) - Let's Encrypt integration
- [Certificate Monitoring](./monitoring-example.js) - Certificate expiration monitoring

## Running Examples

```bash
# Install dependencies
npm install

# Run an example
node examples/express-example.js
```

## Prerequisites

For the basic examples, you'll need SSL certificates. Generate self-signed certificates for testing:

```bash
mkdir certs
openssl genrsa -out certs/key.pem 2048
openssl req -new -x509 -key certs/key.pem -out certs/cert.pem -days 365
```

For Let's Encrypt examples, you'll need:
- A domain name pointing to your server
- Port 80 available for HTTP-01 challenges (or DNS access for DNS-01)
