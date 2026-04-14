import mongoose, { Schema } from 'mongoose';
const EventSchema = new Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['Upcoming', 'Live', 'Challenge', 'Podcast'],
        required: true
    },
    date: { type: String, required: true },
    isLive: { type: Boolean, default: false },
    campus: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export default mongoose.model('Event', EventSchema);
//# sourceMappingURL=Event.model.js.map