import mongoose, { Schema, Document } from 'mongoose';

export interface IEventDocument extends Document {
  title: string;
  type: 'Upcoming' | 'Live' | 'Challenge' | 'Podcast';
  date: string;
  isLive: boolean;
  campus: string;
  authorId: mongoose.Types.ObjectId;
}

const EventSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<IEventDocument>('Event', EventSchema);
