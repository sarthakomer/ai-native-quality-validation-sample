# 🔐 GitHub Secrets Setup Guide

This guide explains how to configure GitHub repository secrets for automated deployment to Azure VM.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Azure VM created and configured ([AZURE-VM-SETUP.md](AZURE-VM-SETUP.md))
- ✅ SSH private key for VM access
- ✅ Admin access to your GitHub repository

---

## 🔑 Required GitHub Secrets

You need to add 4 secrets to your GitHub repository:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AZURE_VM_HOST` | VM's public IP address | `20.124.45.67` |
| `AZURE_VM_USERNAME` | SSH username | `azureuser` |
| `AZURE_VM_SSH_KEY` | Private SSH key | `-----BEGIN RSA...` |
| `AZURE_VM_PORT` | SSH port (optional) | `22` |

---

## 📝 Step 1: Gather Required Information

### 1.1 Get VM Public IP Address

**Option A: From Azure Portal**
1. Go to [portal.azure.com](https://portal.azure.com)
2. Navigate to: Home → Virtual machines → airbnb-vm
3. Find "Public IP address" in the Overview section
4. Copy the IP address

**Option B: Using Azure CLI**
```bash
az vm show --resource-group airbnb-demo-rg --name airbnb-vm --show-details --query publicIps -o tsv
```

**Option C: From within VM**
```bash
curl ifconfig.me
```

### 1.2 Get SSH Username

This is the username you chose during VM creation (default: `azureuser`)

### 1.3 Get Private SSH Key

**If you created VM via Azure Portal:**
- The private key was downloaded when you created the VM
- File name: `airbnb-vm-key.pem` (or similar)
- Location: Usually `~/Downloads/` folder

**If you created VM via Azure CLI:**
- Private key location: `~/.ssh/id_rsa`
- Get the key content:
  ```bash
  cat ~/.ssh/id_rsa
  ```

---

## 🔧 Step 2: Add Secrets to GitHub

### Method 1: Using GitHub Web Interface (Recommended)

1. **Navigate to Repository Settings**
   - Go to your repository: `https://github.com/qazi07/Github-App-Demo`
   - Click on "Settings" tab
   - In left sidebar, click "Secrets and variables" → "Actions"

2. **Add AZURE_VM_HOST**
   - Click "New repository secret"
   - Name: `AZURE_VM_HOST`
   - Value: Your VM's public IP (e.g., `20.124.45.67`)
   - Click "Add secret"

3. **Add AZURE_VM_USERNAME**
   - Click "New repository secret"
   - Name: `AZURE_VM_USERNAME`
   - Value: Your SSH username (e.g., `azureuser`)
   - Click "Add secret"

4. **Add AZURE_VM_SSH_KEY**
   - Click "New repository secret"
   - Name: `AZURE_VM_SSH_KEY`
   - Value: **Complete contents** of your private key file
   
   **Get the key content:**
   ```bash
   # macOS/Linux
   cat ~/Downloads/airbnb-vm-key.pem
   
   # Or if using Azure CLI generated key
   cat ~/.ssh/id_rsa
   ```
   
   **Copy everything from `-----BEGIN...` to `...END RSA PRIVATE KEY-----`**
   
   Example format:
   ```
   -----BEGIN RSA PRIVATE KEY-----
   MIIEpAIBAAKCAQEA...
   (many lines of text)
   ...abc123
   -----END RSA PRIVATE KEY-----
   ```
   
   - Paste the entire key into the value field
   - Click "Add secret"

5. **Add AZURE_VM_PORT (Optional)**
   - Click "New repository secret"
   - Name: `AZURE_VM_PORT`
   - Value: `22` (default SSH port)
   - Click "Add secret"
   
   ℹ️ **Note:** This secret is optional. If not provided, port 22 will be used by default.

### Method 2: Using GitHub CLI (Advanced)

```bash
# Install GitHub CLI if not installed
# macOS: brew install gh
# Linux: See https://github.com/cli/cli#installation

# Login to GitHub
gh auth login

# Add secrets
gh secret set AZURE_VM_HOST --body "YOUR_VM_PUBLIC_IP"
gh secret set AZURE_VM_USERNAME --body "azureuser"
gh secret set AZURE_VM_SSH_KEY < ~/Downloads/airbnb-vm-key.pem
gh secret set AZURE_VM_PORT --body "22"
```

---

## ✅ Step 3: Verify Secrets

1. **Check secrets are added**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - You should see 3-4 secrets listed:
     - ✅ AZURE_VM_HOST
     - ✅ AZURE_VM_USERNAME
     - ✅ AZURE_VM_SSH_KEY
     - ✅ AZURE_VM_PORT (optional)

2. **Secret values are hidden**
   - GitHub shows only secret names, not values (for security)
   - You'll see "Updated X days ago" but not the actual values
   - This is normal and expected!

---

