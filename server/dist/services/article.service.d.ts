import { IArticleDocument } from '../models/Article.model.js';
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
export declare const getArticlesByCampus: (campus: string, page?: number, limit?: number, category?: string) => Promise<PaginatedResult>;
/**
 * Get a single article by ID, scoped to a campus.
 */
export declare const getArticleById: (articleId: string, campus: string) => Promise<IArticleDocument | null>;
/**
 * Create a new article.
 */
export declare const createArticle: (data: CreateArticleData) => Promise<IArticleDocument>;
/**
 * Update an article (campus-scoped).
 */
export declare const updateArticle: (articleId: string, campus: string, data: UpdateArticleData) => Promise<IArticleDocument | null>;
/**
 * Delete an article (campus-scoped).
 */
export declare const deleteArticle: (articleId: string, campus: string) => Promise<IArticleDocument | null>;
export {};
//# sourceMappingURL=article.service.d.ts.map