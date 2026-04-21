# Bucket Storage Migration Plan

## Goal

Move media storage from local disk (`public/uploads/...`) to object storage buckets so uploads are durable, scalable, and deploy-safe across multiple app instances.

## Scope

- Project featured images
- Project gallery images
- Impact story images
- Any future media uploaded from admin (campaign assets, downloadable files)

## Recommended Architecture

1. Use an S3-compatible bucket layer (AWS S3, Cloudflare R2, Backblaze B2 S3, or MinIO for self-hosting).
2. Keep media references in DB as public URLs (or signed URL metadata where private assets are needed).
3. Route uploads through server API initially, then move to direct browser-to-bucket uploads using pre-signed URLs.

## Phase 1: Foundation (Low Risk)

1. Add storage configuration environment variables:
   - `STORAGE_PROVIDER` (e.g., `s3`)
   - `STORAGE_BUCKET`
   - `STORAGE_REGION`
   - `STORAGE_ENDPOINT` (for S3-compatible providers)
   - `STORAGE_ACCESS_KEY_ID`
   - `STORAGE_SECRET_ACCESS_KEY`
   - `STORAGE_PUBLIC_BASE_URL`

2. Create a storage abstraction in `src/server/utils/storage.ts`:
   - `uploadImage(buffer, key, contentType)`
   - `deleteObject(key)`
   - `buildPublicUrl(key)`

3. Keep API contract unchanged so admin UI keeps working while backend storage switches.

## Phase 2: Upload Path Migration

1. Update media upload endpoint (`src/app/api/media/upload/route.ts`) to:
   - process image with Sharp as today
   - upload output to bucket instead of writing to local filesystem
   - return bucket-backed URL

2. Naming convention for object keys:
   - `projects/featured/{uuid}.webp`
   - `projects/gallery/{projectId}/{uuid}.webp`
   - `impact/{uuid}.webp`
   - `campaign/{yyyy}/{mm}/{uuid}.webp`

3. Add content controls:
   - enforce max size and MIME checks
   - set `Content-Type` and long-lived `Cache-Control`
   - optionally set immutable keys with UUIDs

## Phase 3: Data Migration

1. Build a one-time migration script:
   - scan existing local assets under `public/uploads`
   - upload to bucket with deterministic keys
   - update DB URLs in related tables (`Project`, `ProjectMedia`, `ImpactStory`)

2. Run migration in dry-run mode first and log mapping:
   - local path -> bucket key -> resulting URL

3. Validate in staging before production cutover.

## Phase 4: Direct Uploads (Performance)

1. Add endpoint that creates pre-signed upload URL.
2. Upload directly from browser to bucket.
3. Send finalized object URL/key to app backend for DB persistence.

This reduces app server bandwidth and improves upload performance.

## Security and Operations

1. Use least-privilege IAM credentials (only required bucket operations).
2. Enable bucket versioning and lifecycle rules:
   - move old objects to infrequent access
   - delete orphaned temporary uploads after N days
3. Add monitoring:
   - upload failures
   - storage growth
   - error rates by route

## Rollback Strategy

1. Keep local-write code path behind a feature flag (`STORAGE_PROVIDER=local`) during rollout.
2. If bucket issues occur, toggle to local mode while keeping read compatibility for bucket URLs already in DB.

## Success Criteria

1. New uploads no longer depend on local disk persistence.
2. App works correctly across multiple stateless instances.
3. Existing images remain accessible after migration.
4. Median upload latency does not regress beyond agreed threshold.