"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_js_1 = __importDefault(require("../models/User.model.js"));
const env_config_js_1 = require("../config/env.config.js");
/**
 * Authenticates a user by email + password and returns a JWT.
 */
const loginUser = async (email, password) => {
    const user = await User_model_js_1.default.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password.');
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }
    const tokenPayload = {
        userId: String(user._id),
        role: user.role,
        campus: user.campus,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, env_config_js_1.env.JWT_SECRET, { expiresIn: env_config_js_1.env.JWT_EXPIRES_IN });
    return {
        token,
        user: {
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
            campus: user.campus,
        },
    };
};
exports.loginUser = loginUser;
/**
 * Retrieves user profile by ID (excludes password).
 */
const getUserProfile = async (userId) => {
    return User_model_js_1.default.findById(userId).select('-password');
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=auth.service.js.map