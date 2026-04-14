import mongoose, { Schema } from 'mongoose';
import { AnnouncementType } from '../types/announcement.types.js';
const AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(AnnouncementType),
        required: true,
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    campus: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export default Announcement;
//# sourceMappingURL=Announcement.model.js.map