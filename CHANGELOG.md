# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-19

### Added

- **Multi-Framework Support**: Added adapters for Fastify, Koa, and Hapi
  - `createHttpsFastifyServer()` - HTTPS server for Fastify
  - `createHttpsKoaServer()` - HTTPS server for Koa
  - `createHttpsHapiServer()` - HTTPS server for Hapi

- **Let's Encrypt Integration**: Full ACME protocol support
  - `createAcmeClient()` - Create ACME client for certificate management
  - `obtainLetsEncryptCertificates()` - One-time certificate obtainment
  - `createHttpsServerWithLetsEncrypt()` - Server creation with Let's Encrypt
  - Automatic certificate renewal
  - Support for HTTP-01 and DNS-01 challenges
  - Configurable renewal thresholds and intervals

- **Certificate Monitoring**: Advanced certificate lifecycle management
  - `monitorCertificate()` - Monitor certificate expiration with alerts
  - `getCertificateInfo()` - Get detailed certificate information
  - `isCertificateExpiringSoon()` - Check if certificate is expiring soon
  - Configurable warning and critical thresholds
  - Real-time expiration alerts

- **TypeScript Support**: Complete type definitions in `index.d.ts`

- **Enhanced Configuration**: Extended options for all server creation functions

- **Examples**: Comprehensive examples for all features
  - Express example
  - Fastify example
  - Koa example
  - Let's Encrypt integration example
  - Certificate monitoring example

### Changed

- Updated package description to reflect new capabilities
- Enhanced documentation with detailed API reference
- Improved error messages and logging
- Added migration guide for v1.x users

### Dependencies

- Added `acme-client@^5.0.0` for Let's Encrypt integration
- Made all framework peer dependencies optional

### Backward Compatibility

- Fully backward compatible with v1.x
- All v1.x APIs continue to work without changes
- Express-only users can upgrade without code changes

## [1.0.0] - 2025-XX-XX

### Added

- Initial release
- Express HTTPS server creation
- SSL certificate loading and validation
- Certificate file watching
- CA bundle support
- Zero dependencies (except dev dependencies)

[2.0.0]: https://github.com/Omar0Gamal/secure-ssl-server/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Omar0Gamal/secure-ssl-server/releases/tag/v1.0.0
