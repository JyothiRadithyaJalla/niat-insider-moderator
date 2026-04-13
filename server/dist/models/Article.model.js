import mongoose, { Schema } from 'mongoose';
import { ArticleStatus } from '../types/article.types.js';
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    campus: {
        type: String,
        required: true,
        trim: true,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ArticleStatus),
        default: ArticleStatus.DRAFT,
    },
}, {
    timestamps: true,
});
const Article = mongoose.model('Article', ArticleSchema);
export default Article;
//# sourceMappingURL=Article.model.js.map