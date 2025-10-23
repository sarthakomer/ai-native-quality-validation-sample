# 🔧 Azure VM Setup Guide

This guide walks you through setting up an Azure Virtual Machine for deploying the Airbnb Clone application with automated GitHub Actions CI/CD.

## 📋 Prerequisites

- Azure account with active subscription
- SSH client on your local machine
- GitHub repository access

---

## 🚀 Step 1: Create Azure VM

### Option A: Using Azure Portal (Recommended for beginners)

1. **Sign in to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Create Virtual Machine**
   ```
   Navigate to: Home → Virtual machines → Create → Azure virtual machine
   ```

3. **Configure Basic Settings**
   - **Subscription:** Select your subscription
   - **Resource Group:** Create new → Name: `airbnb-demo-rg`
   - **Virtual machine name:** `airbnb-vm`
   - **Region:** Choose closest to your users (e.g., `East US`, `West Europe`)
   - **Availability options:** No infrastructure redundancy required
   - **Security type:** Standard
   - **Image:** `Ubuntu Server 22.04 LTS - x64 Gen2`
   - **Size:** `Standard_B2s` (2 vCPU, 4 GB RAM) - Recommended
     - Or `Standard_B1ms` (1 vCPU, 2 GB RAM) - Budget option

4. **Configure Administrator Account**
   - **Authentication type:** SSH public key
   - **Username:** `azureuser` (or your preferred username)
   - **SSH public key source:** Generate new key pair
   - **Key pair name:** `airbnb-vm-key`
   
   ⚠️ **Important:** Download and save the private key when prompted!

5. **Configure Inbound Ports**
   - **Public inbound ports:** Allow selected ports
   - **Select inbound ports:** 
     - SSH (22)
     - HTTP (80)
     - HTTPS (443)

6. **Configure Disks**
   - **OS disk type:** Standard SSD (Recommended)
   - **Size:** 30 GB (default is fine)

7. **Configure Networking**
   - Use default settings
   - Ensure "Public IP" is enabled

