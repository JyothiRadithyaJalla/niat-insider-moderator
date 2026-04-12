"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const auth_types_js_1 = require("../types/auth.types.js");
/**
 * POST /api/auth/login
 * Authenticates user with email & password, returns JWT token.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Email and password are required.' });
            return;
        }
        const result = await (0, auth_service_js_1.loginUser)(email, password);
        res.status(auth_types_js_1.HttpStatus.OK).json({
            message: 'Login successful.',
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed.';
        res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message });
    }
};
exports.login = login;
/**
 * GET /api/auth/me
 * Returns the authenticated user's profile.
 */
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const user = await (0, auth_service_js_1.getUserProfile)(req.user.userId);
        if (!user) {
            res.status(auth_types_js_1.HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
            return;
        }
        res.status(auth_types_js_1.HttpStatus.OK).json({ user });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch profile.';
        res.status(500).json({ message });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map