#!/bin/sh
set -e

# Check if migrations need to be applied
echo "Running Prisma client generation..."
npx prisma generate

echo "Pushing database schema changes to SQLite (demoverse.db)..."
npx prisma db push --skip-generate

echo "Seeding 12 SaaS platforms and reviews..."
npx prisma db seed

# Launch Next.js production server
echo "Launching DemoVerse server on port 3000..."
exec npm run start
