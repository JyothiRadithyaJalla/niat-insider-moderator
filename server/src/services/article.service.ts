import Article, { IArticleDocument } from '../models/Article.model.js';

interface PaginatedResult {
  articles: IArticleDocument[];
  total: number;
  page: number;
  totalPages: number;
}

interface CreateArticleData {
  title: string;
  body: string;
  category: string;
  campus: string;
  authorId: string;
  status?: string | undefined;
}

interface UpdateArticleData {
  title?: string | undefined;
  body?: string | undefined;
  category?: string | undefined;
  status?: string | undefined;
}

/**
 * Fetch articles scoped to a specific campus with pagination.
 */
export const getArticlesByCampus = async (
  campus: string,
  page: number = 1,
  limit: number = 10,
  category?: string
): Promise<PaginatedResult> => {
  const filter: Record<string, string> = { campus };
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
export const getArticleById = async (
  articleId: string,
  campus: string
): Promise<IArticleDocument | null> => {
  return Article.findOne({ _id: articleId, campus });
};

/**
 * Create a new article.
 */
export const createArticle = async (data: CreateArticleData): Promise<IArticleDocument> => {
  const article = new Article(data);
  return article.save();
};

/**
 * Update an article (campus-scoped).
 */
export const updateArticle = async (
  articleId: string,
  campus: string,
  data: UpdateArticleData
): Promise<IArticleDocument | null> => {
  return Article.findOneAndUpdate(
    { _id: articleId, campus },
    { $set: data },
    { new: true, runValidators: true }
  );
};

/**
 * Delete an article (campus-scoped).
 */
export const deleteArticle = async (
  articleId: string,
  campus: string
): Promise<IArticleDocument | null> => {
  return Article.findOneAndDelete({ _id: articleId, campus });
};
