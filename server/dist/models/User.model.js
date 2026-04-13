import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../types/auth.types.js';
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.MODERATOR,
    },
    campus: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=User.model.js.map