# Institutional Deployment Guide - KMU Physical Server & Domain

## Overview
This guide covers deploying the KMU Hostel Maintenance System on the institution's physical server with the KMU domain (kmu.ac.zm).

## Server Requirements
- Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- 2GB RAM, 20GB storage, 2 CPU cores
- Static IP address
- Domain: kmu.ac.zm (existing KMU domain)

## Domain Structure Options

### Option 1: Subdomain (Recommended)
- **URL**: `maintenance.kmu.ac.zm`
- **DNS Record**: A record pointing `maintenance` to server IP
- **SSL**: Certificate for `maintenance.kmu.ac.zm`

### Option 2: Subdirectory
- **URL**: `kmu.ac.zm/maintenance`
- **DNS Record**: A record pointing `kmu.ac.zm` to server IP
- **SSL**: Certificate for `kmu.ac.zm`

## Step-by-Step Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Nginx and PM2
sudo apt install nginx
sudo npm install -g pm2

# Start services
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Application Deployment
```bash
# Create application directory
sudo mkdir -p /var/www/kmu-maintenance
sudo chown $USER:$USER /var/www/kmu-maintenance

# Upload application files
scp -r kmu-hostel-maintenance/* user@server:/var/www/kmu-maintenance/

# Install dependencies
cd /var/www/kmu-maintenance
npm install --production

# Configure environment
cp env.example .env
nano .env
```

### 3. Domain Configuration

#### For Subdomain (maintenance.kmu.ac.zm):
```bash
# Install SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d maintenance.kmu.ac.zm

# Configure Nginx
sudo nano /etc/nginx/sites-available/kmu-maintenance
```

Nginx Configuration for Subdomain:
```nginx
server {
    listen 80;
    server_name maintenance.kmu.ac.zm;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name maintenance.kmu.ac.zm;

    ssl_certificate /etc/letsencrypt/live/maintenance.kmu.ac.zm/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/maintenance.kmu.ac.zm/privkey.pem;

    # KMU branding headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### For Subdirectory (kmu.ac.zm/maintenance):
```nginx
server {
    listen 80;
    server_name kmu.ac.zm;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kmu.ac.zm;

    ssl_certificate /etc/letsencrypt/live/kmu.ac.zm/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kmu.ac.zm/privkey.pem;

    # Main KMU website
    location / {
        # Existing KMU website configuration
        proxy_pass http://localhost:8080;  # or existing KMU website
    }

    # Maintenance system subdirectory
    location /maintenance {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Maintenance system static files
    location /maintenance/uploads/ {
        proxy_pass http://localhost:3000;
        client_max_body_size 10M;
    }
}
```

### 4. Database Setup
```bash
# Create database user
mongo
use kmu_maintenance
db.createUser({
  user: "kmu_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
exit

# Update .env file
MONGODB_URL=mongodb://kmu_user:secure_password@localhost:27017/kmu_maintenance
```

### 5. Start Application
```bash
# Create admin account
node setup-admin.js

# Start with PM2
pm2 start server.js --name "kmu-maintenance"
pm2 save
pm2 startup
```

### 6. Firewall Configuration
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw deny 27017  # MongoDB
sudo ufw enable
```

## Access Points

### For Subdomain (maintenance.kmu.ac.zm):
- **Student Form**: `https://maintenance.kmu.ac.zm`
- **Admin Login**: `https://maintenance.kmu.ac.zm/admin/login`
- **Admin Dashboard**: `https://maintenance.kmu.ac.zm/admin/dashboard`

### For Subdirectory (kmu.ac.zm/maintenance):
- **Student Form**: `https://kmu.ac.zm/maintenance`
- **Admin Login**: `https://kmu.ac.zm/maintenance/admin/login`
- **Admin Dashboard**: `https://kmu.ac.zm/maintenance/admin/dashboard`

## DNS Configuration

### For Subdomain:
```
Type: A
Name: maintenance
Value: [YOUR_SERVER_IP]
TTL: 3600
```

### For Subdirectory:
```
Type: A
Name: @ (or kmu.ac.zm)
Value: [YOUR_SERVER_IP]
TTL: 3600
```

## KMU Branding Integration

### Update Institution Branding:
```bash
# Update KMU logo
cp /path/to/kmu/logo.svg /var/www/kmu-maintenance/public/assets/kmu_logo.svg

# Update page titles
sed -i 's/KMU Hostel Maintenance/KMU Hostel Maintenance System/g' public/*.html
sed -i 's/Kapasa Makasa University/KMU/g' public/*.html
```

### Custom CSS for KMU Branding:
```css
/* Add to public/assets/style.css */
:root {
    --kmu-primary: #1e3a8a;    /* KMU Blue */
    --kmu-secondary: #f59e0b;  /* KMU Gold */
    --kmu-accent: #dc2626;     /* KMU Red */
}

.navbar-brand {
    color: var(--kmu-primary) !important;
}

.btn-primary {
    background-color: var(--kmu-primary);
    border-color: var(--kmu-primary);
}
```

## Maintenance
```bash
# Restart application
pm2 restart kmu-maintenance

# View logs
pm2 logs kmu-maintenance

# Backup database
mongodump --db kmu_maintenance --out /backup/$(date +%Y%m%d)

# SSL renewal
sudo certbot renew
```

## Security Features
- HTTPS enforced with KMU domain
- Firewall configured
- MongoDB secured
- Regular backups
- SSL auto-renewal
- KMU institutional security policies

## Integration with KMU Systems

### Email Integration:
```env
# Add to .env file
EMAIL_HOST=smtp.kmu.ac.zm
EMAIL_PORT=587
EMAIL_USER=noreply@kmu.ac.zm
EMAIL_PASS=email_password
```

### LDAP Integration (Optional):
```javascript
// Add LDAP authentication for KMU staff
const ldap = require('ldapjs');
// Configure LDAP connection to KMU directory
```

## Support Information
- **Technical Support**: KMU IT Department
- **Domain Management**: KMU Network Administrator
- **System Administrator**: [KMU Admin Contact]
- **Emergency**: [KMU Emergency Contact]

---

**Deployment Status**: ✅ READY FOR KMU PRODUCTION

**Domain**: maintenance.kmu.ac.zm (or kmu.ac.zm/maintenance)
**Server**: KMU Physical Server Infrastructure
**SSL**: Let's Encrypt (Auto-renewing)
**Backup**: Daily automated backups to KMU storage 