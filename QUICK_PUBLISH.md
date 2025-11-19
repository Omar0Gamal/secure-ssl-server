# Quick Command Reference

## 🚀 Publishing to npm - Quick Guide

### Step 1: Final Checks
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Run tests
npm test

# Run linter
npm run lint

# Preview what will be published
npm pack --dry-run
```

### Step 2: Commit Everything
```powershell
git add .
git commit -m "Release v2.0.0 - Multi-framework support, Let's Encrypt, and monitoring"
git push origin develop
```

### Step 3: Login to npm
```powershell
# Login (first time or if not logged in)
npm login

# Verify you're logged in
npm whoami
```

### Step 4: Publish
```powershell
# Option A: Direct publish (runs prepublishOnly: lint + test)
npm publish

# Option B: Publish as beta first (safer)
npm publish --tag beta

# Then promote to latest after testing
npm dist-tag add secure-ssl-server@2.0.0 latest

# Option C: Public scoped package
npm publish --access public
```

### Step 5: Tag Git Release
```powershell
# Create tag
git tag -a v2.0.0 -m "Release v2.0.0"

# Push tag
git push origin v2.0.0

# Or push all tags
git push --tags
```

### Step 6: Verify
```powershell
# Check npm
npm view secure-ssl-server

# Test install in new directory
mkdir test-install
cd test-install
npm init -y
npm install secure-ssl-server
```

---

## 🎯 ONE-LINER (if everything is ready)

```powershell
npm test; npm run lint; npm publish; git tag -a v2.0.0 -m 'Release v2.0.0'; git push --tags
```

---

## 📋 Post-Publish Checklist

1. **Create GitHub Release**
   - Go to: https://github.com/Omar0Gamal/secure-ssl-server/releases/new
   - Select tag: v2.0.0
   - Title: "v2.0.0 - Major Release"
   - Copy description from CHANGELOG.md

2. **Merge to Main**
   ```powershell
   git checkout main
   git merge develop
   git push origin main
   ```

3. **Announce**
   - Twitter/X
   - LinkedIn
   - Reddit (r/node, r/javascript)
   - Dev.to
   - Discord communities

4. **Monitor**
   - npm downloads
   - GitHub issues
   - Community feedback

---

## 🔍 Useful Commands

```powershell
# Check current npm user
npm whoami

# View package info
npm view secure-ssl-server

# View all versions
npm view secure-ssl-server versions

# View download stats
npm view secure-ssl-server

# Unpublish (within 72 hours only!)
npm unpublish secure-ssl-server@2.0.0

# Deprecate a version
npm deprecate secure-ssl-server@2.0.0 "Please use v2.0.1"

# Update package
npm version patch  # 2.0.0 -> 2.0.1
npm version minor  # 2.0.0 -> 2.1.0
npm version major  # 2.0.0 -> 3.0.0
```

---

## 🐛 Troubleshooting

### "You need to login"
```powershell
npm logout
npm login
```

### "Package name already exists"
Choose a different name or use scoped package:
```powershell
# In package.json, change name to:
# "@yourusername/secure-ssl-server"
npm publish --access public
```

### "Permission denied"
Make sure you're logged in as the correct user:
```powershell
npm whoami
```

### "Need to enable 2FA"
```powershell
npm profile enable-2fa auth-and-writes
```

---

## 🎉 You're Ready!

The package is complete and ready to publish. Just follow the steps above!
