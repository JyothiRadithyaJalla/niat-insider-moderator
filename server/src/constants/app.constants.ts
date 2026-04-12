export const API_ENDPOINTS = {
  AUTH_LOGIN: '/api/auth/login',
  AUTH_ME: '/api/auth/me',
  ARTICLES: '/api/articles',
  ARTICLE_BY_ID: '/api/articles/:id',
};

export const JWT_CONSTANTS = {
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};
