import express, { Request, Response } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { env } from './config/env.config.js';
import authRoutes from './routes/auth.routes.js';
import articleRoutes from './routes/article.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import jobRoutes from './routes/job.routes.js';

const app = express();


// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── Health Check ─────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Moderator API is running.');
});

// ── Test route ───────────────────────────────────────────────
app.get('/api/test', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'API is working! Moderator backend is up and running.',
    environment: env.NODE_ENV,
    version: '1.0.5-deploy-fix',
    timestamp: new Date().toISOString()
  });
});


// ── API routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/jobs', jobRoutes);

// ── Create HTTP server ───────────────────────────────────────
const server = http.createServer(app);

// ── Start Server First (for Port Binding) ────────────────────
const PORT = Number(env.PORT) || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is listening on 0.0.0.0:${PORT} [${env.NODE_ENV}]`);
});

// ── Connect to MongoDB ────────────────────────────────────────
mongoose
  .connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Fail fast if DB down
  })
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch((error: unknown) => {
    console.error('❌ Error connecting to MongoDB:', error);
    // On some platforms we might want to stay alive even if DB fails initially
    // process.exit(1); 
  });

export default app;

