"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeArticle = exports.editArticle = exports.addArticle = exports.getArticle = exports.getArticles = void 0;
const article_service_js_1 = require("../services/article.service.js");
const auth_types_js_1 = require("../types/auth.types.js");
/**
 * GET /api/articles
 * Fetches articles scoped to the moderator's campus with pagination.
 */
const getArticles = async (req, res) => {
    try {
        if (!req.user) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const page = parseInt(req.query['page'], 10) || 1;
        const limit = parseInt(req.query['limit'], 10) || 10;
        const category = req.query['category'];
        const result = await (0, article_service_js_1.getArticlesByCampus)(req.user.campus, page, limit, category);
        res.status(auth_types_js_1.HttpStatus.OK).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch articles.';
        res.status(500).json({ message });
    }
};
exports.getArticles = getArticles;
/**
 * GET /api/articles/:id
 * Fetches a single article by ID, scoped to the moderator's campus.
 */
const getArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const article = await (0, article_service_js_1.getArticleById)(req.params['id'], req.user.campus);
        if (!article) {
            res.status(auth_types_js_1.HttpStatus.NOT_FOUND).json({ message: 'Article not found.' });
            return;
        }
        res.status(auth_types_js_1.HttpStatus.OK).json({ article });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch article.';
        res.status(500).json({ message });
    }
};
exports.getArticle = getArticle;
/**
 * POST /api/articles
 * Creates a new article under the moderator's campus.
 */
const addArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const { title, body, category, status } = req.body;
        if (!title || !body || !category) {
            res.status(400).json({ message: 'Title, body, and category are required.' });
            return;
        }
        const article = await (0, article_service_js_1.createArticle)({
            title,
            body,
            category,
            campus: req.user.campus,
            authorId: req.user.userId,
            status,
        });
        res.status(auth_types_js_1.HttpStatus.CREATED).json({ message: 'Article created.', article });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create article.';
        res.status(500).json({ message });
    }
};
exports.addArticle = addArticle;
/**
 * PUT /api/articles/:id
 * Updates an article (campus-scoped).
 */
const editArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const { title, body, category, status } = req.body;
        const article = await (0, article_service_js_1.updateArticle)(req.params['id'], req.user.campus, {
            title,
            body,
            category,
            status,
        });
        if (!article) {
            res.status(auth_types_js_1.HttpStatus.NOT_FOUND).json({ message: 'Article not found or not in your campus.' });
            return;
        }
        res.status(auth_types_js_1.HttpStatus.OK).json({ message: 'Article updated.', article });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update article.';
        res.status(500).json({ message });
    }
};
exports.editArticle = editArticle;
/**
 * DELETE /api/articles/:id
 * Deletes an article (campus-scoped).
 */
const removeArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(auth_types_js_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const article = await (0, article_service_js_1.deleteArticle)(req.params['id'], req.user.campus);
        if (!article) {
            res.status(auth_types_js_1.HttpStatus.NOT_FOUND).json({ message: 'Article not found or not in your campus.' });
            return;
        }
        res.status(auth_types_js_1.HttpStatus.OK).json({ message: 'Article deleted successfully.' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete article.';
        res.status(500).json({ message });
    }
};
exports.removeArticle = removeArticle;
//# sourceMappingURL=article.controller.js.map