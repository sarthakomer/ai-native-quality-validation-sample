# VM Environment Configuration

When setting up your Azure VM, create the `.env` file with these variables:

```bash
# On your Azure VM, run:
cd ~/Github-App-Demo

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://YOUR_VM_PUBLIC_IP:3000
JWT_SECRET=YOUR_GENERATED_JWT_SECRET
VM_HOST=YOUR_VM_PUBLIC_IP
EOF
```

**Replace:**
- `YOUR_VM_PUBLIC_IP` - Your Azure VM's public IP address
- `YOUR_GENERATED_JWT_SECRET` - Run `openssl rand -base64 64` to generate

**Example:**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://20.124.45.67:3000
JWT_SECRET=xJ8kL2mN9pQ3rS5tU7vW0xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA==
VM_HOST=20.124.45.67
```

**Quick setup script for VM:**
```bash
# Generate JWT secret and create .env in one command
JWT_SECRET=$(openssl rand -base64 64)
VM_IP=$(curl -s ifconfig.me)

cat > ~/Github-App-Demo/.env << EOF
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://${VM_IP}:3000
JWT_SECRET=${JWT_SECRET}
VM_HOST=${VM_IP}
EOF

# Verify
cat ~/Github-App-Demo/.env
```

