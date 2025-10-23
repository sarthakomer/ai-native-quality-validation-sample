# 🚀 Docker Quick Start - 5 Minute Setup

Deploy your Airbnb Clone with Docker in just 5 minutes!

## ⚡ Ultra-Quick Start

```bash
# 1. Run the deploy script
./deploy.sh

# 2. Wait 2-3 minutes for containers to start

# 3. Open your browser
open http://localhost:3000
```

That's it! Your app is running! 🎉

---

## 📝 What Just Happened?

The deploy script:
1. ✅ Checked Docker installation
2. ✅ Created environment file (.env)
3. ✅ Built Docker images for frontend & backend
4. ✅ Started containers
5. ✅ Verified health checks

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:5000 | API endpoints |
| **Health Check** | http://localhost:5000/health | Server status |

---

## 🎮 Useful Commands

```bash
# View logs (real-time)
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend

# Stop everything
./deploy.sh stop

# Restart everything
./deploy.sh restart

# Check status
./deploy.sh status

# Clean up completely
./deploy.sh clean
```

---

## 🔧 First-Time Setup

If the deploy script doesn't work, run manually:

```bash
# 1. Build images
docker-compose build

# 2. Start containers
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

---

## 🐛 Quick Troubleshooting

### Port Already in Use?

```bash
# Kill processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Then restart
./deploy.sh
```

### Containers Won't Start?

```bash
# Check Docker is running
docker info

# If not, start Docker Desktop
open -a Docker

# Wait 30 seconds, then try again
./deploy.sh
```

### Need to Start Fresh?

```bash
# Complete cleanup
./deploy.sh clean

# Rebuild everything
docker-compose build --no-cache

# Start again
./deploy.sh
```

---

## 📊 What's Included

**Backend Container:**
- Node.js 18 Alpine
- Express API server
- Mock data (no database needed!)
- Health checks enabled
- Port: 5000

**Frontend Container:**
- React 19 app
- Nginx web server
- Optimized production build
- Port: 3000 (mapped from internal 80)

**Network:**
- Isolated Docker network
- Backend and frontend can communicate
- Health checks ensure proper startup order

---

## 🎯 Next Steps

### For Local Development:
```bash
# Stop Docker containers
./deploy.sh stop

# Use npm dev servers instead (hot reload)
cd backend && npm run dev
cd frontend && npm run dev
```

### For Cloud Deployment:
1. Read [DEPLOYMENT.md](DEPLOYMENT.md) for cloud options
2. Follow [DEPLOYMENT-PLAN.md](DEPLOYMENT-PLAN.md) step-by-step
3. Recommended: Render.com (free tier)

---

## 💡 Pro Tips

1. **Environment Variables**
   - Edit `.env` file to customize settings
   - Important: Change `JWT_SECRET` for production!

2. **Performance**
   - First build takes 5-10 minutes
   - Subsequent builds use cache (faster)
   - Images are optimized for production

3. **Monitoring**
   - Use `docker stats` to see resource usage
   - Containers have built-in health checks
   - Check logs regularly: `docker-compose logs -f`

4. **Cleanup**
   - Run `./deploy.sh clean` when done
   - Frees up ~500MB disk space
   - Removes all containers and images

---

## 📚 Learn More

- **Docker Basics:** [DOCKER.md](DOCKER.md)
- **Full Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Step-by-Step Plan:** [DEPLOYMENT-PLAN.md](DEPLOYMENT-PLAN.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

## ✅ Success Checklist

After running `./deploy.sh`, verify:

- [ ] See "🎉 Deployment Complete!" message
- [ ] Frontend opens at http://localhost:3000
- [ ] Backend health check works: `curl http://localhost:5000/health`
- [ ] Listings appear on homepage
- [ ] Search functionality works
- [ ] No errors in logs: `docker-compose logs`

---

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f`
2. Read troubleshooting section above
3. See [DOCKER.md](DOCKER.md) for detailed guide
4. Open an issue on GitHub

---

**Happy Deploying! 🐳✨**

