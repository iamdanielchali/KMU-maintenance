const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB Atlas Setup
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('📝 Please set the MONGODB_URI environment variable:');
    console.log('   Windows: set MONGODB_URI=your_connection_string');
    console.log('   Linux/Mac: export MONGODB_URI=your_connection_string');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin(username, password, name, role = 'admin') {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = new Admin({
            username,
            password: hashedPassword,
            name,
            role
        });
        await admin.save();
        return admin;
    } catch (error) {
        throw error;
    }
}

async function setupAdmin() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('=== KMU Hostel Maintenance - Admin Setup ===\n');

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            console.log('Admin account already exists in the database.');
            console.log('If you need to create a new admin, please delete the existing one first.');
            rl.close();
            mongoose.connection.close();
            return;
        }

        // Get admin details from user
        const username = await new Promise(resolve => {
            rl.question('Enter admin username: ', resolve);
        });

        const password = await new Promise(resolve => {
            rl.question('Enter admin password: ', resolve);
        });

        const name = await new Promise(resolve => {
            rl.question('Enter admin full name: ', resolve);
        });

        if (!username || !password || !name) {
            console.log('All fields are required!');
            rl.close();
            mongoose.connection.close();
            return;
        }

        // Create admin
        const admin = await createAdmin(username, password, name);
        console.log('\n✅ Admin account created successfully!');
        console.log(`Username: ${admin.username}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Role: ${admin.role}`);
        console.log('\nYou can now login at: http://localhost:3000/admin/login');

    } catch (error) {
        console.error('Error creating admin:', error.message);
        if (error.code === 11000) {
            console.log('Username already exists. Please choose a different username.');
        }
    } finally {
        rl.close();
        mongoose.connection.close();
    }
}

setupAdmin();