# 🐳 Docker 101: Getting Started Guide

This guide is for users new to Docker. If you already know Docker, jump to [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md).

## What is Docker?

Docker is a containerization platform that packages your entire application (code, dependencies, database) into a single "container" that runs the same way everywhere - on your laptop, on a cloud server, or in production.

**Think of it like:**
- 📦 A shipping container: Your app + all dependencies sealed in one unit
- 🎬 A movie in a box: Opens the same way on any player, any system
- 🐳 A complete environment: Everything needed is inside

## Why Use Docker for This App?

### Before Docker (Traditional Way)
```
❌ Manual setup steps:
- Install Node.js
- Install MySQL separately
- Configure database connection
- Run npm install
- Remember migration commands
- Different setup on Mac vs Windows vs Linux
```

### With Docker (One Command)
```
✅ Single command:
./start-docker.sh dev

Everything works identically on everyone's machine!
```

## Prerequisites

### What You Need Installed

1. **Docker Desktop** (includes Docker + Docker Compose)
   - Mac: https://docs.docker.com/desktop/install/mac-install/
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Linux: https://docs.docker.com/engine/install/

2. **Git** (to clone the repository)
   - https://git-scm.com/

3. **Text Editor** (to edit .env files)
   - VS Code (recommended): https://code.visualstudio.com/
   - Or any text editor

### Verify Installation

```bash
# Open terminal/command prompt and run:
docker --version
# Should output: Docker version 20.10.0 or higher

docker-compose --version
# Should output: Docker Compose version 2.0.0 or higher
```

If commands not found, restart your terminal or computer after installing Docker.

## First-Time Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/muheshimiwa-node.git
cd muheshimiwa-node
```

### Step 2: Copy Environment Template

```bash
# Copy the template to create your local config
cp .env.docker .env.local

# Open and edit the file
nano .env.local
# Or use VS Code: code .env.local
```

### Step 3: Edit Configuration

In `.env.local`, update these sections:

**Email (Gmail):**
```bash
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"  # Use Google App Password, not regular password
SMTP_FROM="your-email@gmail.com"
```

**Where to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows/Mac/Linux
3. Google gives you a 16-char password
4. Paste it as `SMTP_PASSWORD`

**SMS API (optional):**
```bash
MOBITECH_API_KEY="your-api-key-from-mobitech"
```

Leave other fields as-is for local development.

### Step 4: Start the Application

```bash
# Make startup script executable (one-time)
chmod +x start-docker.sh

# Start with development mode (hot-reload)
./start-docker.sh dev
```

**What happens:**
1. Docker downloads required images (first time only, ~500MB)
2. Docker starts MySQL database
3. Waits for database to be ready
4. Runs database migrations
5. Seeds sample campaign data
6. Starts Next.js development server

**First-time output:**
```
Pulling mysql:8.0 ...
Building app ...
Creating network muheshimiwa-network-dev ...
Creating muheshimiwa-mysql-dev ... done
Creating muheshimiwa-app-dev ... done

✅ Database is ready!
🔄 Running Prisma migrations...
🔄 Seeding database...
🚀 Starting Next.js dev server with hot-reload...

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 5: Access the App

Open your browser: http://localhost:3000

**Default login:**
- Username: `admin`
- Password: `admin` (or what you set in `.env.local`)

## Common Tasks

### Stop the App

```bash
# Press Ctrl+C in the terminal where it's running
# Or in a new terminal:
docker-compose -f docker-compose.dev.yml down
```

### Restart the App

```bash
./start-docker.sh dev
```

### View Database

```bash
# Option 1: Prisma Studio (visual interface)
docker-compose exec app npm run db:studio

# Option 2: MySQL command line
docker-compose exec mysql mysql -p mejja
# Password: root (or whatever you set)
```

### View Logs

```bash
# All logs
docker-compose logs -f

# Just app logs
docker-compose logs -f app

# Just database logs
docker-compose logs -f mysql

# Stop following logs: Press Ctrl+C
```

### Reload Code Changes

Just edit your code and save. Changes appear instantly in the browser! This is hot-reload in action.

