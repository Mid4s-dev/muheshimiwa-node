# Muheshimiwa MD

Muheshimiwa MD is a Next.js 15 constituency management platform for bursaries, projects, polling stations, public communication, and impact tracking.

This repository now uses a single project README plus a single AGENTS file for working instructions. The earlier split markdown guides have been consolidated here.

## What The App Does

- Public campaign and constituency pages for residents and stakeholders.
- Project tracking for infrastructure, security, and bursary initiatives.
- Polling station lookup and constituency reference data.
- Supporter registration and communication tools.
- Admin dashboards and authenticated operational workflows.
- SEO-friendly public content with robots, sitemap, and structured data.

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- NextAuth.js
- Prisma ORM
- MySQL
- tRPC
- React Query
- Tailwind CSS
- Nodemailer
- Sharp for image processing

## Architecture At A Glance

- `src/app` contains the app router pages, layouts, and route handlers.
- `src/server` contains auth, database, API, and utility code.
- `src/trpc` contains client and server helpers for type-safe APIs.
- `prisma` contains the schema, migrations, and seed data.
- `public` contains assets and uploads used by the site.

## Key Routes

- `/` home page
- `/about` team and background page
- `/manifesto` campaign or program details
- `/projects` public project listing
- `/polling-stations` polling station directory
- `/register` supporter registration
- `/admin-login` authentication entry point
- `/admin` protected admin dashboard

## Core Capabilities

### Public Experience

- Hero messaging and campaign positioning.
- Featured projects and impact stories.
- Constituency stats and public trust signals.
- Search-friendly metadata and social sharing support.

### Admin Experience

- Secure login and session-based access.
- Content management for posts and projects.
- Bursary and supporter tracking.
- Messaging and outreach workflows.
- Reporting data for leadership review.

## Seeded Demo Data

The repo ships with sample data for presentation and testing.

- 1 admin user
- 3 projects
- 3 polling stations
- 3 impact stories
- 1 bursary distribution record
- 2 mailing list entries
- 2 campaign posts

Default demo credentials are described in the environment files and seed notes. Avoid using weak credentials in production.

## Local Development

```bash
npm install
npm run dev
```

If you are using the Docker workflow:

```bash
cp .env.docker .env.local
./start-docker.sh dev
```

The app is typically available at `http://localhost:3000` in Docker mode.

## Docker Quick Start

```bash
cp .env.docker .env.local
./start-docker.sh dev
```

Production-style local run:

```bash
cp .env.docker .env
./start-docker.sh
```

Useful Docker commands:

```bash
docker-compose -f docker-compose.dev.yml up
docker-compose up
docker-compose logs -f app
docker-compose exec app npm run db:studio
docker-compose exec app npm run db:seed
```

## Environment Variables

Common variables used by the app:

- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `MOBITECH_API_KEY`
- `MOBITECH_SHORTCODE`
- `MOBITECH_SERVICE_ID`

Use the Docker and production example env files as templates when preparing a new environment.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run preview
npm run check
npm run lint
npm run lint:fix
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:studio
npm run format:check
npm run format:write
npm run typecheck
```

## Deployment Notes

- The project is Docker-ready for local development and cloud deployment.
- Prisma migrations and database seeding are part of the startup flow.
- Production environments should use strong secrets and HTTPS.
- Keep `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` aligned with the deployed domain.
- Review the environment files before production rollout.

## SEO Notes

- Public pages include metadata, Open Graph, and Twitter card support.
- Robots and sitemap routes are implemented in the app router.
- Public content is designed for search visibility and shareability.
- Admin and API paths are not intended for indexing.

## Storage Roadmap

The current media plan is to move uploads from local disk to bucket storage so media remains durable across deployments and scale-out.

Recommended direction:

- Use S3-compatible storage.
- Keep public URLs in the database.
- Centralize upload logic behind a storage utility.
- Migrate existing uploads in a controlled cutover.

## Troubleshooting

- If Docker ports conflict, change the host port or stop the conflicting process.
- If the database is out of sync, rerun migrations and reseed if needed.
- If auth fails, check the environment variables and seed credentials.
- If media or uploads disappear between deployments, move them to external object storage.

## Related Assets

- A stakeholder presentation deck has been generated at `docs/muheshimiwa-md-stakeholder-briefing.pptx`.
