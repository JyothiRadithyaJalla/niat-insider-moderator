"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_js_1 = require("../controllers/article.controller.js");
const authenticate_js_1 = require("../middleware/authenticate.js");
const authorise_js_1 = require("../middleware/authorise.js");
const auth_types_js_1 = require("../types/auth.types.js");
const router = (0, express_1.Router)();
// All article routes require authentication + role check + campus scope
router.use(authenticate_js_1.authenticate);
router.use((0, authorise_js_1.authorise)(auth_types_js_1.UserRole.MODERATOR, auth_types_js_1.UserRole.ADMIN));
router.use(authorise_js_1.campusScopeGuard);
// GET    /api/articles      — List articles (campus-scoped, paginated)
router.get('/', article_controller_js_1.getArticles);
// GET    /api/articles/:id  — Get single article
router.get('/:id', article_controller_js_1.getArticle);
// POST   /api/articles      — Create article
router.post('/', article_controller_js_1.addArticle);
// PUT    /api/articles/:id  — Update article
router.put('/:id', article_controller_js_1.editArticle);
// DELETE /api/articles/:id  — Delete article
router.delete('/:id', article_controller_js_1.removeArticle);
exports.default = router;
//# sourceMappingURL=article.routes.js.map