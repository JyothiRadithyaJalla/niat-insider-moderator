import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.model.js';
import Article from '../models/Article.model.js';
import Schedule from '../models/Schedule.model.js';
import Track from '../models/Track.model.js';
import Event from '../models/Event.model.js';
import { UserRole } from '../types/auth.types.js';
import { ArticleStatus } from '../types/article.types.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
const envPaths = [
  path.resolve(__dirname, '../../.env.development'),
  path.resolve(__dirname, '../../.env.test'),
  path.resolve(__dirname, '../../.env')
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath });
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/niat_insider';

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
    await Schedule.deleteMany({});
    await Track.deleteMany({});
    await Event.deleteMany({});
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
          title: `Getting Started with Full-Stack Development at ${mod.campus}`,
          body: `Welcome to the official portal. This comprehensive guide will take you through the essential tools and technologies used in our curriculum. Discover how to set up your environment and access internal repositories.`,
          category: 'Technical',
          campus: mod.campus,
          authorId: mod._id,
          status: ArticleStatus.PUBLISHED,
        },
        {
          title: `Upcoming Soft Skills Workshop: Mastering Communication`,
          body: `Join us next Friday for a session on effective professional communication. Learn how to handle client interviews and present your technical ideas with clarity.`,
          category: 'Workshop',
          campus: mod.campus,
          authorId: mod._id,
          status: ArticleStatus.PUBLISHED,
        },
        {
          title: `Latest Campus Placement Success Stories`,
          body: `We are proud to announce that over 40 students from ${mod.campus} have been placed in Tier-1 companies this month alone. Read about their preparation strategies here.`,
          category: 'Placements',
          campus: mod.campus,
          authorId: mod._id,
          status: ArticleStatus.PUBLISHED,
        },
        {
          title: `Guide to NIAT Internal Hackathon 2024`,
          body: `Prepare your teams! The annual hackathon is coming. This draft outline explains the project themes, technical requirements, and evaluation criteria for this year's event.`,
          category: 'Contest',
          campus: mod.campus,
          authorId: mod._id,
          status: ArticleStatus.DRAFT,
        }
      );
    }

    await Article.insertMany(articlesToCreate);
    console.log(`Seeded ${articlesToCreate.length} articles successfully.`);

    // Seed Dashboard Items
    const schedulesToCreate: any[] = [];
    const tracksToCreate: any[] = [];
    const eventsToCreate: any[] = [];

    const defaultGradients = [
      'linear-gradient(90deg, #bce4f4, #4b48e5)',
      'linear-gradient(90deg, #67e8f9, #6366f1)',
      'linear-gradient(90deg, #bae6fd, #4f46e5)',
      'linear-gradient(90deg, #67e8f9, #818cf8)',
      'linear-gradient(90deg, #bae6fd, #6366f1)'
    ];

    for (const mod of insertedModerators) {
      // Schedules
      schedulesToCreate.push(
        { title: 'Practice Session', type: 'practice', time: '08:30 AM - 09:30 AM', campus: mod.campus, authorId: mod._id },
        { title: 'DSA/Practice Session', type: 'lecture', time: '09:30 AM - 10:30 AM', campus: mod.campus, authorId: mod._id },
        { title: 'Advance Aptitude/Design', type: 'lecture', time: '10:30 AM - 11:30 AM', campus: mod.campus, authorId: mod._id }
      );

      // Tracks
      tracksToCreate.push(
        { title: 'Introduction sessions', learningStatus: 'Up to Date', learningProgress: 100, practiceStatus: '9 Left', practiceProgress: 80, gradient: defaultGradients[0], campus: mod.campus, authorId: mod._id },
        { title: 'Frontend Development', learningStatus: 'Up to Date', learningProgress: 100, practiceStatus: '1 Left', practiceProgress: 90, gradient: defaultGradients[1], campus: mod.campus, authorId: mod._id },
        { title: 'Tech Foundations', learningStatus: '3 Left', learningProgress: 65, practiceStatus: '4 Left', practiceProgress: 50, gradient: defaultGradients[2], campus: mod.campus, authorId: mod._id }
      );

      // Events
      eventsToCreate.push(
        { title: 'Tech Talk: Cloud Computing', type: 'Upcoming', date: 'Apr 15', isLive: false, campus: mod.campus, authorId: mod._id },
        { title: 'Code Sprint Challenge', type: 'Challenge', date: 'Apr 18', isLive: false, campus: mod.campus, authorId: mod._id },
        { title: 'Campus Radio Show', type: 'Podcast', date: 'Today', isLive: true, campus: mod.campus, authorId: mod._id }
      );
    }

    await Schedule.insertMany(schedulesToCreate);
    await Track.insertMany(tracksToCreate);
    await Event.insertMany(eventsToCreate);

    console.log('Seeded Dashboard items successfully.');
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
