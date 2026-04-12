import mongoose, { Schema, Document } from 'mongoose';
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

const JobSchema: Schema<IJobDocument> = new Schema(
  {
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
  },
  { timestamps: true }
);

const Job = mongoose.model<IJobDocument>('Job', JobSchema);
export default Job;
