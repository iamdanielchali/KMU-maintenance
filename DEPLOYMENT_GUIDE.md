# Render Deployment Guide

This guide will help you deploy the KMU Hostel Maintenance System to Render.

## Prerequisites

1. **MongoDB Atlas Database** (already set up)
2. **GitHub Repository** (your code should be on GitHub)
3. **Render Account** (free tier available)

## Step 1: Prepare Your Repository

### 1.1 Ensure Required Files Exist
- ✅ `package.json` (with start script)
- ✅ `server.js` (main entry point)
- ✅ `public/` folder (frontend files)
- ✅ Environment variables configured

### 1.2 Update .gitignore
Make sure your `.gitignore` includes:
```
node_modules/
.env
uploads/
```

## Step 2: Deploy to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `kmu-hostel-maintenance`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (for testing)

### 2.3 Set Environment Variables
In the Render dashboard, add these environment variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://dredlabs:DredLabs2025.@cluster0.ch6yqlc.mongodb.net/kmu_maintenance?retryWrites=true&w=majority&appName=Cluster0` |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | `your-super-secret-session-key-here` |

### 2.4 Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Wait for deployment to complete (usually 2-3 minutes)

## Step 3: Configure Domain

### 3.1 Custom Domain (Optional)
1. In your Render service dashboard
2. Go to "Settings" → "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 3.2 Default Render URL
Your app will be available at:
`https://your-app-name.onrender.com`

## Step 4: Create Admin Account

### 4.1 Using Render Console
1. Go to your service dashboard
2. Click "Shell" tab
3. Run the admin setup:
```bash
node setup-admin.js
```

### 4.2 Or Use API Endpoint
You can also create an admin via API:
```bash
curl -X POST https://your-app-name.onrender.com/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_secure_password",
    "name": "System Administrator"
  }'
```

## Step 5: Test Your Deployment

### 5.1 Check All Endpoints
- **Main Form**: `https://your-app-name.onrender.com/`
- **Admin Login**: `https://your-app-name.onrender.com/admin/login`
- **Admin Dashboard**: `https://your-app-name.onrender.com/admin/dashboard`

### 5.2 Test Features
- ✅ Submit maintenance request
- ✅ Login to admin dashboard
- ✅ Upload images
- ✅ Export reports
- ✅ Update request status

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `NODE_ENV` | ❌ | Set to `production` for secure cookies |
| `SESSION_SECRET` | ❌ | Secret for session encryption |
| `PORT` | ❌ | Render sets this automatically |

## Troubleshooting

### Build Failures
1. Check `package.json` has correct start script
2. Ensure all dependencies are listed
3. Verify Node.js version compatibility

### Database Connection Issues
1. Check MongoDB Atlas IP whitelist
2. Verify connection string format
3. Ensure database user has correct permissions

### File Upload Issues
1. Render has read-only filesystem
2. Uploads will be lost on restart
3. Consider using cloud storage (AWS S3, Cloudinary)

### Session Issues
1. Ensure `SESSION_SECRET` is set
2. Check cookie settings for HTTPS
3. Verify session middleware configuration

## Production Considerations

### Security
- ✅ Use strong `SESSION_SECRET`
- ✅ Enable HTTPS (automatic on Render)
- ✅ Set `NODE_ENV=production`
- ✅ Use environment variables for all secrets

### Performance
- ⚠️ Free tier has limitations
- ⚠️ Consider paid plan for production
- ⚠️ Monitor resource usage

### File Storage
- ⚠️ Render filesystem is ephemeral
- ⚠️ Uploads will be lost on restart
- ⚠️ Consider cloud storage solution

## Monitoring

### Render Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment status

### Health Checks
Your app includes basic health endpoints:
- `GET /` - Main page
- `GET /api/admin/status` - Auth status

## Support

If you encounter issues:
1. Check Render logs in dashboard
2. Verify environment variables
3. Test locally with same config
4. Contact Render support if needed

## Cost

- **Free Tier**: $0/month (with limitations)
- **Paid Plans**: Starting at $7/month
- **Custom Domains**: Free with paid plans

Your KMU Hostel Maintenance System is now ready for production deployment on Render! 🚀 