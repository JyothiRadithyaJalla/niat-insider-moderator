import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.model.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
const envPaths = [
  path.resolve(__dirname, '../.env.development'),
  path.resolve(__dirname, '../.env.test'),
  path.resolve(__dirname, '../.env')
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/niat_insider';

const testAuth = async () => {
  try {
    console.log('Connecting to:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    
    const email = 'admin@kkh.edu';
    const password = 'password123';
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`USER NOT FOUND: ${email}`);
      process.exit(0);
    }
    
    console.log(`Found user: ${user.email}`);
    console.log(`Hashed password in DB: ${user.password}`);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Does 'password123' match? ${isMatch}`);
    
    // Check for role/campus just in case
    console.log(`Role: ${user.role}`);
    console.log(`Campus: ${user.campus}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing auth:', error);
    process.exit(1);
  }
};

testAuth();
