import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
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

const checkUsers = async () => {
  try {
    console.log('Connecting to:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    const count = await User.countDocuments({});
    console.log(`Total users in database: ${count}`);
    
    if (count > 0) {
      const users = await User.find({}).limit(5);
      console.log('Sample users:');
      users.forEach(u => console.log(`- ${u.email}`));
    } else {
      console.log('NO USERS FOUND IN DATABASE');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUsers();
