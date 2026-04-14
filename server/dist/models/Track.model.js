import mongoose, { Schema } from 'mongoose';
const TrackSchema = new Schema({
    title: { type: String, required: true },
    learningStatus: { type: String, required: true },
    learningProgress: { type: Number, required: true, default: 0 },
    practiceStatus: { type: String, required: true },
    practiceProgress: { type: Number, required: true, default: 0 },
    gradient: { type: String, required: true },
    campus: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export default mongoose.model('Track', TrackSchema);
//# sourceMappingURL=Track.model.js.map