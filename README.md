# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Admin Credential Setup

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
