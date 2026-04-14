import mongoose, { Document } from 'mongoose';
export interface IEventDocument extends Document {
    title: string;
    type: 'Upcoming' | 'Live' | 'Challenge' | 'Podcast';
    date: string;
    isLive: boolean;
    campus: string;
    authorId: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IEventDocument, {}, {}, {}, mongoose.Document<unknown, {}, IEventDocument, {}, mongoose.DefaultSchemaOptions> & IEventDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEventDocument>;
export default _default;
//# sourceMappingURL=Event.model.d.ts.map