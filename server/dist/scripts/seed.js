"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const User_model_js_1 = __importDefault(require("../models/User.model.js"));
const Article_model_js_1 = __importDefault(require("../models/Article.model.js"));
const Schedule_model_js_1 = __importDefault(require("../models/Schedule.model.js"));
const Track_model_js_1 = __importDefault(require("../models/Track.model.js"));
const Event_model_js_1 = __importDefault(require("../models/Event.model.js"));
const auth_types_js_1 = require("../types/auth.types.js");
const article_types_js_1 = require("../types/article.types.js");
// Load env
// Load env
const envPaths = [
    path_1.default.resolve(__dirname, '../../.env.development'),
    path_1.default.resolve(__dirname, '../../.env.test'),
    path_1.default.resolve(__dirname, '../../.env')
];
for (const envPath of envPaths) {
    dotenv_1.default.config({ path: envPath });
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
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');
        // Clear existing data
        await User_model_js_1.default.deleteMany({});
        await Article_model_js_1.default.deleteMany({});
        await Schedule_model_js_1.default.deleteMany({});
        await Track_model_js_1.default.deleteMany({});
        await Event_model_js_1.default.deleteMany({});
        console.log('Cleared existing data.');
        // Seed Moderators
        const salt = await bcryptjs_1.default.genSalt(10);
        const moderatorsToCreate = await Promise.all(campuses.map(async (campus) => ({
            email: campus.email,
            password: await bcryptjs_1.default.hash(campus.password, salt),
            name: `${campus.abbreviation} Moderator`,
            role: auth_types_js_1.UserRole.MODERATOR,
            campus: campus.name,
        })));
        const insertedModerators = await User_model_js_1.default.insertMany(moderatorsToCreate);
        console.log(`Seeded ${insertedModerators.length} moderators successfully.`);
        // Seed Articles
        const articlesToCreate = [];
        for (const mod of insertedModerators) {
            articlesToCreate.push({
                title: `${mod.campus} - Welcome Guide`,
                body: `Welcome to the official portal for ${mod.campus}. Here you will find all updates related to our curriculum, upcoming events, and general guidelines.`,
                category: 'Guide',
                campus: mod.campus,
                authorId: mod._id,
                status: article_types_js_1.ArticleStatus.PUBLISHED,
            }, {
                title: `Important Semester Dates - ${mod.name}`,
                body: `Please mark your calendars for the upcoming mid-sem evaluations and hackathons hosted at ${mod.campus}.`,
                category: 'Event',
                campus: mod.campus,
                authorId: mod._id,
                status: article_types_js_1.ArticleStatus.DRAFT,
            });
        }
        await Article_model_js_1.default.insertMany(articlesToCreate);
        console.log(`Seeded ${articlesToCreate.length} articles successfully.`);
        // Seed Dashboard Items
        const schedulesToCreate = [];
        const tracksToCreate = [];
        const eventsToCreate = [];
        const defaultGradients = [
            'linear-gradient(90deg, #bce4f4, #4b48e5)',
            'linear-gradient(90deg, #67e8f9, #6366f1)',
            'linear-gradient(90deg, #bae6fd, #4f46e5)',
            'linear-gradient(90deg, #67e8f9, #818cf8)',
            'linear-gradient(90deg, #bae6fd, #6366f1)'
        ];
        for (const mod of insertedModerators) {
            // Schedules
            schedulesToCreate.push({ title: 'Practice Session', type: 'practice', time: '08:30 AM - 09:30 AM', campus: mod.campus, authorId: mod._id }, { title: 'DSA/Practice Session', type: 'lecture', time: '09:30 AM - 10:30 AM', campus: mod.campus, authorId: mod._id }, { title: 'Advance Aptitude/Design', type: 'lecture', time: '10:30 AM - 11:30 AM', campus: mod.campus, authorId: mod._id });
            // Tracks
            tracksToCreate.push({ title: 'Introduction sessions', learningStatus: 'Up to Date', learningProgress: 100, practiceStatus: '9 Left', practiceProgress: 80, gradient: defaultGradients[0], campus: mod.campus, authorId: mod._id }, { title: 'Frontend Development', learningStatus: 'Up to Date', learningProgress: 100, practiceStatus: '1 Left', practiceProgress: 90, gradient: defaultGradients[1], campus: mod.campus, authorId: mod._id }, { title: 'Tech Foundations', learningStatus: '3 Left', learningProgress: 65, practiceStatus: '4 Left', practiceProgress: 50, gradient: defaultGradients[2], campus: mod.campus, authorId: mod._id });
            // Events
            eventsToCreate.push({ title: 'Tech Talk: Cloud Computing', type: 'Upcoming', date: 'Apr 15', isLive: false, campus: mod.campus, authorId: mod._id }, { title: 'Code Sprint Challenge', type: 'Challenge', date: 'Apr 18', isLive: false, campus: mod.campus, authorId: mod._id }, { title: 'Campus Radio Show', type: 'Podcast', date: 'Today', isLive: true, campus: mod.campus, authorId: mod._id });
        }
        await Schedule_model_js_1.default.insertMany(schedulesToCreate);
        await Track_model_js_1.default.insertMany(tracksToCreate);
        await Event_model_js_1.default.insertMany(eventsToCreate);
        console.log('Seeded Dashboard items successfully.');
        console.log('');
        console.log('Seed process complete! You can now login using the credentials listed above.');
        campuses.forEach(c => console.log(`- ${c.email} | Password: ${c.password} (${c.name})`));
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seed.js.map