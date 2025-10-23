#!/bin/bash

# Deployment Script for Airbnb Clone
# This script helps you deploy the application using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        echo "Visit: https://www.docker.com/products/docker-desktop"
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Check if Docker daemon is running
check_docker_running() {
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Create environment file if it doesn't exist
setup_env() {
    if [ ! -f .env ]; then
        print_info "Creating .env file..."
        cat > .env << 'EOF'
# Backend Environment Variables
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-please-change-this-in-production

# MongoDB (Optional - app works with mock data)
# MONGODB_URI=mongodb://localhost:27017/airbnb-clone
EOF
        print_success "Created .env file"
        print_warning "Please edit .env and change JWT_SECRET before deploying to production!"
    else
        print_success ".env file already exists"
    fi
}

# Build and start containers
start_containers() {
    print_info "Building Docker images..."
    docker-compose build
    
    print_info "Starting containers..."
    docker-compose up -d
    
    print_success "Containers started successfully!"
}

# Check container health
check_health() {
    print_info "Waiting for services to be healthy..."
    
    sleep 5
    
    # Check backend
    for i in {1..30}; do
        if curl -s http://localhost:5000/health > /dev/null; then
            print_success "Backend is healthy!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Backend failed to start"
            docker-compose logs backend
            exit 1
        fi
        sleep 2
    done
    
    # Check frontend
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            print_success "Frontend is healthy!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Frontend failed to start"
            docker-compose logs frontend
            exit 1
        fi
        sleep 2
    done
}

# Show status
show_status() {
    echo ""
    echo "=================================="
    echo "🎉 Deployment Complete!"
    echo "=================================="
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend:  http://localhost:5000"
    echo "💚 Health:   http://localhost:5000/health"
    echo ""
    echo "Useful commands:"
    echo "  View logs:        docker-compose logs -f"
    echo "  Stop services:    docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  View status:      docker-compose ps"
    echo ""
}

# Main deployment flow
main() {
    echo ""
    echo "🚀 Starting Airbnb Clone Deployment"
    echo "===================================="
    echo ""
    
    # Run checks
    check_docker
    check_docker_compose
    check_docker_running
    
    # Setup
    setup_env
    
    # Deploy
    start_containers
    check_health
    
    # Show status
    show_status
}

# Handle script arguments
case "${1:-}" in
    "stop")
        print_info "Stopping containers..."
        docker-compose down
        print_success "Containers stopped"
        ;;
    "restart")
        print_info "Restarting containers..."
        docker-compose restart
        print_success "Containers restarted"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    "clean")
        print_warning "This will remove all containers, images, and volumes"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            docker-compose rm -f
            print_success "Cleaned up"
        fi
        ;;
    *)
        main
        ;;
esac