## 🧪 Step 4: Test SSH Connection Locally

Before triggering the GitHub Actions workflow, test SSH connection locally:

```bash
# Test connection with the private key
ssh -i ~/Downloads/airbnb-vm-key.pem azureuser@YOUR_VM_PUBLIC_IP

# If successful, you should be logged into your VM
# Type 'exit' to logout
```

If this works, your GitHub Actions workflow should work too!

---

## 🚀 Step 5: Trigger First Deployment

Now that secrets are configured, trigger the deployment:

### Option A: Push to Main Branch
```bash
# Make any small change (or use an empty commit)
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Option B: Manual Trigger
1. Go to: Repository → Actions → "Deploy to Azure VM" workflow
2. Click "Run workflow"
3. Select branch: `main`
4. Click "Run workflow"

### Monitor Deployment

1. Go to: Repository → Actions
2. Click on the running workflow
3. Watch the deployment progress
4. Check for any errors

**Expected duration:** 3-5 minutes for first deployment

---

## 📊 Step 6: Verify Deployment

After GitHub Actions completes successfully:

1. **Check workflow output**
   - Should show "✅ Deployment Successful! 🚀"
   - Shows application URLs

2. **Access your application**
   ```
   Frontend: http://YOUR_VM_IP:3000
   Backend:  http://YOUR_VM_IP:5000
   Health:   http://YOUR_VM_IP:5000/health
   ```

3. **Test in browser**
   - Open frontend URL
   - Verify listings are showing
   - Test search functionality

---

## 🔒 Security Best Practices

### Protect Your Private Key

✅ **DO:**
- Store private key securely on your local machine
- Use `chmod 400` to set correct permissions
- Back up the key to a secure location
- Use GitHub Secrets for automation

❌ **DON'T:**
- Never commit private key to git
- Never share private key in chat/email
- Never paste private key in public places
- Never store private key without encryption

### Rotate Keys Regularly

For long-term use, rotate SSH keys every 90 days:

```bash
# Generate new key pair on Azure
az vm user update \
  --resource-group airbnb-demo-rg \
  --name airbnb-vm \
  --username azureuser \
  --ssh-key-value @~/.ssh/new_key.pub

# Update GitHub secret with new private key
```

### Use GitHub Environments (Optional)

For better security, use GitHub Environments:

1. Create environment: Repository → Settings → Environments → New environment
2. Name it "production"
3. Add protection rules (e.g., required reviewers)
4. Move secrets to environment scope
5. Update workflow to use environment

---

## 🆘 Troubleshooting

### GitHub Actions fails with "Permission denied"

**Cause:** SSH key is incorrect or has wrong format

**Solution:**
1. Verify private key format (should include `-----BEGIN...` and `-----END...`)
2. Copy entire key including header and footer
3. No extra spaces or newlines at beginning/end
4. Re-add the secret if needed

### GitHub Actions fails with "Host key verification failed"

**Cause:** VM host key not in known_hosts

**Solution:**
- The workflow should handle this automatically with `ssh-keyscan`
- If persists, check VM is accessible: `ssh azureuser@YOUR_VM_IP`

### GitHub Actions times out

**Cause:** VM is not accessible or firewall blocking connection

**Solution:**
1. Check VM is running in Azure Portal
2. Verify firewall allows SSH (port 22)
3. Check Azure NSG (Network Security Group) rules
4. Test SSH connection locally

### Secrets not found

**Cause:** Secrets not added or wrong names

**Solution:**
1. Verify secrets exist: Repository → Settings → Secrets and variables → Actions
2. Check spelling is exact (case-sensitive):
   - `AZURE_VM_HOST` (not `AZURE_HOST` or `VM_HOST`)
   - `AZURE_VM_USERNAME`
   - `AZURE_VM_SSH_KEY`
3. Re-add any missing secrets

### Deployment succeeds but app doesn't work

**Cause:** Environment variables not set on VM

**Solution:**
```bash
# SSH into VM
ssh azureuser@YOUR_VM_IP

# Check .env file exists
cat ~/Github-App-Demo/.env

# If missing, create it following AZURE-VM-SETUP.md Step 5
```

---

## 📚 Additional Resources

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Azure VM Documentation](https://docs.microsoft.com/en-us/azure/virtual-machines/)
- [SSH Key Management Best Practices](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

---

## ✅ Setup Complete Checklist

- [ ] VM public IP address obtained
- [ ] SSH username confirmed
- [ ] Private SSH key file located
- [ ] All 4 secrets added to GitHub
- [ ] SSH connection tested locally
- [ ] First deployment triggered
- [ ] Application accessible in browser
- [ ] All features working correctly

---

**GitHub Secrets Configured! 🎉**

Your CI/CD pipeline is now ready. Every push to main branch will automatically deploy to your Azure VM!

**Next:** Make a code change and push to see automated deployment in action!

