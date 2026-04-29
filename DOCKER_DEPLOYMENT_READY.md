# 🐳 Docker Containerization Complete

Your Muheshimiwa Node application is now fully containerized with Docker and Docker Compose. Here's what was set up:

## ✅ What's Been Created

### Core Docker Files
- **`Dockerfile`** - Production-optimized multi-stage build (~200MB final image)
- **`Dockerfile.dev`** - Development image with source code mounts and hot-reload
- **`docker-entrypoint.sh`** - Production startup script (waits for DB, runs migrations, starts app)
- **`docker-entrypoint-dev.sh`** - Development startup script (runs `npm run dev` with hot-reload)

### Docker Compose Orchestration
- **`docker-compose.yml`** - Production setup with Next.js + MySQL services
- **`docker-compose.dev.yml`** - Development setup with volume mounts for live code reloading

### Configuration & Documentation
- **`.env.docker`** - Docker environment template with defaults
- **`.env.production.example`** - Production environment template with detailed comments
- **`DOCKER_QUICK_START.md`** - Quick reference guide
- **`DOCKER_SETUP.md`** - Comprehensive Docker documentation
- **`.dockerignore`** - Optimized build context

### Convenience Scripts
- **`start-docker.sh`** - Wrapper to start services (dev or production)
- **`stop-docker.sh`** - Graceful shutdown wrapper

### README Updates
- **`README.md`** - Added Docker quick start section

## 🚀 Quick Start Commands

### Development Mode (Hot-Reload Recommended)
```bash
# Copy environment template
cp .env.docker .env.local

# Edit with your SMTP & API keys
nano .env.local

# Start with hot-reload
./start-docker.sh dev

# App at http://localhost:3000
```

### Production Mode
```bash
# Copy environment
cp .env.docker .env

# Edit configuration
nano .env

# Start production build
./start-docker.sh

# App at http://localhost:3000
```

### Using Docker Compose Directly
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up

# Specific services
docker-compose ps              # View services
docker-compose logs -f app     # Watch app logs
docker-compose exec app bash   # Shell into container
```

## 📦 Architecture

### Production Build (Dockerfile)
1. **Base Stage**: Node 20 + system dependencies (openssl, mysql-client)
2. **Dependencies**: Install npm packages
3. **Builder**: Build Next.js app with Prisma generation
4. **Runtime**: Copy built artifacts, Prisma CLI, entrypoint script
5. **Result**: ~200MB optimized image ready for deployment

### Development Setup (docker-compose.dev.yml)
- Mounts entire project directory for hot-reload
- Runs `npm run dev` on startup
- Source code changes instantly reflected in browser
- Full access to dev tools (lint, typecheck, etc.)

### Services
**MySQL Service**
- Image: `mysql:8.0`
- Port: `3306` (exposed to host)
- Volume: Named volume for persistence (`mysql_data` / `mysql_data_dev`)
- Health checks: Verifies database readiness before app starts

**Next.js App Service**
- Depends on MySQL health check
- Auto-runs Prisma migrations on startup
- Auto-seeds database with campaign data
- Environment variables injected from .env file

## 🔧 Environment Variables

### Essential for Production
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Must be `https://` in production
- `MYSQL_ROOT_PASSWORD` - Change from default "root"

### For Email Functionality
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`

### For SMS Integration
- `MOBITECH_API_KEY` - From https://www.mobitech.co.ke/
- `MOBITECH_SHORTCODE`, `MOBITECH_SERVICE_ID`

### Optional
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` - For Google OAuth
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` - Initial bootstrap credentials

See `.env.docker` and `.env.production.example` for complete options.

## 📊 What Happens on Startup

### Production (`docker-entrypoint.sh`)
1. Waits for MySQL to be healthy (max 30 attempts)
2. Runs `npx prisma migrate deploy` (updates schema)
3. Runs `npm run db:seed` (populates campaign data)
4. Starts Next.js production server (`node server.js`)

### Development (`docker-entrypoint-dev.sh`)
1. Waits for MySQL to be healthy
2. Runs migrations
3. Seeds database
4. Starts Next.js dev server with hot-reload (`npm run dev`)
5. Code changes instantly reflect in browser

## 🌍 Deployment Options

### Cloud Platforms (Recommended)

**Railway.app** (simplest)
```bash
# Connect GitHub repo, Railway auto-detects docker-compose.yml
# Set environment variables in dashboard
# Deploy on push
```

**Render.com**
```bash
# Create Web Service from Docker
# Set secrets in dashboard
# Deploy
```

**DigitalOcean App Platform**
```bash
# Select Docker from App Spec
# Configure MySQL component
# Set environment variables
```

### Self-Hosted (VPS)
```bash
# SSH into server
ssh user@your-server.com

# Clone repo
git clone https://github.com/yourname/muheshimiwa-node.git
cd muheshimiwa-node

# Configure environment
cp .env.docker .env
nano .env  # Add your domain, secrets, SMTP, etc.

# Start
docker-compose up -d

# Set up HTTPS with Nginx + Let's Encrypt
# (See DOCKER_SETUP.md for detailed instructions)
```

## 🔍 Useful Commands

```bash
# View running services
docker-compose ps

# View logs
docker-compose logs -f app              # App logs
docker-compose logs -f mysql            # Database logs

# Access database
docker-compose exec mysql mysql -p mejja

# Prisma Studio (visual DB browser)
docker-compose exec app npm run db:studio

# Run migrations manually
docker-compose exec app npx prisma migrate deploy

# Seed database again
docker-compose exec app npm run db:seed

# Shell into app container
docker-compose exec app bash

# Rebuild images
docker-compose build --no-cache

# Stop and remove everything
docker-compose down

# Stop and remove volumes (WARNING: data loss)
docker-compose down -v
```

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
PORT=3001 docker-compose up
```

**Database connection error?**
```bash
# Restart everything
docker-compose down
docker-compose up

# Check MySQL logs
docker-compose logs mysql
```

**Changes not appearing in dev mode?**
```bash
# Rebuild dev image
docker-compose -f docker-compose.dev.yml build --no-cache

# Restart
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```

**Want to reset everything?**
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up
```

## 📚 Documentation

- **[DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)** - Quick reference (this is your go-to)
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Comprehensive guide with all options
- **[README.md](./README.md)** - Updated with Docker section
- **[.env.production.example](./.env.production.example)** - Production env template with comments

## ✨ Key Benefits

✅ **No manual MySQL setup** - Database auto-starts in container  
✅ **Hot-reload development** - See code changes instantly  
✅ **Consistent environments** - Same container runs locally and in cloud  
✅ **Automatic migrations** - Schema updates run on startup  
✅ **Data persistence** - Database survives container restarts  
✅ **Production-optimized** - Multi-stage build keeps image small  
✅ **Easy deployment** - One command to deploy to any platform  
✅ **Health checks built-in** - Services verify readiness before starting  

## 🎯 Next Steps

1. **Test locally**: `./start-docker.sh dev` and verify app works
2. **Update .env**: Set your SMTP, API keys, and secrets
3. **Deploy**: Push to GitHub and connect to Railway/Render/DigitalOcean
4. **Monitor**: Check logs with `docker-compose logs -f`
5. **Scale**: Add more services or replicas as needed

## 🤝 Support

- Docker issues? Check [DOCKER_SETUP.md](./DOCKER_SETUP.md) troubleshooting section
- Docker docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- Railway: https://docs.railway.app
- Render: https://render.com/docs

---

**Your application is now ready for containerized deployment! 🎉**

To get started right now:
```bash
./start-docker.sh dev
```

Then visit http://localhost:3000 in your browser.
