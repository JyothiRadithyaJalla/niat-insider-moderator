export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  campus: string;
}

export enum ArticleStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

export interface Article {
  _id: string;
  title: string;
  body: string;
  category: string;
  campus: string;
  authorId: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
}
