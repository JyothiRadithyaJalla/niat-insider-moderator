import mongoose, { Document } from 'mongoose';
export interface IScheduleDocument extends Document {
    title: string;
    type: 'lecture' | 'practice' | 'lab' | 'seminar';
    time: string;
    campus: string;
    authorId: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IScheduleDocument, {}, {}, {}, mongoose.Document<unknown, {}, IScheduleDocument, {}, mongoose.DefaultSchemaOptions> & IScheduleDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IScheduleDocument>;
export default _default;
//# sourceMappingURL=Schedule.model.d.ts.map