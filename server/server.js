import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/database.js';
import { config } from './config/environment.js';

// Routes
import authRoutes from './routes/auth.js';
import hospitalRoutes from './routes/hospitals.js';
import ambulanceRoutes from './routes/ambulances.js';
import emergencyRoutes from './routes/emergencies.js';
import routeRoutes from './routes/routes.js';
import signalRoutes from './routes/signals.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.cors));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Life Corridor API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/signals', signalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Life Corridor API running on http://${config.host}:${PORT}`);
  console.log(`📡 Environment: ${config.env}`);
  console.log(`🗄️  Database: Connected to MongoDB\n`);
});

export default app;
