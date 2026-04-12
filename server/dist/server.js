"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const env_config_js_1 = require("./config/env.config.js");
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const article_routes_js_1 = __importDefault(require("./routes/article.routes.js"));
const announcement_routes_js_1 = __importDefault(require("./routes/announcement.routes.js"));
const job_routes_js_1 = __importDefault(require("./routes/job.routes.js"));
const app = (0, express_1.default)();
// ── Middleware ───────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: [env_config_js_1.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// ── Health Check ─────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.status(200).send('Moderator API is running.');
});
// ── Test route ───────────────────────────────────────────────
app.get('/api/test', (_req, res) => {
    res.status(200).json({
        message: 'API is working! Moderator backend is up and running.',
        environment: env_config_js_1.env.NODE_ENV,
        version: '1.0.5-deploy-fix',
        timestamp: new Date().toISOString()
    });
});
// ── API routes ───────────────────────────────────────────────
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/articles', article_routes_js_1.default);
app.use('/api/announcements', announcement_routes_js_1.default);
app.use('/api/jobs', job_routes_js_1.default);
// ── Create HTTP server ───────────────────────────────────────
const server = http_1.default.createServer(app);
// ── Start Server First (for Port Binding) ────────────────────
const PORT = Number(env_config_js_1.env.PORT) || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is listening on 0.0.0.0:${PORT} [${env_config_js_1.env.NODE_ENV}]`);
});
// ── Connect to MongoDB ────────────────────────────────────────
mongoose_1.default
    .connect(env_config_js_1.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Fail fast if DB down
})
    .then(() => {
    console.log('✅ Successfully connected to MongoDB');
})
    .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error);
    // On some platforms we might want to stay alive even if DB fails initially
    // process.exit(1); 
});
exports.default = app;
//# sourceMappingURL=server.js.map