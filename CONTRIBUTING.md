# Contributing to secure-ssl-server

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/secure-ssl-server.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## 🔧 Development

### Running Tests

```bash
npm test
```

### Running Tests with Coverage

```bash
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## 📝 Code Style

- Use ES6+ module syntax
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Write descriptive commit messages

## 🧪 Testing

- Write tests for all new features
- Ensure all tests pass before submitting PR
- Aim for high code coverage

## 📦 Pull Request Process

1. Update README.md with details of changes if needed
2. Update the TypeScript definitions in index.d.ts
3. Add tests for new functionality
4. Ensure all tests pass and linting is clean
5. Update examples if relevant
6. Submit PR with clear description of changes

## 🐛 Bug Reports

When filing a bug report, include:
- Node.js version
- Framework and version (Express, Fastify, etc.)
- Minimal code to reproduce the issue
- Expected vs actual behavior
- Error messages and stack traces

## 💡 Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Clearly describe the use case
- Explain why this feature would be useful
- Consider submitting a PR

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
