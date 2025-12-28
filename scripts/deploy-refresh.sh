#!/bin/bash

# ==========================================
# YouStudy Server Refresh & Deploy Script
# ==========================================

echo "🚀 Starting Full Server Refresh..."

# 1. Pull the latest code from git (SKIPPED - Manual Upload)
# echo "⬇️  Pulling latest changes..."
# git pull

# 2. Cleanup Caches
# removing .next ensures a fresh build
# removing node_modules/.cache ensures no stale dependencies
echo "🧹 Cleaning caches..."
rm -rf .next
rm -rf node_modules/.cache

# 3. Install Dependencies
# (Fast install, respects package-lock.json)
echo "📦 Installing/Updating dependencies..."
npm ci

# 4. Build the Application
echo "🏗️  Building Next.js application..."
npm run build

# 5. Restart PM2 Process
# Reloads the process with zero-downtime (if clustered) or simple restart
echo "🔄 Restarting PM2 process..."
# Adjust 'app-name' or 'all' based on your pm2 list
pm2 reload all --update-env

echo "✅ SUCCESS: Server refreshed and deployed!"
echo "👉 NOTE: If you use Cloudflare, don't forget to purge the cache in their dashboard."
