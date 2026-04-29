# Docker Setup Guide

This project is now fully containerized with Docker and Docker Compose for easy local development and cloud deployment.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- (Optional) Docker Desktop for Mac/Windows

**Installation:**
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start - Local Development

### Option 1: Development with Hot Reload (Recommended)

Development mode includes live code reloading, so changes are reflected immediately without rebuilding:

```bash
# Copy environment file
cp .env.docker .env.local

# Edit .env.local with your credentials (SMTP, Mobitech API key, etc.)
nano .env.local

# Start services with hot-reload enabled
docker-compose -f docker-compose.dev.yml up

# Access the app at http://localhost:3000
```

**What happens:**
1. MySQL starts and initializes database
2. Next.js dev server starts with hot-reload
3. Prisma migrations run automatically
4. Database is seeded with campaign data
5. Changes to source code reload instantly

**Stop services:**
```bash
docker-compose -f docker-compose.dev.yml down
```

### Option 2: Production Build (Container Optimization)

Production mode builds the entire app into an optimized container:

```bash
# Copy environment file
cp .env.docker .env

# Edit .env with your credentials
nano .env

# Start services
docker-compose up

# Access the app at http://localhost:3000
```

**Stop services:**
```bash
docker-compose down
```

## Environment Variables

All configuration is done via environment variables. Create `.env.local` (development) or `.env` (production) based on `.env.docker`:

### Required for Production
- `AUTH_SECRET` - NextAuth secret (keep secure)
- `NEXTAUTH_URL` - Your app URL (e.g., https://yourdomain.com)
- `DATABASE_URL` - Auto-generated in Docker, but needed for standalone usage

### Optional But Recommended
- `SMTP_USER` / `SMTP_PASSWORD` - Gmail app password for email sending
- `MOBITECH_API_KEY` - SMS API key for bulk messaging
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` - Initial admin credentials

### Google OAuth (Optional)
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

[See .env.docker for all available options]

## Database Management

### Access MySQL directly

```bash
# From development container
docker exec -it muheshimiwa-mysql-dev mysql -p mejja

# From production container
docker exec -it muheshimiwa-mysql mysql -p mejja
```

### View database in Prisma Studio

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:studio

# Production
docker-compose exec app npm run db:studio
```

### Run migrations manually

```bash
docker-compose exec app npx prisma migrate deploy
```

### Seed database again

```bash
docker-compose exec app npm run db:seed
```

## Deployment

### Cloud Platforms

#### Railway.app (Recommended - Free tier available)

1. Connect your GitHub repo to Railway
2. Add MySQL service (auto-provisioned)
3. Deploy with:
   ```bash
   docker-compose up
   ```
4. Set environment variables in Railway dashboard
5. Set `NEXTAUTH_URL` to your Railway domain

#### Render.com

1. Create new Web Service from Docker
2. Connect GitHub repo
3. Set environment variables in Render dashboard
4. Deploy

#### Heroku (with Docker support)

```bash
heroku container:push web
heroku container:release web
heroku config:set NEXTAUTH_URL=https://your-app.herokuapp.com
```

#### DigitalOcean App Platform

1. Connect GitHub repo
2. Select Docker from App Spec
3. Configure MySQL database component
4. Set environment variables
5. Deploy

### Self-hosted (VPS)

```bash
# SSH into your server
ssh user@your-server.com

# Clone repo
git clone https://github.com/yourusername/muheshimiwa-node.git
cd muheshimiwa-node

# Copy and configure .env
cp .env.docker .env
# Edit with your domain and secrets
nano .env
export NEXTAUTH_URL=https://yourdomain.com

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### HTTPS with Nginx (Self-hosted)

```bash
# Install Nginx
sudo apt-get install nginx certbot python3-certbot-nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/default

# Add:
# server {
#   listen 80;
#   server_name yourdomain.com;
#   location / {
#     proxy_pass http://localhost:3000;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection 'upgrade';
#     proxy_set_header Host $host;
#   }
# }

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Restart Nginx
sudo systemctl restart nginx
```

## Troubleshooting

### Database Connection Refused

```bash
# Check MySQL is running
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Restart services
docker-compose down
docker-compose up
```

### Port 3000 Already in Use

```bash
# Use different port
docker-compose -f docker-compose.yml -e PORT=3001 up

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Migrations Failed

```bash
# Reset database (WARNING: data loss!)
docker-compose down -v
docker-compose up

# Or manually run migrations
docker-compose exec app npx prisma migrate deploy
```

### App not connecting to database

```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Should be: mysql://root:root@mysql:3306/mejja

# Verify MySQL is healthy
docker-compose exec mysql mysqladmin ping
```

### Changes not reflecting in dev mode

```bash
# Rebuild dev image
docker-compose -f docker-compose.dev.yml build --no-cache

# Restart services
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```

## Volumes & Persistence

### Production

- `mysql_data` - MySQL database files persist between restarts
- `./public` - Static assets mounted from host

### Development

- `.` (entire project) - Mounted for hot-reload
- `/app/node_modules` - Named volume to avoid conflicts
- `/app/.next` - Named volume for Next.js cache

**Persistent data:**
```bash
# View volumes
docker volume ls

# Inspect volume
docker volume inspect muheshimiwa-node_mysql_data

# Backup database
docker exec muheshimiwa-mysql mysqldump -u root -proot mejja > backup.sql

# Restore database
docker exec -i muheshimiwa-mysql mysql -u root -proot mejja < backup.sql
```

## Useful Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs app        # App logs
docker-compose logs mysql      # Database logs
docker-compose logs -f         # Follow all logs

# Execute command in container
docker-compose exec app npm run typecheck
docker-compose exec app npm run lint

# Rebuild images
docker-compose build --no-cache

# Remove containers and volumes (WARNING: data loss)
docker-compose down -v

# Scale services
docker-compose up --scale app=3  # Only works with production compose

# Docker cleanup
docker system prune              # Remove unused images/containers
docker volume prune              # Remove unused volumes
```

## Performance Tips

1. **Use .dockerignore** - Already configured to exclude node_modules, .git, etc.
2. **Development** - Use `docker-compose.dev.yml` for faster feedback
3. **Production** - Multi-stage builds keep image small (~200MB)
4. **Database** - Use named volumes for persistence
5. **Caching** - Docker layer caching speeds up builds

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: username/app:latest
          env:
            DATABASE_URL: ${{ secrets.DATABASE_URL }}
            AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Deployment](https://nextjs.org/docs/deployment/docker)
- [Railway Deployment](https://docs.railway.app/)

## Support

For issues:
1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Check `.env` configuration
4. Verify database is running: `docker-compose ps`
