import express, { Request, Response } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { env } from './config/env.config.js';
import authRoutes from './routes/auth.routes.js';
import articleRoutes from './routes/article.routes.js';

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Test route ───────────────────────────────────────────────
app.get('/api/test', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'API is working! Moderator backend is up and running.',
    environment: env.NODE_ENV,
  });
});

// ── API routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// ── Create HTTP server explicitly ────────────────────────────
const server = http.createServer(app);

// ── Connect to MongoDB & start ───────────────────────────────
mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    server.listen(Number(env.PORT), () => {
      const addr = server.address();
      console.log(`🚀 Server is running on port ${env.PORT} [${env.NODE_ENV}]`);
      console.log(`   Address: ${JSON.stringify(addr)}`);
    });
  })
  .catch((error: unknown) => {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  });

export default app;
