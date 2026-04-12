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

const campuses = [
  { name: 'Sanjay Ghodawat University', email: 'admin@sgu.edu', abbreviation: 'SGU', password: 'password123' },
  { name: 'Noida International University', email: 'admin@niu.edu', abbreviation: 'NIU', password: 'password123' },
  { name: 'Chaitanya Deemed to be University', email: 'admin@chaitanya.edu', abbreviation: 'Chaitanya', password: 'password123' },
  { name: 'Nadimpalli Satyanarayana Raju Institute of Technology', email: 'admin@nsrit.edu', abbreviation: 'NSRIT', password: 'password123' },
  { name: 'Ajeenkya DY Patil University', email: 'admin@adypu.edu', abbreviation: 'ADYPU', password: 'password123' },
  { name: 'NRI University', email: 'admin@nri.edu', abbreviation: 'NRI', password: 'password123' },
  { name: 'Kapil Kavuri Hub', email: 'admin@kkh.edu', abbreviation: 'KKH', password: 'password123' },
  { name: 'Yenepoya University', email: 'admin@yenepoya.edu', abbreviation: 'Yenepoya', password: 'password123' },
  { name: 'Malla Reddy Vishwavidyapeeth', email: 'admin@mrv.edu', abbreviation: 'MRV', password: 'password123' },
  { name: 'Vivekananda Global University', email: 'admin@vgu.edu', abbreviation: 'VGU', password: 'password123' },
  { name: 'Chalapathi Institute of Engineering and Technology', email: 'admin@ciet.edu', abbreviation: 'CIET', password: 'password123' },
  { name: 'AMET University', email: 'admin@amet.edu', abbreviation: 'AMET', password: 'password123' },
  { name: 'Annamacharya University', email: 'admin@annamacharya.edu', abbreviation: 'Annamacharya', password: 'password123' },
  { name: 'B. S. Abdur Rahman Crescent Institute of Science & Technology', email: 'admin@crescent.edu', abbreviation: 'Crescent', password: 'password123' },
  { name: 'S-VYASA University School of Advanced Studies', email: 'admin@svyasa.edu', abbreviation: 'S-VYASA', password: 'password123' },
];


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
    const moderatorsToCreate = await Promise.all(campuses.map(async campus => ({
      email: campus.email,
      password: await bcrypt.hash(campus.password, salt),
      name: `${campus.abbreviation} Moderator`,
      role: UserRole.MODERATOR,
      campus: campus.name,
    })));

    const insertedModerators = await User.insertMany(moderatorsToCreate);
    console.log(`Seeded ${insertedModerators.length} moderators successfully.`);


    // Seed Articles
    const articlesToCreate = [];
    
    for (const mod of insertedModerators) {
      articlesToCreate.push(
        {
          title: `${mod.campus} - Welcome Guide`,
          body: `Welcome to the official portal for ${mod.campus}. Here you will find all updates related to our curriculum, upcoming events, and general guidelines.`,
          category: 'Guide',
          campus: mod.campus,
          authorId: mod._id,
          status: ArticleStatus.PUBLISHED,
        },
        {
          title: `Important Semester Dates - ${mod.name}`,
          body: `Please mark your calendars for the upcoming mid-sem evaluations and hackathons hosted at ${mod.campus}.`,
          category: 'Event',
          campus: mod.campus,
          authorId: mod._id,
          status: ArticleStatus.DRAFT,
        }
      );
    }

    await Article.insertMany(articlesToCreate);
    console.log(`Seeded ${articlesToCreate.length} articles successfully.`);
    console.log('');
    console.log('Seed process complete! You can now login using the credentials listed above.');
    campuses.forEach(c => console.log(`- ${c.email} | Password: ${c.password} (${c.name})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
