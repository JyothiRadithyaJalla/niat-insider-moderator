import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { env } from './config/env.config.js';
import authRoutes from './routes/auth.routes.js';
import articleRoutes from './routes/article.routes.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Test route ──────────────────────────────────────────────
app.get('/api/test', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'API is working! Moderator backend is up and running.',
    environment: env.NODE_ENV,
  });
});

// ── API routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// ── Connect to MongoDB & start server ───────────────────────
mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
  })
  .catch((error: unknown) => {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  });

export default app;
