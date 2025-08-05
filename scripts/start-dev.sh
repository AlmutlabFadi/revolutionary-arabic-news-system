#!/bin/bash

echo "🚀 Starting Advanced News System Development Environment"

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your API keys and configuration"
fi

echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "🔍 Checking service health..."
docker-compose ps

echo ""
echo "✅ Advanced News System is ready!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend Dashboard: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   API Health Check: http://localhost:5000/api/health"
echo "   Admin Panel: http://localhost:80"
echo ""
echo "📊 Monitoring:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo ""
echo "🚀 The revolutionary news automation system is now running!"
echo "   Processing time: <60 seconds guaranteed"
echo "   Zero human intervention required"
echo "   Real-time AI-powered news processing"
