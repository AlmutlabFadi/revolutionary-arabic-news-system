#!/bin/bash

echo "🚀 Deploying Golan 24"

echo "🏗️  Building production images..."
docker-compose -f docker-compose.yml build

echo "📦 Starting production deployment..."
docker-compose -f docker-compose.yml up -d

echo "⏳ Waiting for deployment to complete..."
sleep 20

echo "🔍 Checking deployment status..."
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 System available at: http://localhost"
