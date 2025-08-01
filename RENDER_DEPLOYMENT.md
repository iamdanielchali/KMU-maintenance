# Render Deployment Guide for KMU Hostel Maintenance System

## Quick Fix for Render Recognition Issues

If Render doesn't recognize your repository, follow these steps:

### 1. Repository Structure Check
Ensure your repository has these files:
- ✅ `package.json` (with start script)
- ✅ `server.js` (main entry point)
- ✅ `render.yaml` (deployment configuration)
- ✅ `public/` folder (frontend files)

### 2. Git Configuration
```bash
# Make sure all files are committed
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 3. Render Setup Steps

#### Step 1: Connect Repository
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select the repository: `KMU-maintenance`

#### Step 2: Configure Service
- **Name**: `kmu-hostel-maintenance`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

#### Step 3: Set Environment Variables
Add these in Render dashboard:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://dredlabs:DredLabs2025.@cluster0.ch6yqlc.mongodb.net/kmu_maintenance?retryWrites=true&w=majority&appName=Cluster0` |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | `your-super-secret-session-key-here` |

#### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for build to complete (2-3 minutes)
3. Your app will be available at: `https://your-app-name.onrender.com`

### 4. Troubleshooting

#### If Render Still Doesn't Recognize:
1. **Check Repository Visibility**: Make sure your GitHub repo is public or Render has access
2. **Verify Branch**: Ensure you're deploying from the correct branch (usually `main`)
3. **Clear Cache**: Try creating a new service in Render
4. **Check Logs**: Look at build logs for specific errors

#### Common Issues:
- **Missing package.json**: Ensure it exists and has a `start` script
- **Wrong entry point**: Verify `server.js` is the main file
- **Environment variables**: Make sure `MONGODB_URI` is set
- **Port configuration**: The app uses `process.env.PORT` which Render sets automatically

### 5. Post-Deployment

#### Create Admin Account:
```bash
# Via Render Console
node setup-admin.js

# Or via API
curl -X POST https://your-app-name.onrender.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_secure_password",
    "name": "System Administrator"
  }'
```

#### Test Your Deployment:
- **Main Form**: `https://your-app-name.onrender.com/`
- **Admin Login**: `https://your-app-name.onrender.com/admin/login`
- **Admin Dashboard**: `https://your-app-name.onrender.com/admin/dashboard`

### 6. Monitoring
- Check Render dashboard for deployment status
- Monitor logs for any errors
- Set up health checks if needed

## Support
If you continue having issues, check:
1. Render's status page
2. Your repository's GitHub Actions (if any)
3. Render's documentation for Node.js deployments 