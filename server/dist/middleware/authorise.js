"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campusScopeGuard = exports.authorise = void 0;
const auth_types_js_1 = require("../types/auth.types.js");
const Article_model_js_1 = __importDefault(require("../models/Article.model.js"));
/**
 * Role-based authorisation middleware.
 * Restricts access to users whose role is in the allowed list.
 */
const authorise = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(auth_types_js_1.HttpStatus.FORBIDDEN).json({ message: 'You do not have permission to access this resource.' });
            return;
        }
        next();
    };
};
exports.authorise = authorise;
/**
 * Campus scope guard middleware.
 * Ensures a moderator can only access resources from their own campus.
 * Specifically checks `article.campus === req.user.campus` for mutations.
 */
const campusScopeGuard = async (req, res, next) => {
    if (!req.user) {
        res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
        return;
    }
    // Admins can access all campuses
    if (req.user.role === auth_types_js_1.UserRole.ADMIN) {
        next();
        return;
    }
    // For POST requests, ensure the moderator is submitting for their own campus
    if (req.method === 'POST') {
        if (req.body.campus && req.body.campus !== req.user.campus) {
            res.status(auth_types_js_1.HttpStatus.FORBIDDEN).json({ message: 'You can only create articles for your own campus.' });
            return;
        }
    }
    // For GET (id), PUT, DELETE requests: enforce article.campus === req.user.campus
    const articleId = req.params['id'];
    if (articleId) {
        try {
            const article = await Article_model_js_1.default.findById(articleId);
            if (!article) {
                res.status(auth_types_js_1.HttpStatus.NOT_FOUND).json({ message: 'Article not found.' });
                return;
            }
            if (article.campus !== req.user.campus) {
                res.status(auth_types_js_1.HttpStatus.FORBIDDEN).json({ message: 'Access denied: wrong campus.' });
                return;
            }
        }
        catch (error) {
            res.status(auth_types_js_1.HttpStatus.NOT_FOUND).json({ message: 'Invalid Article ID' });
            return;
        }
    }
    next();
};
exports.campusScopeGuard = campusScopeGuard;
//# sourceMappingURL=authorise.js.map