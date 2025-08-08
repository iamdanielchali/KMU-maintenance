import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const SALT_ROUNDS = 12;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// Models
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

const reportSchema = new mongoose.Schema({
    hostel: String,
    room: String,
    issueType: String,
    description: String,
    contact: String,
    image: String,
    ticketNumber: String,
    status: { type: String, default: 'Pending' },
    comments: [String],
    date: { type: Date, default: Date.now }
});

// Generate ticket number before saving
reportSchema.pre('save', async function(next) {
    if (!this.ticketNumber) {
        const count = await mongoose.model('Report').countDocuments();
        this.ticketNumber = `KMU-${String(count + 1001).padStart(4, '0')}`;
    }
    next();
});

const Report = mongoose.model('Report', reportSchema);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'kmu-hostel-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.adminId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Utility functions
async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// API Routes

// Admin Routes
app.post('/api/admin/login', async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.adminId = admin._id;
        req.session.adminName = admin.name;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: admin._id,
                username: admin.username,
                name: admin.name,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/admin/create', async(req, res) => {
    try {
        const { username, password, name, role = 'admin' } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Username, password, and name are required' });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin with this username already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const admin = new Admin({
            username,
            password: hashedPassword,
            name,
            role
        });

        await admin.save();

        res.json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                username: admin.username,
                name: admin.name,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: 'Failed to create admin' });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

// Report Routes
app.post('/api/reports', upload.single('image'), async(req, res) => {
    try {
        const { hostel, room, issueType, description, contact } = req.body;

        if (!hostel || !room || !issueType || !description || !contact) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const report = new Report({
            hostel,
            room,
            issueType,
            description,
            contact,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        await report.save();

        res.json({
            success: true,
            ticketNumber: report.ticketNumber,
            message: 'Maintenance request submitted successfully'
        });

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Failed to submit maintenance request' });
    }
});

app.get('/api/reports', requireAuth, async(req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        const reports = await Report.find(query).sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

app.patch('/api/reports/:id/status', requireAuth, async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'InProgress', 'Resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        report.status = status;
        await report.save();

        res.json({ success: true, report });
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/reports/:id', requireAuth, async(req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Delete associated image if it exists
        if (report.image) {
            const imagePath = path.join(__dirname, report.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await report.deleteOne();

        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/reports/export', requireAuth, async(req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 });

        const exportData = reports.map(report => ({
            'Ticket Number': report.ticketNumber || 'N/A',
            'Hostel': report.hostel,
            'Room': report.room,
            'Issue Type': report.issueType,
            'Description': report.description,
            'Contact': report.contact,
            'Status': report.status,
            'Date': new Date(report.date).toLocaleString(),
            'Image': report.image ? `${req.protocol}://${req.get('host')}${report.image}` : 'N/A'
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Maintenance Reports');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="maintenance-reports-${new Date().toISOString().split('T')[0]}.xlsx"`);
        res.send(buffer);

    } catch (error) {
        console.error('Error exporting reports:', error);
        res.status(500).json({ error: 'Failed to export reports' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
});