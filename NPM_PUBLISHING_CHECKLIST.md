# NPM Publishing Checklist for Academic Research MCP Suite

## Pre-Publishing Checklist

### 1. Code Quality ✅
- [x] All TypeScript files compile without errors
- [x] All tests pass (6/6 servers working)
- [x] No linting errors
- [x] Code follows consistent style

### 2. Package Configuration ✅
- [x] `package.json` has correct metadata
- [x] Version number is set (1.0.0)
- [x] Main entry point is correct
- [x] Bin entries are properly configured
- [x] Files array includes necessary files
- [x] Keywords are relevant and comprehensive
- [x] License is specified (MIT)
- [x] Dependencies are up to date

### 3. Documentation ✅
- [x] README.md is comprehensive
- [x] CHANGELOG.md exists and is up to date
- [x] LICENSE file exists
- [x] API documentation is complete
- [x] Usage examples are provided
- [x] Installation instructions are clear

### 4. Repository Setup ⚠️
- [ ] GitHub repository is created
- [ ] Repository URL in package.json is correct
- [ ] .gitignore is properly configured
- [ ] README badges are added
- [ ] GitHub topics/tags are set

### 5. Testing ✅
- [x] Local installation works (`npm install`)
- [x] Build process works (`npm run build`)
- [x] Tests pass (`npm test`)
- [x] Bin commands are executable

## Publishing Steps

### Step 1: Create NPM Account
```bash
# If you don't have an npm account
npm adduser

# If you already have an account
npm login
```

### Step 2: Update Package Metadata

Before publishing, update these fields in `package.json`:

```json
{
  "name": "academic-research-mcp-suite",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/academic-research-mcp-suite.git"
  }
}
```

### Step 3: Create GitHub Repository

```bash
# Initialize git if not already done
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/academic-research-mcp-suite.git

# Add all files
git add .

# Commit
git commit -m "Initial release v1.0.0"

# Push to GitHub
git push -u origin main
```

### Step 4: Test Package Locally

```bash
# Create a test directory
mkdir ../test-academic-mcp
cd ../test-academic-mcp

# Install from local directory
npm install ../academic-research-mcp-suite

# Test the bin commands
npx academic-research-orchestrator --help
```

### Step 5: Dry Run

```bash
# Go back to project directory
cd ../academic-research-mcp-suite

# Perform a dry run to see what will be published
npm publish --dry-run

# Review the output carefully
# Check that all necessary files are included
# Verify no sensitive files are included
```

### Step 6: Publish to NPM

```bash
# Build the project
npm run build

# Run tests one more time
npm test

# Publish to npm registry
npm publish

# For scoped packages (optional)
# npm publish --access public
```

### Step 7: Verify Publication

```bash
# Check on npm website
open https://www.npmjs.com/package/academic-research-mcp-suite

# Test installation from npm
mkdir ../test-from-npm
cd ../test-from-npm
npm install academic-research-mcp-suite

# Test the installed package
npx academic-research-orchestrator --help
```

### Step 8: Create GitHub Release

```bash
# Tag the release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release on GitHub
# Go to: https://github.com/YOUR_USERNAME/academic-research-mcp-suite/releases/new
# - Tag: v1.0.0
# - Title: Academic Research MCP Suite v1.0.0
# - Description: Copy from CHANGELOG.md
```

## Post-Publishing Tasks

### 1. Update Documentation
- [ ] Add npm badge to README
- [ ] Update installation instructions
- [ ] Add link to npm package page
- [ ] Update GitHub repository description

### 2. Announce Release
- [ ] Tweet about the release
- [ ] Post on relevant forums/communities
- [ ] Update personal website/portfolio
- [ ] Share on LinkedIn

### 3. Monitor
- [ ] Watch for issues on GitHub
- [ ] Monitor npm download stats
- [ ] Respond to user feedback
- [ ] Plan next version based on feedback

## NPM Package Badges

Add these to your README.md:

```markdown
[![npm version](https://badge.fury.io/js/academic-research-mcp-suite.svg)](https://badge.fury.io/js/academic-research-mcp-suite)
[![npm downloads](https://img.shields.io/npm/dm/academic-research-mcp-suite.svg)](https://www.npmjs.com/package/academic-research-mcp-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/academic-research-mcp-suite.svg)](https://nodejs.org)
```

## Troubleshooting

### Issue: "You do not have permission to publish"
**Solution**: Make sure you're logged in with `npm login` and the package name is available.

### Issue: "Package name already exists"
**Solution**: Choose a different package name or use a scoped package (@yourname/academic-research-mcp-suite).

### Issue: "Files missing in published package"
**Solution**: Check the `files` array in package.json and ensure all necessary files are included.

### Issue: "Bin commands not working"
**Solution**: 
1. Ensure bin files have proper shebang (`#!/usr/bin/env node`)
2. Check file permissions
3. Verify paths in package.json bin section

## Version Management

### Semantic Versioning
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backwards compatible
- **PATCH** (1.0.1): Bug fixes, backwards compatible

### Updating Version
```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major

# This automatically:
# - Updates package.json
# - Creates a git commit
# - Creates a git tag
```

## Maintenance

### Regular Updates
```bash
# Check for outdated dependencies
npm outdated

# Update dependencies
npm update

# Update to latest versions (carefully!)
npm install <package>@latest

# Rebuild and test
npm run build && npm test

# Publish patch version
npm version patch
npm publish
```

### Deprecating Old Versions
```bash
# Deprecate a specific version
npm deprecate academic-research-mcp-suite@1.0.0 "Please upgrade to 1.1.0"

# Deprecate all versions below a certain version
npm deprecate academic-research-mcp-suite@"< 1.1.0" "Please upgrade to 1.1.0 or higher"
```

## Security

### Best Practices
1. Never commit sensitive data (API keys, passwords)
2. Use `.npmignore` to exclude sensitive files
3. Enable 2FA on your npm account
4. Regularly update dependencies for security patches
5. Use `npm audit` to check for vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may include breaking changes)
npm audit fix --force
```

## Success Criteria

Your package is ready for npm when:
- ✅ All tests pass
- ✅ Documentation is complete
- ✅ Version is correctly set
- ✅ Repository is public and accessible
- ✅ License is included
- ✅ Package installs and works correctly
- ✅ Bin commands are executable
- ✅ No sensitive data is included

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Choose a License](https://choosealicense.com/)
- [npm Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
