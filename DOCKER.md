# 🐳 Docker Quick Start Guide

This guide will help you run the Airbnb Clone using Docker in under 5 minutes.

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- 4GB RAM available
- 5GB disk space

## 🚀 Quick Start

### Method 1: Using Deploy Script (Recommended)

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Deploy everything
./deploy.sh

# Other commands
./deploy.sh stop      # Stop containers
./deploy.sh restart   # Restart containers
./deploy.sh logs      # View logs
./deploy.sh status    # Check status
./deploy.sh clean     # Remove everything
```

### Method 2: Using Docker Compose Directly

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🌐 Access the Application

Once deployed, access the application at:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📋 Docker Commands Cheat Sheet

### Container Management
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View container status
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Building
```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and start
docker-compose up --build -d
```

### Debugging
```bash
# Execute command in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# View resource usage
docker stats

# Inspect container
docker-compose inspect backend
```

### Cleanup
```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key

# Frontend is configured in docker-compose.yml
```

### Custom Ports

Edit `docker-compose.yml` to change ports:

```yaml
services:
  backend:
    ports:
      - "5001:5000"  # Change 5001 to your desired port
  
  frontend:
    ports:
      - "3001:80"    # Change 3001 to your desired port
```

### Build Arguments

To change the API URL for the frontend:

```yaml
services:
  frontend:
    build:
      args:
        - VITE_API_URL=http://localhost:5001
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Docker Host                 │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Frontend Container          │  │
│  │  - nginx:alpine              │  │
│  │  - Port: 3000 → 80          │  │
│  │  - Serves React build        │  │
│  └──────────────────────────────┘  │
│              │                      │
│              │ HTTP                 │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │  Backend Container           │  │
│  │  - node:18-alpine            │  │
│  │  - Port: 5000                │  │
│  │  - Express API               │  │
│  │  - Mock Data Mode            │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

## 🔍 Troubleshooting

### Containers Won't Start

**Check if ports are available:**
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check if port 3000 is in use
lsof -i :3000

# Kill process using port (if needed)
lsof -ti:5000 | xargs kill -9
```

**Check Docker status:**
```bash
# Check if Docker is running
docker info

# Check container logs
docker-compose logs backend
docker-compose logs frontend
```

### Build Failures

**Clear cache and rebuild:**
```bash
# Remove all containers and images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

### Frontend Can't Connect to Backend

**Check environment variables:**
```bash
# View frontend environment
docker-compose exec frontend env

# The VITE_API_URL should be set correctly
```

**Check network connectivity:**
```bash
# Test backend from frontend container
docker-compose exec frontend wget -O- http://backend:5000/health
```

### Container Keeps Restarting

**View logs to see what's failing:**
```bash
docker-compose logs -f backend
```

**Common issues:**
- Missing environment variables
- Port already in use
- Insufficient memory

### Out of Disk Space

**Clean up Docker:**
```bash
# Remove unused containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Remove everything unused
docker system prune -a -f
```

## 📊 Monitoring

### View Resource Usage
```bash
# Real-time stats
docker stats

# Container resource limits
docker-compose config
```

### Health Checks

The containers have built-in health checks:

```bash
# Check container health
docker-compose ps

# Should show "healthy" status
```

**Manual health checks:**
```bash
# Backend
curl http://localhost:5000/health

# Frontend
curl http://localhost:3000/health
```

## 🚢 Production Deployment

### Build for Production

```bash
# Build with production settings
docker-compose -f docker-compose.yml build

# Tag images for registry
docker tag airbnb-frontend:latest your-registry/airbnb-frontend:v1.0
docker tag airbnb-backend:latest your-registry/airbnb-backend:v1.0

# Push to registry
docker push your-registry/airbnb-frontend:v1.0
docker push your-registry/airbnb-backend:v1.0
```

### Security Best Practices

1. **Use specific image versions:**
   ```dockerfile
   FROM node:18.19.0-alpine  # Instead of node:18-alpine
   ```

2. **Run as non-root user:**
   ```dockerfile
   USER nodejs
   ```

3. **Scan for vulnerabilities:**
   ```bash
   docker scan airbnb-backend
   docker scan airbnb-frontend
   ```

4. **Use secrets management:**
   ```bash
   # Don't commit .env files
   # Use Docker secrets or environment-specific configs
   ```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Security Best Practices](https://docs.docker.com/engine/security/)

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Review this troubleshooting guide
3. Check [GitHub Issues](https://github.com/LambdaTest/Github-App-Demo/issues)
4. Read the main [DEPLOYMENT.md](DEPLOYMENT.md) guide

---

**Happy Dockerizing! 🐳**

