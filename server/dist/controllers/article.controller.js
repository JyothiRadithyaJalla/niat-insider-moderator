import { getArticlesByCampus, getArticleById, createArticle, updateArticle, deleteArticle, } from '../services/article.service.js';
import { HttpStatus } from '../types/auth.types.js';
/**
 * GET /api/articles
 * Fetches articles scoped to the moderator's campus with pagination.
 */
export const getArticles = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const page = parseInt(req.query['page'], 10) || 1;
        const limit = parseInt(req.query['limit'], 10) || 10;
        const category = req.query['category'];
        const result = await getArticlesByCampus(req.user.campus, page, limit, category);
        res.status(HttpStatus.OK).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch articles.';
        res.status(500).json({ message });
    }
};
/**
 * GET /api/articles/:id
 * Fetches a single article by ID, scoped to the moderator's campus.
 */
export const getArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const article = await getArticleById(req.params['id'], req.user.campus);
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Article not found.' });
            return;
        }
        res.status(HttpStatus.OK).json({ article });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch article.';
        res.status(500).json({ message });
    }
};
/**
 * POST /api/articles
 * Creates a new article under the moderator's campus.
 */
export const addArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const { title, body, category, status } = req.body;
        if (!title || !body || !category) {
            res.status(400).json({ message: 'Title, body, and category are required.' });
            return;
        }
        const article = await createArticle({
            title,
            body,
            category,
            campus: req.user.campus,
            authorId: req.user.userId,
            status,
        });
        res.status(HttpStatus.CREATED).json({ message: 'Article created.', article });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create article.';
        res.status(500).json({ message });
    }
};
/**
 * PUT /api/articles/:id
 * Updates an article (campus-scoped).
 */
export const editArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const { title, body, category, status } = req.body;
        const article = await updateArticle(req.params['id'], req.user.campus, {
            title,
            body,
            category,
            status,
        });
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Article not found or not in your campus.' });
            return;
        }
        res.status(HttpStatus.OK).json({ message: 'Article updated.', article });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update article.';
        res.status(500).json({ message });
    }
};
/**
 * DELETE /api/articles/:id
 * Deletes an article (campus-scoped).
 */
export const removeArticle = async (req, res) => {
    try {
        if (!req.user) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
            return;
        }
        const article = await deleteArticle(req.params['id'], req.user.campus);
        if (!article) {
            res.status(HttpStatus.NOT_FOUND).json({ message: 'Article not found or not in your campus.' });
            return;
        }
        res.status(HttpStatus.OK).json({ message: 'Article deleted successfully.' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete article.';
        res.status(500).json({ message });
    }
};
//# sourceMappingURL=article.controller.js.map