# KMU Hostel Maintenance System

A modern, full-stack maintenance request system for KMU hostels with separated frontend and backend.

## 🏗️ Architecture

```
kmu-maintenance/
├── frontend/          # Next.js React Frontend
│   ├── app/          # Next.js App Router
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
├── backend/          # Express.js Backend API
│   ├── server.js     # Main server file
│   ├── uploads/      # File uploads
│   └── package.json  # Backend dependencies
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Your existing `.env` file with MongoDB connection

### 1. Setup Backend
```bash
cd backend

# Copy your existing .env file
cp ../.env .env

# Install dependencies
npm install

# Create uploads directory
mkdir uploads

# Start backend server
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend

# Copy environment file
cp env.example .env.local

# Install dependencies
npm install

# Start frontend server
npm run dev
```

### 3. Create Admin Account
```bash
cd backend
npm run setup-admin
```

## 📁 Project Structure

### Backend (`/backend`)
- **Express.js API** with MongoDB
- **File upload handling** with Multer
- **Session management** with Express Session
- **Excel export** functionality
- **CORS** configured for frontend

### Frontend (`/frontend`)
- **Next.js 14** with App Router
- **React 18** with hooks
- **Tailwind CSS** for styling
- **Form handling** with React Hook Form
- **API proxy** to backend

## 🔧 Environment Variables

### Backend (`.env`)
```bash
MONGODB_URI=mongodb+srv://your-connection-string
PORT=5000
SESSION_SECRET=your-session-secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (`.env.local`)
```bash
BACKEND_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-session-secret
NODE_ENV=development
```

## 🌐 API Endpoints

### Reports
- `POST /api/reports` - Submit maintenance request
- `GET /api/reports` - Get all reports (admin only)
- `PATCH /api/reports/:id/status` - Update status (admin only)
- `DELETE /api/reports/:id` - Delete report (admin only)
- `GET /api/reports/export` - Export to Excel (admin only)

### Admin
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/create` - Create admin account
- `POST /api/admin/logout` - Logout

### Health
- `GET /api/health` - Health check

## 🚀 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Next.js development server
```

### Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## 📱 Access Points

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`
- **Admin Login**: `http://localhost:3000/admin/login`

## 🔒 Security Features

- **CORS** protection between frontend/backend
- **Session-based** authentication
- **Password hashing** with bcrypt
- **File upload** validation
- **Input validation** on both ends

## 📦 Deployment

### Backend Deployment (Render/Railway/Heroku)
```bash
cd backend
# Set environment variables
# Deploy with your platform
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
# Set environment variables
# Deploy with your platform
```

### Environment Variables for Production

**Backend:**
```bash
MONGODB_URI=your_production_mongodb_uri
PORT=5000
SESSION_SECRET=your_production_secret
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**Frontend:**
```bash
BACKEND_URL=https://your-backend-domain.com
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=your_production_secret
NODE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend URL matches exactly

2. **Database Connection**
   - Verify `MONGODB_URI` in backend `.env`
   - Check MongoDB Atlas network access

3. **File Uploads**
   - Ensure `uploads/` directory exists in backend
   - Check file permissions

4. **API Proxy Issues**
   - Verify `BACKEND_URL` in frontend `.env.local`
   - Check if backend is running on correct port

### Development Tips

- Use browser dev tools to check API calls
- Monitor backend console for errors
- Check network tab for failed requests
- Use Postman to test API endpoints directly

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for KMU Hostel Management**
