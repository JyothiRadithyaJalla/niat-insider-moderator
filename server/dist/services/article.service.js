"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticleById = exports.getArticlesByCampus = void 0;
const Article_model_js_1 = __importDefault(require("../models/Article.model.js"));
/**
 * Fetch articles scoped to a specific campus with pagination.
 */
const getArticlesByCampus = async (campus, page = 1, limit = 10, category) => {
    const filter = { campus };
    if (category) {
        filter['category'] = category;
    }
    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
        Article_model_js_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Article_model_js_1.default.countDocuments(filter),
    ]);
    return {
        articles,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};
exports.getArticlesByCampus = getArticlesByCampus;
/**
 * Get a single article by ID, scoped to a campus.
 */
const getArticleById = async (articleId, campus) => {
    return Article_model_js_1.default.findOne({ _id: articleId, campus });
};
exports.getArticleById = getArticleById;
/**
 * Create a new article.
 */
const createArticle = async (data) => {
    const article = new Article_model_js_1.default(data);
    return article.save();
};
exports.createArticle = createArticle;
/**
 * Update an article (campus-scoped).
 */
const updateArticle = async (articleId, campus, data) => {
    return Article_model_js_1.default.findOneAndUpdate({ _id: articleId, campus }, { $set: data }, { new: true, runValidators: true });
};
exports.updateArticle = updateArticle;
/**
 * Delete an article (campus-scoped).
 */
const deleteArticle = async (articleId, campus) => {
    return Article_model_js_1.default.findOneAndDelete({ _id: articleId, campus });
};
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=article.service.js.map