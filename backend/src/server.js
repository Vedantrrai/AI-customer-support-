import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { connectDB, isDbInMemory } from './config/db.js';
import { seedDatabase } from './data/seedData.js';

import chatRoutes from './routes/chatRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health & Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NovaSupport AI Backend',
    database: isDbInMemory() ? 'in-memory-mongodb' : 'mongodb-connected',
    provider: config.llmProvider
  });
});

// Mount Routes
app.use('/api/chat', chatRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Global 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Boot server
async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(config.port, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 NovaSupport AI Backend running on port ${config.port}`);
      console.log(`🌐 Health endpoint: http://localhost:${config.port}/api/health`);
      console.log(`📚 Database mode: ${isDbInMemory() ? 'In-Memory MongoDB' : 'External MongoDB'}`);
      console.log(`🤖 Active LLM Engine: ${config.llmProvider}`);
      console.log(`==================================================\n`);
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
export { startServer };
