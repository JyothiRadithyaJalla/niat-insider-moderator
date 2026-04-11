import mongoose, { Schema, Document } from 'mongoose';
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

const ArticleSchema: Schema<IArticleDocument> = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model<IArticleDocument>('Article', ArticleSchema);
export default Article;
