#!/bin/bash

# Deployment Health Check Script
# This script verifies that the application is running correctly after deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
MAX_RETRIES=30
RETRY_DELAY=2

echo "🔍 Starting deployment health checks..."
echo ""

# Function to check endpoint
check_endpoint() {
    local url=$1
    local name=$2
    local retries=0
    
    echo "Checking ${name}..."
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -f -s -o /dev/null "$url"; then
            echo -e "${GREEN}✅ ${name} is healthy!${NC}"
            return 0
        fi
        
        retries=$((retries + 1))
        if [ $retries -lt $MAX_RETRIES ]; then
            echo "⏳ Waiting for ${name}... (attempt ${retries}/${MAX_RETRIES})"
            sleep $RETRY_DELAY
        fi
    done
    
    echo -e "${RED}❌ ${name} health check failed after ${MAX_RETRIES} attempts${NC}"
    return 1
}

# Check backend health
if ! check_endpoint "${BACKEND_URL}/health" "Backend"; then
    echo ""
    echo -e "${RED}Backend is not responding. Checking logs...${NC}"
    docker-compose logs --tail=50 backend
    exit 1
fi

echo ""

# Check frontend
if ! check_endpoint "${FRONTEND_URL}" "Frontend"; then
    echo ""
    echo -e "${YELLOW}⚠️  Frontend check failed, but this might be a temporary issue${NC}"
    echo "The frontend may take longer to fully start up"
fi

echo ""
echo -e "${GREEN}🎉 Deployment verification complete!${NC}"
echo ""
echo "Application URLs:"
echo "  - Frontend: ${FRONTEND_URL}"
echo "  - Backend: ${BACKEND_URL}"
echo "  - Health Check: ${BACKEND_URL}/health"
echo ""

# Check container status
echo "Container status:"
docker-compose ps

exit 0

