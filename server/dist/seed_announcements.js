import mongoose from 'mongoose';
import Announcement from './models/Announcement.model.js';
import { AnnouncementType } from './types/announcement.types.js';
import { env } from './config/env.config.js';
const seed = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Connected to DB');
        // Find a moderator to act as author
        const User = mongoose.model('User');
        const moderator = await User.findOne({ role: 'MODERATOR' });
        if (!moderator) {
            console.error('No moderator found to assign as author');
            process.exit(1);
        }
        const announcements = [
            {
                title: 'Odd Semester 2026 Results Published',
                content: 'The results for the Nov-Dec 2025 semester exams have been officially announced. Students can check their grade sheets on the portal.',
                type: AnnouncementType.ACADEMIC,
                pinned: true,
                campus: moderator.campus,
                authorId: moderator._id,
            },
            {
                title: 'New Podcast Episode: Career in 2026',
                content: 'Check out the latest episode of "Campus Buzz" where we discuss the impact of generative AI on job markets. Available on Spotify and NIAT Radio.',
                type: AnnouncementType.EVENT,
                pinned: false,
                campus: moderator.campus,
                authorId: moderator._id,
            },
            {
                title: 'B.Tech Mid-Semester Examination Schedule',
                content: 'Mid-semester exams for all B.Tech branches will commence from April 22nd. Detailed time sheets are available at the department notice boards.',
                type: AnnouncementType.ACADEMIC,
                pinned: true,
                campus: moderator.campus,
                authorId: moderator._id,
            },
            {
                title: 'Internal Assessment Marks Uploaded',
                content: 'Marks for the second internal assessment have been uploaded for all UG courses. Any discrepancies should be reported by Friday.',
                type: AnnouncementType.ACADEMIC,
                pinned: false,
                campus: moderator.campus,
                authorId: moderator._id,
            },
            {
                title: 'Holi Holiday Notice',
                content: 'The campus will remain closed on March 25th on account of Holi. Residential students are requested to follow hostel guidelines.',
                type: AnnouncementType.FACILITY,
                pinned: false,
                campus: moderator.campus,
                authorId: moderator._id,
            }
        ];
        await Announcement.insertMany(announcements);
        console.log('Seed successful!');
        process.exit(0);
    }
    catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=seed_announcements.js.map