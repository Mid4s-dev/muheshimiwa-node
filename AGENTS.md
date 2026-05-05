# AGENTS

This file is the single repository guide for contributors and coding agents.

## Project Summary

Muheshimiwa MD is a Next.js 15 constituency management platform with public pages, authenticated admin flows, tRPC APIs, Prisma persistence, and Docker-based deployment support.

## Working Rules

- Make minimal, focused edits.
- Use `apply_patch` for file changes.
- Do not revert user changes unless explicitly asked.
- Prefer existing project patterns over introducing new ones.
- Validate changes with the narrowest useful command after editing.

## Preferred Validation

- `npm run check`
- `npm run typecheck`
- `npm run build`
- `node scripts/create-stakeholder-deck.mjs` when presentation output changes are involved

## Documentation Rules

- Keep `README.md` as the canonical project overview.
- Keep `AGENTS.md` as the canonical working guide.
- Do not reintroduce separate markdown guides unless the user explicitly requests them.

## Deployment And Runtime Notes

- Docker is the preferred local and deployment workflow.
- Prisma migrations and seeding should stay in sync with schema changes.
- Public URLs and auth URLs should match the deployed domain in production.
- Use strong secrets in production; do not rely on demo credentials outside local testing.

## Messaging Note

- In mailing list mass email flow, `sendCampaignEmail` returns boolean; count success only when it returns `true`.
- Track skipped contacts without email separately from failed sends for accurate admin campaign stats.
