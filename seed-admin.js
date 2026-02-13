// Seed Default Admin Account
// Run this once: node seed-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Default Admin Credentials
const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@justhike.com',
  password: 'admin123', // Change this in production!
  role: 'admin'
};

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });
    
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email:', DEFAULT_ADMIN.email);
      console.log('Password: admin123\n');
      
      // Update to ensure role is admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role\n');
      }
    } else {
      // Create new admin account
      console.log('Creating default admin account...');
      
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      
      const admin = new User({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
        role: DEFAULT_ADMIN.role
      });
      
      await admin.save();
      
      console.log('Admin account created successfully!\n');
    }

    console.log('========================== ==========================');
    console.log('DEFAULT ADMIN CREDENTIALS');
    console.log('========================== ==========================');
    console.log('Email:    admin@justhike.com');
    console.log('Password: admin123');
    console.log('Login:    http://localhost:3000/admin/login');
    console.log('========================== ==========================\n');
    console.log('IMPORTANT: Change this password in production!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit();
  }
}

// Run the seed function
seedAdmin();
