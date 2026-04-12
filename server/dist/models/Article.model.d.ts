import mongoose, { Document } from 'mongoose';
import { ArticleStatus } from '../types/article.types.js';
export interface IArticleDocument extends Document {
    title: string;
    body: string;
    category: string;
    campus: string;
    authorId: mongoose.Types.ObjectId;
    status: ArticleStatus;
    createdAt: Date;
    updatedAt: Date;
}
declare const Article: mongoose.Model<IArticleDocument, {}, {}, {}, mongoose.Document<unknown, {}, IArticleDocument, {}, mongoose.DefaultSchemaOptions> & IArticleDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IArticleDocument>;
export default Article;
//# sourceMappingURL=Article.model.d.ts.map