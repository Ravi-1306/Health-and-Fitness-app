# 🔒 Security Guidelines

## Critical Security Information

### Environment Variables
- **NEVER commit `.env` files** to Git - they're in `.gitignore`
- Always use `.env.example` as a template
- Keep API keys and secrets confidential
- Regenerate keys if accidentally exposed

### Sensitive Files Protected
✅ API Keys (Gemini, OAuth)
✅ Database credentials
✅ JWT secrets  
✅ Database files (*.db, *.sqlite)
✅ Node modules
✅ IDE configurations
✅ OS-specific files

### Before Pushing to GitHub

1. **Verify `.env` is not staged**
   ```bash
   git status  # Should NOT show .env files
   ```

2. **Check no secrets in code**
   ```bash
   # Search for exposed keys
   grep -r "AIzaSy" --include="*.ts" --include="*.js" src/
   grep -r "eyJ" --include="*.ts" --include="*.js" src/
   ```

3. **Clean git history** (if secrets were exposed)
   ```bash
   git rm --cached .env
   git commit -m "Remove .env file from tracking"
   ```

## Production Security

### JWT Secrets
- Use strong random strings (minimum 32 characters)
- Rotate regularly
- Never hardcode in source files
- Store in environment variables only

### Database
- Use strong PostgreSQL passwords in production
- Enable SSL/TLS connections
- Regular backups
- Restrict database access

### API Security
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting
- Add CORS restrictions
- Use secure headers (Helmet.js)

### Dependencies
```bash
# Regularly check for vulnerabilities
npm audit
npm audit fix

# Keep dependencies updated
npm update
```

## If a Secret Gets Exposed

1. **Immediately regenerate the secret**
   - Generate new API key at Google AI Studio
   - Update JWT secrets
   - Update database credentials

2. **Remove from git history**
   ```bash
   # Use BFG Repo-Cleaner or git-filter-branch
   git log --all --full-history -- .env
   ```

3. **Force push to remote** (only on fresh repos)
   ```bash
   git push --force-with-lease origin main
   ```

## Security Checklist

Before deploying to production:

- [ ] All `.env` files removed from git
- [ ] API keys rotated and secured
- [ ] Database credentials set to strong passwords
- [ ] HTTPS/SSL enabled
- [ ] CORS restrictions configured
- [ ] Rate limiting implemented
- [ ] Input validation added
- [ ] Dependencies audited (`npm audit`)
- [ ] Security headers added
- [ ] Error messages don't expose sensitive info
- [ ] Logs don't contain secrets
- [ ] Backups configured
- [ ] Access controls implemented

## Third-Party Security

### Google Gemini API
- Keep API key private
- Use environment variables
- Monitor usage for abuse
- Delete key if compromised

### Database
- Use strong unique passwords
- Enable authentication
- Restrict network access
- Regular security updates

## Reporting Security Issues

If you find a security vulnerability:

1. **Do NOT** create a public issue
2. Email security concerns to: dev@healthfitness.app
3. Include detailed information
4. Allow time for fix before disclosure

---

**Remember**: Security is everyone's responsibility. Always assume `.env` and secrets should never be public.
