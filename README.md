# Muheshimiwa MD - Embakasi Central Campaign Platform

A complete Next.js 15 web application for political constituency management featuring bursaries, projects, polling stations, and impact tracking.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3001 in your browser
```

The app will be available at:
- **Local**: http://localhost:3001
- **Network**: http://192.168.0.106:3001

## Technology Stack

- **Next.js 15** with Turbopack for fast development
- **React 19** for UI components
- **TypeScript** for type safety
- **NextAuth.js v4** for authentication
- **Prisma v6** as ORM
- **MySQL** database (locally hosted on `localhost:3306`)
- **tRPC v11** for type-safe APIs
- **Tailwind CSS** for styling
- **React Query** for client-side caching

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## Database Setup

### Initial Setup
```bash
# Install dependencies
npm install

# Configure environment variables (copy from .env.example)
cp .env.example .env

# Update DATABASE_URL in .env with your MySQL credentials
DATABASE_URL="mysql://root:root@localhost:3306/mejja"

# Run migrations to create database schema
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### Database Configuration
- **Database Host**: `localhost`
- **Database Port**: `3306`
- **Database Name**: `mejja`
- **Default User**: `root`
- **Default Password**: `root`

## Seeded Database

The application comes pre-populated with sample data for demonstration and testing. Use the seed script to populate the database:

```bash
npm run db:seed
```

### Seeded Data Summary

| Table | Records | Description |
|-------|---------|-------------|
| User | 1 | Admin account |
| Project | 3 | Infrastructure & bursary projects |
| PollingStation | 3 | Voting locations across wards |
| ImpactStory | 3 | Success stories from the campaign |
| BursaryDistribution | 1 | Upcoming bursary distribution event |
| MailingList | 2 | Demo supporter contacts |
| Post | 2 | Campaign posts |

### Seeded Records in Detail

#### Admin User
```
Username: admin
Password: root (as configured in .env)
Role: admin
Ward: Embakasi Central
Email: admin@muheshimiwa.local
```

#### Projects (3 records)
1. **Mukuru Drainage Upgrade**
   - Category: Infrastructure
   - Status: Active
   - Ward: Mukuru Kwa Njenga
   - Impact: 3,200 households
   - Description: Upgraded drainage channels across flood-prone zones to reduce waterlogging and improve sanitation

2. **Ward Bursary Digitization**
   - Category: Bursaries
   - Status: Completed
   - Ward: Embakasi
   - Impact: 1,100 students
   - Description: Introduced transparent online bursary tracking to reduce delays and increase accountability

3. **Street Lighting Phase II**
   - Category: Security
   - Status: Planned
   - Ward: Utawala
   - Impact: 42 junctions
   - Description: Installed additional high-mast security lights along key access roads and market routes

#### Polling Stations (3 records)
1. **Embakasi Primary School**
   - Code: ECS-001
   - Ward: Embakasi
   - Location: Embakasi Central Ward, near social hall
   - Voters: 4,200
   - Coordinates: -1.3111, 36.9032

2. **Mukuru Community Hall**
   - Code: ECS-002
   - Ward: Mukuru Kwa Njenga
   - Location: Mukuru Kwa Njenga Ward, next to chief camp
   - Voters: 3,100
   - Coordinates: -1.3297, 36.8741

3. **Utawala Grounds**
   - Code: ECS-003
   - Ward: Utawala
   - Location: Utawala Ward, behind market center
   - Voters: 5,100
   - Coordinates: -1.2856, 36.9593

#### Impact Stories (3 records)
1. **Cleaner Streets in Mukuru**
   - Ward: Mukuru Kwa Njenga
   - Impact: 12 cleanup zones
   - Featured: Yes
   - Order: 1
   - Description: Weekly coordinated clean-up drives now keep major routes passable and safer for schools and traders

2. **Bursary Support Reached More Families**
   - Ward: Embakasi
   - Impact: +35% approvals
   - Featured: Yes
   - Order: 2
   - Description: A fairer review process increased bursary access for vulnerable households

3. **Night Safety Improved**
   - Ward: Utawala
   - Impact: 40+ lit points
   - Featured: Yes
   - Order: 3
   - Description: Expanded public lighting has reduced dark spots and improved evening movement for residents

#### Bursary Distribution (1 record)
- **Location**: Embakasi Social Hall
- **Ward**: Embakasi
- **Status**: Pending
- **Description**: Forms collection and bursary disbursement for secondary and tertiary students
- **Distribution Date**: 7 days from seed date
- **Deadline**: 14 days from seed date

#### Mailing List (2 records)
1. **Demo Supporter One**
   - Phone: +254700000101
   - Email: supporter1@example.com
   - Ward: Embakasi
   - Source: seed

2. **Demo Supporter Two**
   - Phone: +254700000102
   - Email: supporter2@example.com
   - Ward: Utawala
   - Source: seed

#### Posts (2 records)
1. **Karibu Embakasi Central** - Created by admin
2. **Community First Development Agenda** - Created by admin

## Testing the Application

### Admin Login
1. Navigate to http://localhost:3001/admin-login
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `root`
3. You'll be redirected to the admin dashboard

