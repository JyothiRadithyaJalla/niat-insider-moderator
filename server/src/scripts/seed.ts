import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.model.js';
import Article from '../models/Article.model.js';
import { UserRole } from '../types/auth.types.js';
import { ArticleStatus } from '../types/article.types.js';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/niat-moderator';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Article.deleteMany({});
    console.log('Cleared existing data.');

    // Seed Moderators
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const moderator1 = await User.create({
      email: 'mod1@niat.edu',
      password: hashedPassword,
      name: 'John Moderator',
      role: UserRole.MODERATOR,
      campus: 'North Campus',
    });

    const moderator2 = await User.create({
      email: 'mod2@niat.edu',
      password: hashedPassword,
      name: 'Jane Moderator',
      role: UserRole.MODERATOR,
      campus: 'South Campus',
    });

    console.log('Seeded moderators successfully.');

    // Seed Articles
    await Article.create([
      {
        title: 'North Campus Welcome Guide',
        body: 'Welcome to the North Campus! Here is what you need to know...',
        category: 'Guide',
        campus: 'North Campus',
        authorId: moderator1._id,
        status: ArticleStatus.PUBLISHED,
      },
      {
        title: 'Upcoming Tech Symposium - North Campus',
        body: 'Join us for the annual tech symposium. Register early.',
        category: 'Event',
        campus: 'North Campus',
        authorId: moderator1._id,
        status: ArticleStatus.DRAFT,
      },
      {
        title: 'South Campus Library Hours Extended',
        body: 'The library will now be open 24/7 during finals week.',
        category: 'Announcement',
        campus: 'South Campus',
        authorId: moderator2._id,
        status: ArticleStatus.PUBLISHED,
      },
    ]);

    console.log('Seeded articles successfully.');
    console.log('Seed process complete! You can now login with:');
    console.log('Email: mod1@niat.edu / Password: password123 (North Campus)');
    console.log('Email: mod2@niat.edu / Password: password123 (South Campus)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
