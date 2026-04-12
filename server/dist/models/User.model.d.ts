import mongoose, { Document } from 'mongoose';
import { UserRole } from '../types/auth.types.js';
export interface IUserDocument extends Document {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    campus: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, mongoose.DefaultSchemaOptions> & IUserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUserDocument>;
export default User;
//# sourceMappingURL=User.model.d.ts.map