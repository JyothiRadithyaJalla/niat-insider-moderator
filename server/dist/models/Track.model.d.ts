import mongoose, { Document } from 'mongoose';
export interface ITrackDocument extends Document {
    title: string;
    learningStatus: string;
    learningProgress: number;
    practiceStatus: string;
    practiceProgress: number;
    gradient: string;
    campus: string;
    authorId: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<ITrackDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITrackDocument, {}, mongoose.DefaultSchemaOptions> & ITrackDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITrackDocument>;
export default _default;
//# sourceMappingURL=Track.model.d.ts.map