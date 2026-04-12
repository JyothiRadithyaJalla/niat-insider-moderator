const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.development') });

const MONGO_URI = process.env.MONGO_URI;

const AnnouncementSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: String,
  pinned: Boolean,
  campus: String,
  authorId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

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

    // Use at least the first moderator's details to seed
    const targetModerator = moderators[0];
    
    // Clear existing for this specific moderator's campus to avoid duplicates if run multiple times
    await Announcement.deleteMany({ campus: targetModerator.campus });

    const announcements = [
      {
        title: 'Odd Semester 2026 Results Published',
        content: 'The results for the Nov-Dec 2025 semester exams have been officially announced. Students can check their grade sheets on the portal.',
        type: 'Academic',
        pinned: true,
        campus: targetModerator.campus,
        authorId: targetModerator._id,
      },
      {
        title: 'New Podcast Episode: Career in 2026',
        content: 'Check out the latest episode of "Campus Buzz" where we discuss the impact of generative AI on job markets.',
        type: 'Event',
        pinned: false,
        campus: targetModerator.campus,
        authorId: targetModerator._id,
      },
      {
        title: 'B.Tech Mid-Semester Examination Schedule',
        content: 'Mid-semester exams for all B.Tech branches will commence from April 22nd. Detailed time sheets are available.',
        type: 'Academic',
        pinned: true,
        campus: targetModerator.campus,
        authorId: targetModerator._id,
      },
      {
        title: 'Internal Assessment Marks Uploaded',
        content: 'Marks for the second internal assessment have been uploaded for all UG courses.',
        type: 'Academic',
        pinned: false,
        campus: targetModerator.campus,
        authorId: targetModerator._id,
      },
      {
        title: 'Holi Holiday Notice',
        content: 'The campus will remain closed on March 25th on account of Holi.',
        type: 'Facility',
        pinned: false,
        campus: targetModerator.campus,
        authorId: targetModerator._id,
      }
    ];

    // Seed for ALL unique campuses found in moderators list so no matter which account is used, data appears
    const uniqueCampuses = [...new Set(moderators.map(m => m.campus))];
    console.log(`Seeding for ${uniqueCampuses.length} campuses:`, uniqueCampuses);

    const fullSeedData = [];
    for (const campus of uniqueCampuses) {
      const mod = moderators.find(m => m.campus === campus);
      announcements.forEach(a => {
        fullSeedData.push({ ...a, campus, authorId: mod._id });
      });
    }

    // Clear all first to be clean
    await Announcement.deleteMany({});
    await Announcement.insertMany(fullSeedData);

    console.log('Seed successful for all campuses!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