### Available Pages
- **Home**: http://localhost:3001 - Homepage with hero, stats, and impact stories
- **Projects**: http://localhost:3001/projects - View all Maendeleo projects
- **Polling Stations**: http://localhost:3001/polling-stations - Find voting locations
- **Register**: http://localhost:3001/register - Join supporter list
- **About**: http://localhost:3001/about - Meet the team
- **Admin Panel**: http://localhost:3001/admin - Admin dashboard (requires login)
- **Admin Login**: http://localhost:3001/admin-login - Admin authentication

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Building & Testing
npm run build           # Build for production
npm run start          # Start production server
npm run preview        # Build and start production server
npm run check          # Run linter and type check
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with fixes

# Database
npm run db:migrate     # Run Prisma migrations
npm run db:push        # Push schema to database
npm run db:seed        # Seed database with initial data
npm run db:studio      # Open Prisma Studio

# Code Quality
npm run format:check   # Check code formatting
npm run format:write   # Format code with Prettier
npm run typecheck      # Run TypeScript type checker
```

## SMS Integration (Mobitech)

The admin mass-SMS feature uses Mobitech `sendmultiple` API.

Required environment variables:

```bash
MOBITECH_API_KEY=""
MOBITECH_SHORTCODE="MOBI-TECH"
MOBITECH_SERVICE_ID="0"
MOBITECH_VALIDATE_NUMBERS="false"
MOBITECH_DLR_SECRET=""
```

- Messages are sent in one API request through `https://app.mobitechtechnologies.com/sms/sendmultiple`.
- Optional number validation uses `GET /sms/mobile` when `MOBITECH_VALIDATE_NUMBERS=true`.
- Delivery reports can be pointed to `POST /api/sms/dlr`.
- Protect DLR with header `x-dlr-secret: <MOBITECH_DLR_SECRET>` or query `?token=<MOBITECH_DLR_SECRET>`.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── admin/             # Admin dashboard
│   ├── admin-login/       # Admin authentication
│   ├── api/               # API routes & tRPC
│   ├── projects/          # Projects page
│   ├── polling-stations/  # Polling stations
│   ├── register/          # Supporter registration
│   └── _components/       # Reusable components
├── server/
│   ├── auth/              # NextAuth configuration
│   ├── db.ts              # Prisma client
│   ├── api/               # tRPC routers
│   └── utils/             # Server utilities
├── trpc/                  # tRPC client setup
├── types/                 # TypeScript types
├── env.js                 # Environment validation
└── styles/                # Global CSS
```

## Database Schema

The application uses these main entities:

- **User**: System users and admins
- **Project**: Development projects (infrastructure, bursaries, security)
- **PollingStation**: Voting locations with voter counts
- **ImpactStory**: Success stories and campaign highlights
- **BursaryDistribution**: Bursary distribution events
- **MailingList**: Supporter contacts for communications
- **Post**: Campaign announcements

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

### Docker image

This repo includes a multi-arch Dockerfile that works on both Intel/AMD64 and ARM64 machines.

Build a local image:

```bash
docker build \
   --build-arg DATABASE_URL="mysql://root:root@localhost:3306/mejja" \
   -t muheshimiwa-md:latest .
```

Build and publish a multi-platform image with Buildx:

```bash
docker buildx build \
   --platform linux/amd64,linux/arm64 \
   --build-arg DATABASE_URL="mysql://root:root@localhost:3306/mejja" \
   -t your-registry/muheshimiwa-md:latest \
   --push .
```

Run the container:

```bash
docker run --rm -p 3000:3000 \
   -e DATABASE_URL="mysql://root:root@your-db-host:3306/mejja" \
   -e AUTH_SECRET="replace-me" \
   -e SMTP_HOST="replace-me" \
   -e SMTP_USER="replace-me" \
   -e SMTP_PASSWORD="replace-me" \
   muheshimiwa-md:latest
```

Set your real production environment variables at runtime, especially `DATABASE_URL`, `AUTH_SECRET`, SMTP settings, and any Mobitech values.

## Admin Credential Setup

### Local Development
The application comes with a pre-configured admin account for local development:

```
Username: admin
Password: root
```

These are configured in the `.env` file:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=root (as configured in .env)
AUTH_SECRET=9GozsVCV4IdHXNGE/bwvpvDK1yMbo6o6RwpocR2MJs4=
```

### Production Security
Use strong bootstrap admin credentials in your local `.env` (copy from `.env.example`):

1. Set `ADMIN_USERNAME` to a non-obvious username.
2. Set `ADMIN_PASSWORD` to a long random value.
3. Ensure `AUTH_SECRET` is present (required for signed admin sessions).

Generate secure values:

```bash
# Generate AUTH secret (or use: npx auth secret)
openssl rand -base64 32

# Generate strong admin password
openssl rand -base64 48 | tr -d '\n'
```

## Admin Credential Rotation

For production, rotate credentials with this sequence:

1. Change `ADMIN_PASSWORD` in environment variables.
2. Redeploy/restart the app so the new environment value is active.
3. Sign in as admin and create/update durable admin accounts in the dashboard/API.
4. Remove bootstrap credentials by unsetting `ADMIN_USERNAME` and `ADMIN_PASSWORD` after migration.

This keeps long-term access in hashed DB-backed admin accounts and avoids permanent static bootstrap secrets.