8. **Review and Create**
   - Click "Review + create"
   - Click "Create"
   - **Download the private key** (you'll only get one chance!)
   - Wait 3-5 minutes for deployment

9. **Note Your VM's Public IP**
   - After deployment, click "Go to resource"
   - Copy the **Public IP address** - you'll need this!

### Option B: Using Azure CLI (Faster for experienced users)

```bash
# Install Azure CLI if not already installed
# macOS: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Create resource group
az group create --name airbnb-demo-rg --location eastus

# Create VM with SSH key
az vm create \
  --resource-group airbnb-demo-rg \
  --name airbnb-vm \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard

# Open required ports
az vm open-port --port 22 --resource-group airbnb-demo-rg --name airbnb-vm --priority 100
az vm open-port --port 80 --resource-group airbnb-demo-rg --name airbnb-vm --priority 110
az vm open-port --port 443 --resource-group airbnb-demo-rg --name airbnb-vm --priority 120
az vm open-port --port 3000 --resource-group airbnb-demo-rg --name airbnb-vm --priority 130
az vm open-port --port 5000 --resource-group airbnb-demo-rg --name airbnb-vm --priority 140

# Get the public IP
az vm show --resource-group airbnb-demo-rg --name airbnb-vm --show-details --query publicIps -o tsv
```

---

## 🔐 Step 2: Setup SSH Access

1. **Set correct permissions on private key** (if downloaded from portal)
   ```bash
   chmod 400 ~/Downloads/airbnb-vm-key.pem
   ```

2. **Test SSH connection**
   ```bash
   ssh -i ~/Downloads/airbnb-vm-key.pem azureuser@YOUR_VM_PUBLIC_IP
   ```
   
   Replace `YOUR_VM_PUBLIC_IP` with your actual VM IP address.

3. **If using Azure CLI generated keys**
   ```bash
   ssh azureuser@YOUR_VM_PUBLIC_IP
   ```

4. **First time connection**
   - Type `yes` when asked to confirm the host fingerprint
   - You should now be logged into your VM!

---

## 📦 Step 3: Install Required Software

Run these commands on your VM (after SSH connection):

### 3.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Install Docker
```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Install Docker
sudo sh get-docker.sh

# Add your user to docker group (no sudo needed for docker commands)
sudo usermod -aG docker $USER

# Clean up
rm get-docker.sh
```

### 3.3 Install Docker Compose
```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Create symbolic link (optional, for convenience)
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### 3.4 Logout and Login Again
```bash
# Logout to apply group changes
exit

# Login again
ssh -i ~/Downloads/airbnb-vm-key.pem azureuser@YOUR_VM_PUBLIC_IP
```

### 3.5 Verify Installations
```bash
# Check Docker
docker --version
# Should show: Docker version 24.x.x or higher

# Check Docker Compose
docker-compose --version
# Should show: Docker Compose version v2.x.x or higher

# Test Docker (no sudo needed)
docker run hello-world
```

---

## 📁 Step 4: Create Application Directory

```bash
# Create application directory
mkdir -p ~/Github-App-Demo

# Navigate to directory
cd ~/Github-App-Demo
```

---

## 🔒 Step 5: Configure Environment Variables

1. **Generate a secure JWT secret**
   ```bash
   openssl rand -base64 64
   ```
   Copy the output - you'll need it!

2. **Create .env file (Quick automated method)**
   ```bash
   # This creates the .env file automatically
   JWT_SECRET=$(openssl rand -base64 64)
   VM_IP=$(curl -s ifconfig.me)
   
   cat > ~/Github-App-Demo/.env << EOF
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=http://${VM_IP}:3000
   JWT_SECRET=${JWT_SECRET}
   VM_HOST=${VM_IP}
   EOF
   ```

   **Or manually:**
   ```bash
   nano ~/Github-App-Demo/.env
   ```
   
   Add these environment variables:
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=http://YOUR_VM_PUBLIC_IP:3000
   JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE
   VM_HOST=YOUR_VM_PUBLIC_IP
   ```
   
   Replace:
   - `YOUR_VM_PUBLIC_IP` with your actual VM IP (run `curl ifconfig.me` to get it)
   - `YOUR_GENERATED_JWT_SECRET_HERE` with the secret from step 1

4. **Save and exit**
   - Press `Ctrl + X`
   - Press `Y` to confirm
   - Press `Enter`

5. **Verify .env file**
   ```bash
   cat ~/Github-App-Demo/.env
   ```

---

## 🔥 Step 6: Configure Firewall (UFW)

```bash
# Install UFW if not installed
sudo apt install ufw -y

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application ports
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🔐 Step 7: Additional Security (Optional but Recommended)

### 7.1 Disable Password Authentication
```bash
sudo nano /etc/ssh/sshd_config
```

Find and change these lines:
```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
```

Restart SSH:
```bash
sudo systemctl restart sshd
```

### 7.2 Install Fail2Ban (Brute Force Protection)
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 7.3 Enable Automatic Security Updates
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## ✅ Step 8: Verify Setup

Run this checklist:

```bash
# 1. Check Docker
docker --version && echo "✅ Docker installed"

# 2. Check Docker Compose
docker-compose --version && echo "✅ Docker Compose installed"

# 3. Check application directory
ls -la ~/Github-App-Demo && echo "✅ App directory exists"

# 4. Check .env file
test -f ~/Github-App-Demo/.env && echo "✅ .env file exists"

# 5. Check firewall
sudo ufw status | grep -q "Status: active" && echo "✅ Firewall configured"

# 6. Check open ports
sudo netstat -tlnp | grep -E '3000|5000' || echo "✅ Ports available"
```

---

## 📊 Step 9: Save Important Information

Create a file with your VM details for reference:

```bash
cat > ~/vm-info.txt << EOF
=================================
Azure VM Information
=================================
VM Name: airbnb-vm
Resource Group: airbnb-demo-rg
Public IP: $(curl -s ifconfig.me)
Username: $(whoami)
SSH Command: ssh $(whoami)@$(curl -s ifconfig.me)

Application URLs (after deployment):
- Frontend: http://$(curl -s ifconfig.me):3000
- Backend: http://$(curl -s ifconfig.me):5000
- Health: http://$(curl -s ifconfig.me):5000/health

Setup completed on: $(date)
=================================
EOF

cat ~/vm-info.txt
```

---

## 🎯 Next Steps

Your Azure VM is now ready! Next:

1. ✅ VM is created and configured
2. ✅ Docker and Docker Compose installed
3. ✅ Application directory created
4. ✅ Environment variables configured
5. ✅ Firewall configured

**Continue to:** [GITHUB-SECRETS-SETUP.md](GITHUB-SECRETS-SETUP.md) to configure GitHub Actions for automated deployment.

---

## 🆘 Troubleshooting

### Can't SSH into VM?

**Check security group rules:**
```bash
az vm show --resource-group airbnb-demo-rg --name airbnb-vm --show-details
```

**Verify SSH key permissions:**
```bash
chmod 400 ~/Downloads/airbnb-vm-key.pem
```

### Docker commands require sudo?

You need to logout and login again after adding user to docker group:
```bash
exit
ssh azureuser@YOUR_VM_IP
```

### Firewall blocking connections?

Check UFW status:
```bash
sudo ufw status verbose
```

Add rule if needed:
```bash
sudo ufw allow PORT/tcp
```

### Forgot VM Public IP?

**Using Azure Portal:**
- Navigate to your VM → Overview → Public IP address

**Using Azure CLI:**
```bash
az vm show --resource-group airbnb-demo-rg --name airbnb-vm --show-details --query publicIps -o tsv
```

**From within VM:**
```bash
curl ifconfig.me
```

---

## 💰 Cost Management

### Enable Auto-Shutdown (Save money)

**Using Azure Portal:**
1. Navigate to your VM
2. Go to "Auto-shutdown" in left menu
3. Enable auto-shutdown
4. Set time (e.g., 7:00 PM)
5. Set timezone
6. Enable notifications (optional)
7. Save

**Using Azure CLI:**
```bash
az vm auto-shutdown -g airbnb-demo-rg -n airbnb-vm --time 1900
```

### Monitor Costs

- Check Azure Cost Management regularly
- Set up budget alerts
- Delete VM when demo is complete:
  ```bash
  az group delete --name airbnb-demo-rg --yes --no-wait
  ```

---

**VM Setup Complete! 🎉** 

Proceed to [GITHUB-SECRETS-SETUP.md](GITHUB-SECRETS-SETUP.md) for the next step.

