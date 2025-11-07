# Deploying to Azure VM - Step-by-Step Guide

## Prerequisites
- An Azure account
- SSH client (Terminal on Mac/Linux, PuTTY on Windows)
- Basic command line knowledge

## Option 1: Static Hosting with Nginx (Recommended)

### Step 1: Build Your Application Locally

First, you need to build your React application for production:

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

This creates a `dist` folder with optimized static files.

### Step 2: Create and Configure Azure VM

1. **Create a VM in Azure Portal:**
   - Go to Azure Portal → Virtual Machines → Create
   - Choose Ubuntu 22.04 LTS
   - Select size (B1s or B2s is sufficient for small traffic)
   - Configure authentication (SSH public key recommended)
   - Allow inbound ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Note your VM's public IP address**

### Step 3: Connect to Your VM

```bash
ssh azureuser@<your-vm-ip>
```

### Step 4: Install Nginx on VM

```bash
# Update package list
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 5: Transfer Built Files to VM

From your local machine (in a new terminal):

```bash
# Navigate to your project directory
cd /path/to/your/project

# Copy dist folder to VM
scp -r dist/* azureuser@<your-vm-ip>:/tmp/app
```

### Step 6: Configure Nginx on VM

Back in your SSH session:

```bash
# Create web directory
sudo mkdir -p /var/www/jewelry-store

# Move files from tmp to web directory
sudo mv /tmp/app/* /var/www/jewelry-store/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/jewelry-store
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/jewelry-store
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name <your-vm-ip>;
    
    root /var/www/jewelry-store;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable the site and restart Nginx:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/jewelry-store /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 7: Access Your Site

Open browser and navigate to: `http://<your-vm-ip>`

---

## Option 2: Node.js with PM2 (For SSR or API)

### Step 1: Install Node.js on VM

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Install PM2 Process Manager

```bash
sudo npm install -g pm2
```

### Step 3: Transfer Project Files

From local machine:

```bash
# Create archive (excluding node_modules)
tar --exclude='node_modules' -czf jewelry-store.tar.gz .

# Copy to VM
scp jewelry-store.tar.gz azureuser@<your-vm-ip>:~/
```

### Step 4: Set Up Application on VM

```bash
# Create app directory
mkdir -p ~/jewelry-store
cd ~/jewelry-store

# Extract files
tar -xzf ../jewelry-store.tar.gz

# Install dependencies
npm install

# Build application
npm run build
```

### Step 5: Serve with PM2

Create a server file:

```bash
nano server.js
```

Add this content:

```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Install Express:

```bash
npm install express
```

Start with PM2:

```bash
pm2 start server.js --name jewelry-store
pm2 save
pm2 startup
```

### Step 6: Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/jewelry-store
```

Add:

```nginx
server {
    listen 80;
    server_name <your-vm-ip>;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/jewelry-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Optional: Set Up Custom Domain with SSL

### Step 1: Configure DNS

Point your domain's A record to your VM's IP address.

### Step 2: Install Certbot (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Step 3: Get SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts to complete SSL setup.

---

## Updating Your Application

When you make changes:

### For Static Hosting (Option 1):

```bash
# Build locally
npm run build

# Copy new files
scp -r dist/* azureuser@<your-vm-ip>:/tmp/app

# On VM, replace files
sudo rm -rf /var/www/jewelry-store/*
sudo mv /tmp/app/* /var/www/jewelry-store/
sudo chown -R www-data:www-data /var/www/jewelry-store
```

### For Node.js with PM2 (Option 2):

```bash
# On VM
cd ~/jewelry-store
git pull  # If using git
# OR upload new files via scp

npm install
npm run build
pm2 restart jewelry-store
```

---

## Monitoring and Maintenance

### Check Application Status

```bash
# Nginx status
sudo systemctl status nginx

# PM2 status (if using Option 2)
pm2 status
pm2 logs jewelry-store
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Firewall Configuration

```bash
# Enable firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

---

## Troubleshooting

**Site not loading:**
- Check if Nginx is running: `sudo systemctl status nginx`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify firewall allows port 80: `sudo ufw status`

**404 errors on refresh:**
- Ensure `try_files` directive is in Nginx config
- Make sure index.html exists in the root directory

**Permission errors:**
- Check file ownership: `ls -la /var/www/jewelry-store`
- Fix permissions: `sudo chown -R www-data:www-data /var/www/jewelry-store`

---

## Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Configure SSH key authentication** (disable password auth)

3. **Set up automatic security updates:**
   ```bash
   sudo apt install unattended-upgrades -y
   ```

4. **Use SSL/TLS** (Let's Encrypt as shown above)

5. **Implement rate limiting in Nginx:**
   ```nginx
   limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
   
   server {
       # ... other config
       limit_req zone=mylimit burst=20;
   }
   ```

---

## Alternative: Using Azure Static Web Apps (Easier)

For a simpler deployment without managing VMs:

1. Build your app: `npm run build`
2. In Azure Portal, create a "Static Web App"
3. Connect to your GitHub repo or upload the `dist` folder
4. Azure handles hosting, SSL, and CDN automatically

This is recommended if you don't need server-side functionality!

---

## Quick Reference Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart PM2 app
pm2 restart jewelry-store

# View logs
pm2 logs jewelry-store
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check memory usage
free -h
```
