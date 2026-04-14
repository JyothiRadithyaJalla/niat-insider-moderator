import mongoose, { Schema } from 'mongoose';
import { JobType, JobStatus } from '../types/job.types.js';
const JobSchema = new Schema({
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    stipend: { type: String, required: true },
    openings: { type: Number, required: true, default: 1 },
    applyBy: { type: Date, required: true },
    type: {
        type: String,
        enum: Object.values(JobType),
        default: JobType.INTERNSHIP
    },
    status: {
        type: String,
        enum: Object.values(JobStatus),
        default: JobStatus.OPEN
    },
    campus: { type: String, required: true, index: true, trim: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    logo: { type: String },
}, { timestamps: true });
const Job = mongoose.model('Job', JobSchema);
export default Job;
//# sourceMappingURL=Job.model.js.map