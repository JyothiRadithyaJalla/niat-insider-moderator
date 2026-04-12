"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_js_1 = require("../config/env.config.js");
const auth_types_js_1 = require("../types/auth.types.js");
/**
 * JWT authentication middleware.
 * Extracts & verifies the Bearer token from the Authorization header.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Access denied. No token provided.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Access denied. Malformed token.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_config_js_1.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map