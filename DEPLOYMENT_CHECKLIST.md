# ✅ Docker Deployment Checklist

Use this checklist to verify your Docker setup before deploying to production.

## Pre-Deployment Setup

### Local Testing
- [ ] Docker installed and running (`docker --version`)
- [ ] Docker Compose installed (`docker-compose --version`)
- [ ] Cloned/forked repository with all Docker files
- [ ] Ran `cp .env.docker .env.local` to create local env file
- [ ] Tested development mode: `./start-docker.sh dev`
- [ ] Verified app loads at http://localhost:3000
- [ ] Admin login works (credentials from `.env.local`)
- [ ] Database seeding completed (check for campaign data)

### Environment Configuration
- [ ] Generated AUTH_SECRET: `openssl rand -base64 32`
- [ ] Set `NEXTAUTH_URL` to your production domain (https://)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Configured SMTP credentials (Gmail or custom):
  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_USER`
  - [ ] `SMTP_PASSWORD` (Gmail app password)
  - [ ] `SMTP_FROM`
- [ ] Configured Mobitech SMS (if needed):
  - [ ] `MOBITECH_API_KEY`
  - [ ] `MOBITECH_SHORTCODE`
  - [ ] `MOBITECH_SERVICE_ID`
- [ ] Generated strong `ADMIN_PASSWORD` (not "admin")
- [ ] Set `MYSQL_ROOT_PASSWORD` to strong value (not "root")
- [ ] (Optional) Set Google OAuth if using social login:
  - [ ] `AUTH_GOOGLE_ID`
  - [ ] `AUTH_GOOGLE_SECRET`

### Files to Prepare
- [ ] Updated `.env` with all production values
- [ ] Created `.env.local` for local testing
- [ ] Verified `.dockerignore` exists
- [ ] Verified Dockerfile contains mysql-client dependency
- [ ] Verified docker-compose.yml uses correct environment variables
- [ ] Verified docker-entrypoint.sh is executable (chmod +x)

## Deployment Verification

### Before Pushing to Production
- [ ] Ran `docker-compose build` and no errors appear
- [ ] Tested production build locally: `./start-docker.sh`
- [ ] Verified all environment variables are set
- [ ] Ran test email sending (admin dashboard → messaging → test SMTP)
- [ ] Tested admin login functionality
- [ ] Checked logs for errors: `docker-compose logs -f`
- [ ] Database migrations completed without errors
- [ ] Seed data populated successfully
- [ ] All pages load without 404 or 500 errors

### Platform-Specific (Choose One)

#### Railway.app
- [ ] Created Railway account and project
- [ ] Connected GitHub repository
- [ ] Added environment variables in Railway dashboard:
  - [ ] `AUTH_SECRET`
  - [ ] `NEXTAUTH_URL` (https://your-railway-domain)
  - [ ] `SMTP_*` variables
  - [ ] `MOBITECH_*` variables (if using SMS)
  - [ ] Database credentials
- [ ] MySQL service provisioned
- [ ] Domain configured or using Railway default
- [ ] Tested: App loads and admin login works
- [ ] SSL certificate auto-provisioned

#### Render.com
- [ ] Created Render account and Web Service
- [ ] Connected GitHub repository
- [ ] Selected Docker for build
- [ ] Added environment variables in Render dashboard
- [ ] Created MySQL database service
- [ ] Linked services in Docker Compose or Render UI
- [ ] Set custom domain (optional)
- [ ] Verified SSL certificate is active
- [ ] Tested: App loads and functions work

#### DigitalOcean App Platform
- [ ] Created DigitalOcean account
- [ ] Created App Platform app
- [ ] Uploaded docker-compose.yml
- [ ] Added MySQL component
- [ ] Set environment variables
- [ ] Configured custom domain
- [ ] Verified SSL/TLS enabled
- [ ] Tested: App loads and admin works

#### Self-Hosted (VPS)
- [ ] SSH access to server verified
- [ ] Docker and Docker Compose installed on server
- [ ] Clone repository on server
- [ ] Configured `.env` file on server
- [ ] Ports 80 and 443 open in firewall
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained (Let's Encrypt via certbot)
- [ ] Nginx proxy_pass configured to localhost:3000
- [ ] DNS records point to server IP
- [ ] Tested: App loads over HTTPS
- [ ] Email notifications working
- [ ] SMS sending working

## Post-Deployment

### Verification
- [ ] App loads on production domain
- [ ] Admin login works with correct credentials
- [ ] All pages load without errors (check Network tab)
- [ ] Database has campaign seed data
- [ ] Email sending works (test from admin dashboard)
- [ ] SMS sending works (test from admin dashboard)
- [ ] No 404 or 500 errors in browser console
- [ ] Checked logs: `docker-compose logs -f` (no errors)

### Performance
- [ ] Page load time acceptable (<2 seconds)
- [ ] Images load correctly (projects, gallery, etc.)
- [ ] No console errors or warnings
- [ ] Mobile responsive design works
- [ ] SEO meta tags present (view page source)
- [ ] Open Graph tags configured (test on social)

### Security
- [ ] HTTPS enforced (no http://)
- [ ] Security headers present
- [ ] Admin credentials strong
- [ ] Database password changed from default
- [ ] API keys kept secure in environment
- [ ] No credentials in version control
- [ ] Firewall rules restrict database port 3306

### Monitoring
- [ ] Set up logging/monitoring (Docker logs)
- [ ] Set up error tracking (optional: Sentry)
- [ ] Set up uptime monitoring (optional: Uptime Robot)
- [ ] Set up email alerts for failures
- [ ] Regular database backups configured
- [ ] Set up log rotation

### Backups
- [ ] Database backup script created
- [ ] First backup completed successfully
- [ ] Backup stored in secure location (S3, etc.)
- [ ] Restoration tested (verify backups work)
- [ ] Backup schedule documented

## Common Issues & Solutions

### Port 3000 Already in Use
```bash
# Solution: Use different port
PORT=3001 docker-compose up
# Or kill process:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Refused
```bash
# Solution: Restart everything
docker-compose down -v
docker-compose up
```

### Migrations Failed
```bash
# Solution: Run manually
docker-compose exec app npx prisma migrate deploy
```

### App Crashes on Startup
```bash
# Solution: Check logs
docker-compose logs app
# Fix environment variables, then restart
```

### Email Not Sending
```bash
# Solution: Test SMTP credentials
docker-compose exec app npm run db:seed
# Check SMTP settings in admin dashboard
# Verify SMTP_PASSWORD is App Password (not regular password)
```

### Changes Not Reflecting in Dev
```bash
# Solution: Rebuild development image
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```

## Documentation References

- [README.md](./README.md) - Project overview
- [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md) - Quick reference guide
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Comprehensive documentation
- [DOCKER_DEPLOYMENT_READY.md](./DOCKER_DEPLOYMENT_READY.md) - Deployment summary
- [.env.docker](./.env.docker) - Local development template
- [.env.production.example](./.env.production.example) - Production template

## Support Resources

- Docker documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- DigitalOcean: https://docs.digitalocean.com
- Let's Encrypt: https://letsencrypt.org

## Final Sign-Off

- [ ] All checklist items completed
- [ ] Production deployment tested
- [ ] Monitoring and backups in place
- [ ] Documentation updated
- [ ] Team trained on deployment process
- [ ] Ready for production! 🚀

---

**Last Updated**: April 29, 2026  
**App Version**: Based on Next.js 15 + React 19  
**Docker Version**: Compose v3.8+, Engine 20.10+