If that doesn't work:
```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```

## Understanding Docker Compose

`docker-compose.yml` defines your services as YAML:

```yaml
services:
  mysql:
    image: mysql:8.0          # Use MySQL version 8.0
    environment:              # Set environment variables
      MYSQL_DATABASE: mejja
    ports:
      - "3306:3306"           # Expose port 3306 locally
    volumes:
      - mysql_data:/var/lib/mysql  # Persist data between restarts

  app:
    build:                     # Build from Dockerfile
      context: .
      dockerfile: Dockerfile.dev
    depends_on:               # Wait for mysql first
      mysql:
        condition: service_healthy
    ports:
      - "3000:3000"           # Expose port 3000 locally
    volumes:
      - .:/app                # Mount current directory for hot-reload
```

**Key concepts:**
- `services`: Each service is a container (like MySQL, Next.js)
- `image`: Pre-built image (mysql:8.0)
- `build`: Build from Dockerfile
- `ports`: Expose port from container to host machine
- `volumes`: Persist data or mount code
- `depends_on`: Wait for other services

## Troubleshooting for Beginners

### "Docker is not running"
```bash
# Solution: Start Docker Desktop
# Mac/Windows: Open Docker Desktop application
# Linux: sudo systemctl start docker
```

### "Port 3000 is already in use"
```bash
# Solution 1: Stop other app using port 3000
lsof -ti:3000 | xargs kill -9

# Solution 2: Use different port
PORT=3001 ./start-docker.sh dev
# App at http://localhost:3001
```

### "MySQL won't connect"
```bash
# Solution: Restart everything
docker-compose down -v     # -v removes data volume
docker-compose up          # Fresh start
```

### "My code changes aren't showing"
```bash
# Solution: Restart dev server
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```

### "I see an error about missing package.json"
```bash
# Solution: Make sure you're in the project directory
pwd                        # Should end with muheshimiwa-node
ls package.json            # Should exist

# If not, navigate to correct directory:
cd ~/path/to/muheshimiwa-node
```

### "How do I remove everything and start fresh?"
```bash
# Stop containers
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v

# Remove images
docker image rm muheshimiwa-node-app

# Start fresh
docker-compose up
```

## Docker Concepts Explained Simply

| Term | What It Is | Analogy |
|------|-----------|---------|
| **Image** | Blueprint for creating containers | Cookie cutter |
| **Container** | Running instance of an image | Baked cookie |
| **Dockerfile** | Instructions for building image | Recipe |
| **docker-compose.yml** | Multi-container orchestration | Multiple recipes working together |
| **Volume** | Persistent storage | Your photo album that survives phone resets |
| **Port** | Network access point | Door number on a building |
| **Network** | Communication between containers | Internal phone system |

## Production Deployment

Once comfortable with Docker locally, deployment to cloud is similar:

```bash
# 1. Push to GitHub
git push

# 2. Connect to Railway/Render/DigitalOcean
# They auto-detect docker-compose.yml

# 3. Set environment variables
# NEXTAUTH_URL=https://yourdomain.com
# SMTP_* = your credentials

# 4. Deploy
# Platform automatically:
# - Builds Docker image
# - Starts MySQL
# - Runs migrations
# - Starts Next.js server
# - Sets up HTTPS
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed deployment instructions.

## Next Steps

1. **Get comfortable locally**: Run `./start-docker.sh dev` and explore
2. **Read quick reference**: [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)
3. **Learn Docker**: https://docs.docker.com/get-started/
4. **Deploy to cloud**: Follow [DOCKER_SETUP.md](./DOCKER_SETUP.md)

## Useful Resources

- **Docker Official**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose/
- **Next.js Deployment**: https://nextjs.org/docs/deployment/docker
- **Prisma Docker**: https://www.prisma.io/docs/orm/deployment/deploy-to-docker

## Still Have Questions?

- Check [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)
- See [DOCKER_SETUP.md](./DOCKER_SETUP.md) troubleshooting
- Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

**You've got this! Docker makes development and deployment so much easier once you get the hang of it.** 🚀
