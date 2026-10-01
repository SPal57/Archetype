import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import laneHeaderRoutes from './routes/laneHeaderRoutes.js';
import { getDbPool } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow cross-origin requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health Check & Database Ping Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query('SELECT @@VERSION AS sqlVersion, DB_NAME() AS currentDb');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: result.recordset[0].currentDb,
      schema: process.env.DB_SCHEMA || 'archetype',
      message: 'Connected to Azure SQL Database (LHM2)'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Degraded',
      timestamp: new Date().toISOString(),
      database: process.env.DB_DATABASE || 'LHM2',
      schema: process.env.DB_SCHEMA || 'archetype',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/lane-headers', laneHeaderRoutes);

// Static Frontend Serving (For Unified Azure App Service Deployment)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // SPA fallback for React client routing
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Fallback Route if frontend not built yet
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Endpoint not found',
      availableEndpoints: [
        'GET /api/health',
        'GET /api/lane-headers',
        'GET /api/lane-headers/:id',
        'POST /api/lane-headers'
      ]
    });
  });
}

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 J&J Archetype Service running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Lane headers: http://localhost:${PORT}/api/lane-headers`);
  console.log(`====================================================`);
});
