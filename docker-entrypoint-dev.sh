#!/bin/bash
set -e

echo "🔄 Waiting for database to be ready..."

# Wait for MySQL to be ready using mysql command
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if mysql -h "${DATABASE_HOST:-mysql}" -P "${DATABASE_PORT:-3306}" -u "${MYSQL_USERNAME:-root}" -p"${MYSQL_ROOT_PASSWORD:-root}" -e "SELECT 1" &> /dev/null; then
    echo "✅ Database is ready!"
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  echo "Attempt $ATTEMPT/$MAX_ATTEMPTS: MySQL is unavailable - sleeping..."
  sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
  echo "❌ Failed to connect to database after $MAX_ATTEMPTS attempts"
  exit 1
fi

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy --skip-generate || true

echo "🔄 Seeding database..."
npm run db:seed || true

echo "🚀 Starting Next.js dev server with hot-reload..."
exec npm run dev
