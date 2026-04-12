"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// POST /api/auth/login — Authenticate user
router.post('/login', auth_controller_1.login);
// GET /api/auth/me — Get authenticated user profile
router.get('/me', authenticate_1.authenticate, auth_controller_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map