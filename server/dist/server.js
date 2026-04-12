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
const app = (0, express_1.default)();
// ── Middleware ───────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: [env_config_js_1.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ── Test route ───────────────────────────────────────────────
app.get('/api/test', (_req, res) => {
    res.status(200).json({
        message: 'API is working! Moderator backend is up and running.',
        environment: env_config_js_1.env.NODE_ENV,
    });
});
// ── API routes ───────────────────────────────────────────────
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/articles', article_routes_js_1.default);
// ── Create HTTP server explicitly ────────────────────────────
const server = http_1.default.createServer(app);
// ── Connect to MongoDB & start ───────────────────────────────
mongoose_1.default
    .connect(env_config_js_1.env.MONGO_URI)
    .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    server.listen(Number(env_config_js_1.env.PORT), () => {
        const addr = server.address();
        console.log(`🚀 Server is running on port ${env_config_js_1.env.PORT} [${env_config_js_1.env.NODE_ENV}]`);
        console.log(`   Address: ${JSON.stringify(addr)}`);
    });
})
    .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=server.js.map