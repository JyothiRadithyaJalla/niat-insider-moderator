import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduleDocument extends Document {
  title: string;
  type: 'lecture' | 'practice' | 'lab' | 'seminar';
  time: string;
  campus: string;
  authorId: mongoose.Types.ObjectId;
}

const ScheduleSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['lecture', 'practice', 'lab', 'seminar'], 
      required: true 
    },
    time: { type: String, required: true },
    campus: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IScheduleDocument>('Schedule', ScheduleSchema);
