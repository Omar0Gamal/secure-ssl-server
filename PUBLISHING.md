# Publishing to npm - Step by Step Guide

## 📋 Pre-Publish Checklist

Before publishing, verify everything is ready:

- [x] All tests passing (`npm test`)
- [x] Linting clean (`npm run lint`)
- [x] Version updated to 2.0.0 in package.json
- [x] CHANGELOG.md updated
- [x] README.md complete
- [x] TypeScript definitions included
- [ ] Git repository clean and committed
- [ ] npm account configured

## 🔐 Step 1: Setup npm Account

### First Time Setup

1. **Create npm account** (if you don't have one):
   ```bash
   # Visit https://www.npmjs.com/signup
   # Or use CLI:
   npm adduser
   ```

2. **Login to npm**:
   ```bash
   npm login
   ```
   - Enter your username
   - Enter your password
   - Enter your email (public)
   - Enter OTP (if 2FA enabled)

3. **Verify login**:
   ```bash
   npm whoami
   ```

### Enable 2FA (Recommended)

```bash
npm profile enable-2fa auth-and-writes
```

## 📦 Step 2: Prepare for Publishing

### 1. Clean and Test

```bash
# Clean install
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Run all checks
npm test
npm run lint

# Test coverage (optional)
npm run test:coverage
```

### 2. Check Package Contents

```bash
# See what will be published
npm pack --dry-run
```

This shows all files that will be included. Verify:
- ✅ `src/` directory included
- ✅ `index.d.ts` included
- ✅ `README.md` included
- ✅ `LICENSE` included
- ❌ `node_modules/` excluded
- ❌ `test/` excluded (automatically)
- ❌ `.git/` excluded

### 3. Commit Everything

```bash
git add .
git commit -m "Release v2.0.0 - Multi-framework support, Let's Encrypt, and monitoring"
git push origin develop
```

## 🚀 Step 3: Publish to npm

### Option A: Publish Directly

```bash
# This will run prepublishOnly script (lint + test) automatically
npm publish
```

### Option B: Publish with Tag (Recommended for first v2 release)

```bash
# Publish as beta first to test
npm publish --tag beta

# After testing, promote to latest
npm dist-tag add secure-ssl-server@2.0.0 latest
```

### Option C: Publish to Specific Registry

```bash
# If using a specific registry
npm publish --registry https://registry.npmjs.org/
```

## 🏷️ Step 4: Create Git Tags

```bash
# Create annotated tag
git tag -a v2.0.0 -m "Release v2.0.0 - Multi-framework support, Let's Encrypt integration, certificate monitoring"

# Push tag to GitHub
git push origin v2.0.0

# Or push all tags
git push --tags
```

## ✅ Step 5: Verify Publication

1. **Check npm**:
   ```bash
   npm view secure-ssl-server
   ```

2. **Visit npm page**:
   ```
   https://www.npmjs.com/package/secure-ssl-server
   ```

3. **Test installation**:
   ```bash
   # In a different directory
   mkdir test-install
   cd test-install
   npm init -y
   npm install secure-ssl-server
   ```

## 🎯 Step 6: Create GitHub Release

1. Go to: `https://github.com/Omar0Gamal/secure-ssl-server/releases/new`

2. **Tag**: Select `v2.0.0`

3. **Release Title**: `v2.0.0 - Major Release`

4. **Description**:
   ```markdown
   ## 🎉 Major Release: v2.0.0
   
   ### New Features
   
   #### 🌐 Multi-Framework Support
   - Express (backward compatible)
   - Fastify
   - Koa
   - Hapi
   
   #### 🔐 Let's Encrypt Integration
   - Automatic certificate obtainment
   - Auto-renewal with configurable thresholds
   - HTTP-01 and DNS-01 challenge support
   
   #### 📊 Certificate Monitoring
   - Real-time expiration tracking
   - Customizable warning and critical alerts
   - Certificate information extraction
   
   #### 📝 TypeScript Support
   - Full type definitions included
   
   ### Installation
   
   \`\`\`bash
   npm install secure-ssl-server
   \`\`\`
   
   ### Documentation
   
   See [README.md](https://github.com/Omar0Gamal/secure-ssl-server#readme) for full documentation.
   
   ### Backward Compatibility
   
   100% backward compatible with v1.x. All existing code continues to work.
   
   ### Changelog
   
   See [CHANGELOG.md](https://github.com/Omar0Gamal/secure-ssl-server/blob/main/CHANGELOG.md) for details.
   ```

5. Click **Publish release**

## 🔄 Post-Publication Steps

### 1. Merge to Main Branch

```bash
# Switch to main
git checkout main

# Merge develop
git merge develop

# Push to main
git push origin main
```

### 2. Update npm Keywords (if needed)

```bash
npm publish --access public
```

### 3. Share the Release

- Tweet about it
- Post on Reddit (r/node, r/javascript)
- Share on LinkedIn
- Post in Discord/Slack communities
- Update your portfolio

## 🐛 Troubleshooting

### "You do not have permission to publish"

**Solution**: Package name might be taken. Either:
- Choose a different name in package.json
- Add scope: `@yourusername/secure-ssl-server`

### "Need to login"

**Solution**:
```bash
npm logout
npm login
```

### "Package name too similar to existing package"

**Solution**: npm prevents similar names. Choose a more unique name.

### "402 Payment Required"

**Solution**: Using a paid feature. For public packages, use:
```bash
npm publish --access public
```

## 📊 Monitoring After Publication

### Check Download Stats

```bash
npm view secure-ssl-server
```

### Monitor Issues

- Watch GitHub repository for issues
- Respond to npm support requests
- Monitor downloads on npm

### Setup Package Monitoring

- **npms.io**: https://npms.io/search?q=secure-ssl-server
- **npm trends**: https://npmtrends.com/secure-ssl-server
- **Snyk**: Monitor for vulnerabilities

## 🎉 Success!

Once published:
- ✅ Package available on npm
- ✅ GitHub release created
- ✅ Documentation complete
- ✅ Ready for community use

---

**Quick Publish Command (if everything is ready):**

\`\`\`bash
npm test && npm run lint && npm publish && git tag -a v2.0.0 -m "Release v2.0.0" && git push --tags
\`\`\`
