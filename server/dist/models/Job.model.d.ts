import mongoose, { Document } from 'mongoose';
import { JobType, JobStatus } from '../types/job.types.js';
export interface IJobDocument extends Document {
    title: string;
    company: string;
    location: string;
    stipend: string;
    openings: number;
    applyBy: Date;
    type: JobType;
    status: JobStatus;
    campus: string;
    authorId: mongoose.Types.ObjectId;
    logo?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Job: mongoose.Model<IJobDocument, {}, {}, {}, mongoose.Document<unknown, {}, IJobDocument, {}, mongoose.DefaultSchemaOptions> & IJobDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJobDocument>;
export default Job;
//# sourceMappingURL=Job.model.d.ts.map