"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONSTANTS = exports.API_ENDPOINTS = void 0;
exports.API_ENDPOINTS = {
    AUTH_LOGIN: '/api/auth/login',
    AUTH_ME: '/api/auth/me',
    ARTICLES: '/api/articles',
    ARTICLE_BY_ID: '/api/articles/:id',
};
exports.JWT_CONSTANTS = {
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};
//# sourceMappingURL=app.constants.js.map