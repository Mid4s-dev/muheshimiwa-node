#!/bin/bash

# Stop and clean up Docker services

set -e

echo "🛑 Stopping Muheshimiwa services..."

# Determine which compose file to use
COMPOSE_FILE="docker-compose.yml"

if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
fi

# Stop containers
docker-compose -f "$COMPOSE_FILE" down

echo "✅ Services stopped"

# Show options
echo ""
echo "Options:"
echo "  ./stop-docker.sh         - Stop production services"
echo "  ./stop-docker.sh dev     - Stop development services"
echo ""
echo "To remove volumes (WARNING: data loss):"
echo "  docker-compose -f $COMPOSE_FILE down -v"
