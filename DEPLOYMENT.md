# 🚀 Deployment Guide

This guide covers multiple deployment options for the Airbnb Clone application.

## 📋 Table of Contents
- [Quick Start with Docker](#quick-start-with-docker)
- [Deployment Options](#deployment-options)
  - [Option 1: Docker Compose (Easiest)](#option-1-docker-compose-easiest)
  - [Option 2: Cloud Platforms (Recommended for Production)](#option-2-cloud-platforms-recommended-for-production)
  - [Option 3: Manual Deployment](#option-3-manual-deployment)
- [Environment Configuration](#environment-configuration)
- [Production Checklist](#production-checklist)

---

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

### One-Command Deployment
```bash
# Clone and navigate to the project
cd Github-App-Demo

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Your app will be available at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 📦 Deployment Options

### Option 1: Azure VM with GitHub Actions CI/CD (Recommended for Production-like Demo)

Perfect for: Multi-week deployments, automated updates, production-like environment

**Overview:**
- Full control over the environment
- Automated deployments on every push
- No cold starts
- Predictable performance
- Easy to manage

**Cost:** $15-30/month for a few weeks

**Setup Time:** 30-45 minutes (one-time)

**Documentation:**
1. **[AZURE-VM-SETUP.md](AZURE-VM-SETUP.md)** - Complete VM setup guide
2. **[GITHUB-SECRETS-SETUP.md](GITHUB-SECRETS-SETUP.md)** - Configure automated deployment

**Quick Overview:**

1. **Create Azure VM** (10 minutes)
   - Use Standard_B2s size (2 vCPU, 4GB RAM)
   - Ubuntu Server 22.04 LTS
   - Configure SSH access

2. **Setup VM Environment** (15 minutes)
   - Install Docker & Docker Compose
   - Configure environment variables
   - Setup firewall

3. **Configure GitHub Actions** (10 minutes)
   - Add secrets to GitHub repository
   - GitHub Actions workflow automatically created

4. **Deploy** (Automatic)
   - Push to main branch → automatic deployment
   - 3-5 minutes deployment time
   - 20-30 seconds downtime during updates

**Features:**
- ✅ Automated CI/CD pipeline
- ✅ Deploy on every push to main
- ✅ Health checks and verification
- ✅ No GitHub credentials needed on VM
- ✅ Easy rollback capabilities
- ✅ Full deployment logs in GitHub Actions

**After Setup:**
- Application: http://YOUR_VM_IP:3000
- Backend API: http://YOUR_VM_IP:5000
- Updates: Automatic on git push

---

### Option 2: Docker Compose (Easiest)

Perfect for: Quick demos, testing, local development

**Steps:**

1. **Configure Environment Variables**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env and set your values (especially JWT_SECRET)
   nano .env
   ```

2. **Build and Start**
   ```bash
   docker-compose up --build -d
   ```

3. **Verify Deployment**
   ```bash
   # Check container status
   docker-compose ps
   
   # Check logs
   docker-compose logs backend
   docker-compose logs frontend
   
   # Test backend health
   curl http://localhost:5000/health
   ```

4. **Access Application**
   - Open http://localhost:3000 in your browser

**Useful Commands:**
```bash
# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# View real-time logs
docker-compose logs -f

# Execute commands in containers
docker-compose exec backend sh
docker-compose exec frontend sh

# Remove everything including volumes
docker-compose down -v
```

---

### Option 3: Cloud Platforms (Free Tiers)

#### A. Deploy to Render.com (Free Tier)

**Backend Deployment:**

1. Sign up at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `airbnb-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Docker`
   - **Plan:** Free
   - **Environment Variables:**
     ```
     NODE_ENV=production
     PORT=5000
     JWT_SECRET=<generate-random-secret>
     ```
5. Click "Create Web Service"
6. **Note the URL** (e.g., `https://airbnb-backend.onrender.com`)

**Frontend Deployment:**

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `airbnb-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://airbnb-backend.onrender.com
     ```
4. Click "Create Static Site"

**⚠️ Note:** Free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

#### B. Deploy to Railway.app ($5 Free Credit)

1. Install Railway CLI
   ```bash
   npm install -g @railway/cli
   ```

2. Login and Initialize
   ```bash
   railway login
   railway init
   ```

3. Deploy Backend
   ```bash
   cd backend
   railway up
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-secret-key
   ```

4. Deploy Frontend
   ```bash
   cd ../frontend
   railway up
   railway variables set VITE_API_URL=<your-backend-url>
   ```

**Or use Railway Web Interface:**
- Visit [railway.app](https://railway.app)
- Connect GitHub repo
- Deploy automatically

---

#### C. Deploy to Fly.io (Free Tier)

1. Install Fly CLI
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login
   ```bash
   fly auth login
   ```

3. Deploy Backend
   ```bash
   cd backend
   fly launch
   # Follow prompts, select region
   
   # Set environment variables
   fly secrets set NODE_ENV=production
   fly secrets set JWT_SECRET=your-secret-key
   
   # Deploy
   fly deploy
   ```

4. Deploy Frontend
   ```bash
   cd ../frontend
   fly launch
   fly secrets set VITE_API_URL=https://your-backend.fly.dev
   fly deploy
   ```

---

#### D. Deploy to Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**

1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Deploy Frontend
   ```bash
   cd frontend
   vercel
   # Follow prompts
   # Set environment variable: VITE_API_URL
   ```

**Backend on Render:** (See Option 2A above)

---

### Option 4: Manual Deployment (VPS/Cloud VM)

Perfect for: Full control, dedicated resources

**Prerequisites:**
- Ubuntu 22.04 VPS (DigitalOcean, AWS EC2, etc.)
- Root or sudo access

**Installation Steps:**

1. **Connect to Your Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Docker**
   ```bash
   # Update packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Logout and login for group changes
   exit
   ssh user@your-server-ip
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/Github-App-Demo.git
   cd Github-App-Demo
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

5. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

6. **Setup Nginx Reverse Proxy (Optional but Recommended)**
   ```bash
   sudo apt install nginx -y
   
   # Create nginx config
   sudo nano /etc/nginx/sites-available/airbnb
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/airbnb /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt (Recommended)**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🔧 Environment Configuration

### Backend Environment Variables

Create `backend/.env`:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.com

# JWT Secret - MUST CHANGE IN PRODUCTION
JWT_SECRET=generate-a-strong-random-secret-key-here

# Optional: MongoDB (app works without it using mock data)
# MONGODB_URI=mongodb://username:password@host:port/database
```

### Frontend Environment Variables

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
```

**Generate Secure JWT Secret:**
```bash
# On Linux/Mac:
openssl rand -base64 64

# Or Node.js:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## ✅ Production Checklist

Before deploying to production:

### Security
- [ ] Change `JWT_SECRET` to a secure random value
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly (set specific origins)
- [ ] Set secure environment variables
- [ ] Don't commit `.env` files to Git
- [ ] Use environment variables for secrets

### Performance
- [ ] Build optimized production bundles
- [ ] Enable gzip compression (done in nginx)
- [ ] Set up CDN for static assets (optional)
- [ ] Configure caching headers
- [ ] Optimize images

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Set up analytics (Google Analytics)
- [ ] Monitor container health
- [ ] Set up alerts for downtime

### Backup & Recovery
- [ ] Document deployment process
- [ ] Test backup/restore procedures
- [ ] Keep Docker images tagged
- [ ] Document rollback process

### Testing
- [ ] Test all features in production-like environment
- [ ] Check mobile responsiveness
- [ ] Test with real users
- [ ] Verify API endpoints
- [ ] Test authentication flow

---

## 🔍 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up --build -d
```

### Cannot Connect to Backend
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check container status
docker-compose ps

# Check network
docker network ls
```

### Frontend Build Fails
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Or kill process using the port
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

---

## 📊 Cost Comparison (Monthly)

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| **Render** | 750 hours (sleeps after 15min) | $7/month | Quick demos |
| **Railway** | $5 credit | $0.000463/GB-hour | Simple setup |
| **Fly.io** | 3 shared VMs | $1.94/month/VM | Always-on |
| **Vercel** | 100GB bandwidth | $20/month | Frontend |
| **DigitalOcean** | - | $6/month | Full control |
| **AWS** | 12 months free | Varies | Enterprise |

---

## 🎯 Recommended Setup for Different Scenarios

### 🧪 Testing/Demo (Few Weeks)
**Best:** Render.com (Free)
- Frontend: Render Static Site
- Backend: Render Web Service
- **Cost:** $0

### 🚀 MVP/Production (Long Term)
**Best:** Fly.io or Railway
- Both frontend and backend
- Always-on
- **Cost:** ~$5-10/month

### 🏢 Enterprise/High Traffic
**Best:** AWS/DigitalOcean + Docker
- Full control
- Scalable
- **Cost:** $50-200/month

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/Github-App-Demo/issues)
- **Documentation:** See README.md and ARCHITECTURE.md
- **Email:** your-email@example.com

---

**Made with ❤️ for easy deployment**

