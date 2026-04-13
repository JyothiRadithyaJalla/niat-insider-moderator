import Article from '../models/Article.model.js';
/**
 * Fetch articles scoped to a specific campus with pagination.
 */
export const getArticlesByCampus = async (campus, page = 1, limit = 10, category) => {
    const filter = { campus };
    if (category) {
        filter['category'] = category;
    }
    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
        Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Article.countDocuments(filter),
    ]);
    return {
        articles,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};
/**
 * Get a single article by ID, scoped to a campus.
 */
export const getArticleById = async (articleId, campus) => {
    return Article.findOne({ _id: articleId, campus });
};
/**
 * Create a new article.
 */
export const createArticle = async (data) => {
    const article = new Article(data);
    return article.save();
};
/**
 * Update an article (campus-scoped).
 */
export const updateArticle = async (articleId, campus, data) => {
    return Article.findOneAndUpdate({ _id: articleId, campus }, { $set: data }, { new: true, runValidators: true });
};
/**
 * Delete an article (campus-scoped).
 */
export const deleteArticle = async (articleId, campus) => {
    return Article.findOneAndDelete({ _id: articleId, campus });
};
//# sourceMappingURL=article.service.js.map