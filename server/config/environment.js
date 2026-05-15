import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  host: process.env.HOST || 'localhost',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/life-corridor',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  },

  // APIs
  apis: {
    googleMaps: process.env.GOOGLE_MAPS_API_KEY || '',
    googleDirections: process.env.GOOGLE_DIRECTIONS_API_KEY || '',
    traffic: process.env.TRAFFIC_API_KEY || '',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
};

export default config;
