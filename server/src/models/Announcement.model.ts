import mongoose, { Schema, Document } from 'mongoose';
import { AnnouncementType } from '../types/announcement.types.js';

export interface IAnnouncementDocument extends Document {
  title: string;
  content: string;
  type: AnnouncementType;
  pinned: boolean;
  campus: string;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema<IAnnouncementDocument> = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model<IAnnouncementDocument>('Announcement', AnnouncementSchema);
export default Announcement;
