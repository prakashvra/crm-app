const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const organizationRoutes = require('./routes/organizations');
const dealRoutes = require('./routes/deals');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;
const HOST = '0.0.0.0'; // Required for Cloud Run

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Readiness probe for Cloud Run
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'crm-backend' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection and server start
const startServer = async () => {
  try {
    console.log('Starting server...');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Port: ${PORT}`);
    console.log(`Host: ${HOST}`);
    
    // Start server first, then connect to database
    const server = app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
    });

    // Handle server startup errors
    server.on('error', (error) => {
      console.error('Server startup error:', error);
      process.exit(1);
    });

    // Connect to database after server starts
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
