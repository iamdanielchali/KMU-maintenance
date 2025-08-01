const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 12; // Number of salt rounds for bcrypt

// Fallback in-memory storage
let useInMemory = false;
let reports = [];
let admins = [];
let nextTicketNumber = 1001;

// MongoDB Atlas Setup
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('📝 Please set the MONGODB_URI environment variable:');
    console.log('   Windows: set MONGODB_URI=your_connection_string');
    console.log('   Linux/Mac: export MONGODB_URI=your_connection_string');
    console.log('\n💡 Running in in-memory mode (data will be lost on restart)');
    useInMemory = true;
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('✅ MongoDB Atlas connected successfully');
            useInMemory = false;
        })
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            console.log('\n💡 Running in in-memory mode (data will be lost on restart)');
            useInMemory = true;
        });
}

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Report Schema
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

const Report = mongoose.model('Report', reportSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

console.log('KMU Maintenance System running at http://localhost:3000');
console.log('Admin Dashboard: http://localhost:3000/admin/dashboard');
console.log('Admin Login: http://localhost:3000/admin/login');

// Create a default admin for in-memory mode
if (useInMemory) {
    (async() => {
        try {
            await createAdmin('admin', 'admin123', 'System Administrator');
            console.log('📝 Default admin created for in-memory mode:');
            console.log('   Username: admin');
            console.log('   Password: admin123');
        } catch (error) {
            console.log('Default admin already exists or error creating admin');
        }
    })();
} else {
    console.log('📝 To create an admin account, run: node setup-admin.js');
}

// Authentication Middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }
    res.status(401).json({ error: 'Authentication required' });
}

// Bcrypt utility functions
async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Admin creation utility
async function createAdmin(username, password, name, role = 'admin') {
    try {
        const hashedPassword = await hashPassword(password);

        if (useInMemory) {
            const admin = {
                id: Date.now().toString(),
                username,
                password: hashedPassword,
                name,
                role,
                createdAt: new Date()
            };
            admins.push(admin);
            return admin;
        } else {
            const admin = new Admin({
                username,
                password: hashedPassword,
                name,
                role
            });
            await admin.save();
            return admin;
        }
    } catch (error) {
        throw error;
    }
}

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Authentication Routes
app.post('/api/admin/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        let admin;
        if (useInMemory) {
            admin = admins.find(a => a.username === username);
        } else {
            admin = await Admin.findOne({ username });
        }

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await comparePassword(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.adminId = useInMemory ? admin.id : admin._id;
        req.session.adminName = admin.name;
        req.session.adminRole = admin.role;

        res.json({
            success: true,
            message: 'Login successful',
            admin: { name: admin.name, role: admin.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

app.get('/api/admin/status', async(req, res) => {
    if (req.session && req.session.adminId) {
        try {
            let admin;
            if (useInMemory) {
                admin = admins.find(a => a.id === req.session.adminId);
            } else {
                admin = await Admin.findById(req.session.adminId);
            }

            if (admin) {
                res.json({
                    authenticated: true,
                    admin: { name: admin.name, role: admin.role }
                });
            } else {
                res.json({ authenticated: false });
            }
        } catch (err) {
            console.error('Error fetching admin status:', err);
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.json({ authenticated: false });
    }
});

// Create admin account (for initial setup - should be disabled in production)
app.post('/api/admin/create', async(req, res) => {
    try {
        const { username, password, name, role = 'admin' } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Username, password, and name are required' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin with this username already exists' });
        }

        const admin = await createAdmin(username, password, name, role);

        res.json({
            success: true,
            message: 'Admin account created successfully',
            admin: {
                id: admin._id,
                username: admin.username,
                name: admin.name,
                role: admin.role,
                createdAt: admin.createdAt
            }
        });
    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ error: 'Failed to create admin account' });
    }
});

// Submit Report
app.post('/api/report', upload.single('image'), async(req, res) => {
    try {
        const { hostel, room, issueType, description, contact } = req.body;
        const image = req.file ? req.file.filename : null;

        if (useInMemory) {
            const report = {
                id: Date.now().toString(),
                hostel,
                room,
                issueType,
                description,
                contact,
                image,
                ticketNumber: 'RPT' + nextTicketNumber.toString().padStart(4, '0'),
                status: 'Pending',
                comments: [],
                date: new Date()
            };
            reports.push(report);
            nextTicketNumber++;
            res.json({ success: true, ticket: report.ticketNumber });
        } else {
            const report = new Report({
                hostel,
                room,
                issueType,
                description,
                contact,
                image,
                ticketNumber: 'RPT' + Date.now().toString().slice(-6).toUpperCase(),
                status: 'Pending',
                comments: [],
                date: new Date()
            });
            await report.save();
            res.json({ success: true, ticket: report.ticketNumber });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Protected Routes
app.get('/api/reports', requireAuth, async(req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

app.patch('/api/reports/:id/status', requireAuth, async(req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'InProgress', 'Resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        report.status = status;
        await report.save();
        res.json({ success: true, report });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.patch('/api/reports/:id/ticket', requireAuth, async(req, res) => {
    try {
        const { ticketNumber } = req.body;
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        report.ticketNumber = ticketNumber;
        await report.save();
        res.json({ success: true, report });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/reports/:id', requireAuth, async(req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        if (report.image) {
            const imagePath = path.join(__dirname, 'uploads', report.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        await report.deleteOne();

        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/reports/export', requireAuth, async(req, res) => {
    try {
        const reports = await Report.find();
        const exportData = reports.map(report => ({
            TicketNumber: report.ticketNumber || 'N/A',
            Hostel: report.hostel,
            Room: report.room,
            IssueType: report.issueType,
            Description: report.description,
            Contact: report.contact,
            Status: report.status,
            Date: new Date(report.date).toLocaleString(),
            Image: report.image ? `/uploads/${report.image}` : 'N/A'
        }));

        res.json({ success: true, data: exportData });
    } catch (err) {
        res.status(500).json({ error: 'Failed to export reports' });
    }
});

// Route Handlers
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'warden.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`KMU Maintenance System running at http://localhost:${PORT}`);
    console.log(`Admin Dashboard: http://localhost:${PORT}/admin/dashboard`);
    console.log(`Admin Login: http://localhost:${PORT}/admin/login`);
    console.log('Note: No default admin created. Add admin manually to database.');
});