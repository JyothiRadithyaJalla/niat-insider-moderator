import express, { Request, Response } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { env } from './config/env.config.js';
import authRoutes from './routes/auth.routes.js';
import articleRoutes from './routes/article.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import jobRoutes from './routes/job.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import snippetRoutes from './routes/snippet.routes.js';

const app = express();


// ── Middleware ───────────────────────────────────────────────
const allowedOrigins = [
  env.CLIENT_URL,
  'https://niat-insider-moderator-zeta.vercel.app',
  'https://niat-insider-moderator-zeta.vercel.app/',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
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
    version: '1.0.7-prod-build-fix',
    timestamp: new Date().toISOString()
  });
});


// ── API routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Create HTTP server ───────────────────────────────────────
const server = http.createServer(app);

// ── Start Server First (for Port Binding) ────────────────────
const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('----------------------------------------------------');
  console.log(`🚀 Server is listening on 0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔒 Allowed Client URL: ${env.CLIENT_URL}`);
  console.log('----------------------------------------------------');
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

