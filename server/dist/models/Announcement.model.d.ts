import mongoose, { Document } from 'mongoose';
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
declare const Announcement: mongoose.Model<IAnnouncementDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncementDocument, {}, mongoose.DefaultSchemaOptions> & IAnnouncementDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAnnouncementDocument>;
export default Announcement;
//# sourceMappingURL=Announcement.model.d.ts.map