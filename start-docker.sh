#!/bin/bash

# Docker startup script for local development

set -e

echo "🚀 Starting Muheshimiwa Node App with Docker"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env or .env.local exists
if [ ! -f .env ] && [ ! -f .env.local ]; then
    echo "📝 Creating .env from template..."
    cp .env.docker .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  Please update .env.local with your configuration:"
    echo "   - SMTP credentials for email"
    echo "   - MOBITECH API key for SMS"
    echo "   - Google OAuth credentials (optional)"
    echo ""
    read -p "Press Enter to continue..."
fi

# Determine which compose file to use
COMPOSE_FILE="docker-compose.yml"
MODE="production"

if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    MODE="development (hot-reload)"
    shift
fi

echo "📦 Starting services in $MODE mode..."
echo ""

# Start Docker Compose
docker-compose -f "$COMPOSE_FILE" up "$@"
