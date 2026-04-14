import mongoose, { Schema } from 'mongoose';
const ScheduleSchema = new Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['lecture', 'practice', 'lab', 'seminar'],
        required: true
    },
    time: { type: String, required: true },
    campus: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export default mongoose.model('Schedule', ScheduleSchema);
//# sourceMappingURL=Schedule.model.js.map