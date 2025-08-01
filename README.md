# KMU Hostel Maintenance System

A web-based maintenance request system for KMU hostels, built with Node.js, Express, and MongoDB.

## Features

- **Student Portal**: Submit maintenance requests with images
- **Admin Dashboard**: Manage and track maintenance requests
- **Real-time Status Updates**: Track request progress
- **File Upload**: Attach images to maintenance requests
- **Export Functionality**: Export reports to Excel/Word

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables

**Option A: Create .env file (Recommended)**
```bash
# Create .env file in the project root
echo MONGODB_URI=mongodb+srv://dredlabs:DredLabs2025.@cluster0.ch6yqlc.mongodb.net/kmu_maintenance?retryWrites=true&w=majority&appName=Cluster0 > .env
```

**Option B: Use the provided batch file (Windows)**
```bash
start-server.bat
```

**Option C: Set environment variable manually**
```bash
# Windows
set MONGODB_URI=mongodb+srv://dredlabs:DredLabs2025.@cluster0.ch6yqlc.mongodb.net/kmu_maintenance?retryWrites=true&w=majority&appName=Cluster0

# Linux/Mac
export MONGODB_URI=mongodb+srv://dredlabs:DredLabs2025.@cluster0.ch6yqlc.mongodb.net/kmu_maintenance?retryWrites=true&w=majority&appName=Cluster0
```

### 3. Start the Server
```bash
node server.js
```

The application will start on `http://localhost:3000`

## Database Setup

### MongoDB Atlas (Required)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster

2. **Get Connection String**
   - In your Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Set Environment Variable**
   ```bash
   # Windows
   set MONGODB_URI=your_connection_string_here
   
   # Linux/Mac
   export MONGODB_URI=your_connection_string_here
   ```

4. **Or Create .env File**
   ```bash
   # Copy the example
   cp env.example .env
   
   # Edit .env file with your connection string
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
   ```

### Fallback: In-Memory Mode

If `MONGODB_URI` is not set, the app will automatically run in in-memory mode. Data will be lost on server restart.

## Admin Setup

### For MongoDB Atlas:
```bash
node setup-admin.js
```
Follow the prompts to create your admin account.

### For In-Memory Mode:
Default admin is automatically created:
- **Username**: `admin`
- **Password**: `admin123`

## Access Points

- **Main Form**: `http://localhost:3000/`
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | Placeholder string |
| `PORT` | Server port | 3000 |

## File Structure

```
kmu-hostel-mentenance/
├── public/                 # Frontend files
│   ├── index.html         # Main form
│   ├── admin-login.html   # Admin login
│   ├── warden.html        # Admin dashboard
│   └── assets/            # Images, CSS, JS
├── uploads/               # Uploaded images
├── config/                # Configuration files
├── server.js              # Main server file
├── setup-admin.js         # Admin setup script
└── package.json           # Dependencies
```

## Security Notes

- ✅ **No hardcoded credentials** - Admin accounts are created dynamically
- ✅ **Password hashing** - All passwords are bcrypt hashed
- ✅ **Session management** - Secure session handling
- ✅ **Input validation** - Server-side validation

## Troubleshooting

### MongoDB Connection Issues
1. Check your connection string format
2. Ensure your IP is whitelisted in Atlas
3. Verify username/password in connection string

### Admin Login Issues
1. For Atlas: Run `node setup-admin.js`
2. For in-memory: Use default `admin`/`admin123`

### Port Already in Use
Change the port in `server.js`:
```javascript
const PORT = 3001; // or any available port
```

## Development

### Adding New Features
1. Update server routes in `server.js`
2. Modify frontend files in `public/`
3. Test both MongoDB and in-memory modes

### Database Schema
- **Reports**: Maintenance requests with status tracking
- **Admins**: User accounts for dashboard access

## License

This project is for KMU hostel maintenance management.

## Deployment

### Render Hosting (Recommended)

This application is ready for deployment on Render. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy Steps:**
1. Push your code to GitHub
2. Connect your repository to Render
3. Set environment variables in Render dashboard
4. Deploy automatically

**Required Environment Variables:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `NODE_ENV` - Set to `production`
- `SESSION_SECRET` - A secure session secret

**Render URL:** `https://your-app-name.onrender.com`

### Other Hosting Options

- **Heroku**: Similar to Render, supports Node.js
- **Vercel**: Good for static sites, limited for full-stack
- **Railway**: Alternative to Render
- **DigitalOcean**: VPS hosting with more control
