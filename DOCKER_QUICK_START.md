# 🐳 Docker Quick Start

## One-Line Startup

```bash
# Development with hot-reload (recommended)
./start-docker.sh dev

# Or production build
./start-docker.sh
```

## What's Created

| File | Purpose |
|------|---------|
| `Dockerfile` | Production multi-stage build with optimizations |
| `Dockerfile.dev` | Development image with source code mounts |
| `docker-compose.yml` | Production services (Next.js + MySQL) |
| `docker-compose.dev.yml` | Development services with hot-reload |
| `docker-entrypoint.sh` | Production startup script with DB migrations |
| `docker-entrypoint-dev.sh` | Development startup with `npm run dev` |
| `start-docker.sh` | Convenient startup wrapper script |
| `stop-docker.sh` | Graceful shutdown script |
| `.env.docker` | Environment template for Docker |
| `DOCKER_SETUP.md` | Comprehensive Docker documentation |

## Environment Setup

```bash
# Copy template
cp .env.docker .env.local

# Edit with your credentials
nano .env.local
```

**Key variables:**
- `NEXTAUTH_URL` - Your app URL
- `SMTP_*` - Email configuration
- `MOBITECH_API_KEY` - SMS API key
- `AUTH_SECRET` - NextAuth secret

## Commands

### Start

```bash
# Development with hot-reload
docker-compose -f docker-compose.dev.yml up

# Or use the wrapper
./start-docker.sh dev

# Production build
docker-compose up
./start-docker.sh
```

### Stop

```bash
docker-compose down
# or
./stop-docker.sh
```

### View Logs

```bash
docker-compose logs -f app      # App logs
docker-compose logs -f mysql    # Database logs
```

### Database

```bash
# Access MySQL shell
docker-compose exec mysql mysql -p mejja

# Prisma Studio
docker-compose exec app npm run db:studio

# Seed database
docker-compose exec app npm run db:seed
```

## Features

✅ **Hot-reload in development** - Changes reflect instantly  
✅ **Production optimized** - Multi-stage build keeps image small  
✅ **Database included** - MySQL starts automatically  
✅ **Automatic migrations** - Prisma migrations run on startup  
✅ **Health checks** - Services verify readiness before starting  
✅ **Volume persistence** - Database data survives container restarts  
✅ **Easy deployment** - Same containers for local dev and cloud  

## First Time Setup

```bash
# 1. Copy environment
cp .env.docker .env.local

# 2. Update SMTP and API keys
nano .env.local

# 3. Start
./start-docker.sh dev

# 4. Access app
# http://localhost:3000
```

The app will:
- Download base images (first time only)
- Start MySQL and initialize database
- Run Prisma migrations
- Seed campaign data
- Start Next.js dev server with hot-reload

## Troubleshooting

**Port 3000 in use?**
```bash
# Use different port
PORT=3001 docker-compose up
```

**MySQL won't connect?**
```bash
# Check MySQL logs
docker-compose logs mysql

# Restart
docker-compose down -v && docker-compose up
```

**Changes not reflecting?**
```bash
# Rebuild development image
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml down && docker-compose -f docker-compose.dev.yml up
```

## See Also

- Full documentation: [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- Docker docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
