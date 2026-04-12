const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.development') });

const MONGO_URI = process.env.MONGO_URI;

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  stipend: String,
  openings: Number,
  applyBy: Date,
  type: String,
  status: String,
  campus: String,
  authorId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

const UserSchema = new mongoose.Schema({
  role: String,
  campus: String
});
const User = mongoose.model('User', UserSchema);

const seed = async () => {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI not found');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Atlas DB');

    const moderators = await User.find({ role: 'MODERATOR' });
    if (moderators.length === 0) {
      console.error('No moderators found');
      process.exit(1);
    }

    const uniqueCampuses = [...new Set(moderators.map(m => m.campus))];
    
    const jobs = [
      {
        title: 'Full Stack Development',
        company: 'Finflock Systems Pvt Ltd',
        location: 'Work From Home',
        stipend: '₹12K - ₹20K/month',
        openings: 3,
        applyBy: new Date('2026-04-10T12:35:00'),
        type: 'Internship',
        status: 'Open'
      },
      {
        title: 'MERN Intern',
        company: '2xCabs',
        location: 'Work From Home',
        stipend: '₹10K - ₹15K/month',
        openings: 1,
        applyBy: new Date('2026-04-09T18:00:00'),
        type: 'Internship',
        status: 'Open'
      },
      {
        title: 'Python Intern',
        company: 'Nxtwave',
        location: 'Hyderabad',
        stipend: 'Up to ₹15K/month',
        openings: 3,
        applyBy: new Date('2026-04-09T18:00:00'),
        type: 'Internship',
        status: 'Hiring Done'
      },
      {
        title: 'React Native Developer',
        company: 'TechySoft',
        location: 'Remote',
        stipend: '₹15K - ₹25K/month',
        openings: 2,
        applyBy: new Date('2026-04-15T12:00:00'),
        type: 'Internship',
        status: 'Open'
      },
      {
        title: 'Machine Learning Intern',
        company: 'AI Labs',
        location: 'Bangalore',
        stipend: '₹20K/month',
        openings: 1,
        applyBy: new Date('2026-04-20T10:00:00'),
        type: 'Internship',
        status: 'Open'
      },
      {
        title: 'UI/UX Designer',
        company: 'Creative Pixels',
        location: 'Hyderabad',
        stipend: '₹10K - ₹18K/month',
        openings: 4,
        applyBy: new Date('2026-04-12T18:00:00'),
        type: 'Internship',
        status: 'Open'
      },
      {
        title: 'DevOps Engineer',
        company: 'CloudScale',
        location: 'Work From Home',
        stipend: '₹25K - ₹35K/month',
        openings: 2,
        applyBy: new Date('2026-04-18T00:00:00'),
        type: 'Internship',
        status: 'Open'
      },
      {
        title: 'Golang Backend Intern',
        company: 'HighScale Systems',
        location: 'Pune',
        stipend: '₹18K/month',
        openings: 1,
        applyBy: new Date('2026-04-25T11:00:00'),
        type: 'Internship',
        status: 'Open'
      }
    ];

    const fullSeedData = [];
    for (const campus of uniqueCampuses) {
      const mod = moderators.find(m => m.campus === campus);
      jobs.forEach(j => {
        fullSeedData.push({ ...j, campus, authorId: mod._id });
      });
    }

    await Job.deleteMany({});
    await Job.insertMany(fullSeedData);

    console.log(`Seed successful for ${uniqueCampuses.length} campuses with ${jobs.length} roles each!`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
