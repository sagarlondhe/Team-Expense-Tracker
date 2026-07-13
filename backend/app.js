const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const categoryRoutes = require('./routes/category.routes');
const expenseRoutes = require('./routes/expense.routes');
const summaryRoutes = require('./routes/summary.routes');
const errorHandler = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow non-browser requests (server-to-server, curl, etc.)
      return callback(null, true);
    }

    // If no allowed origins configured, allow all origins
    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }

    // Allow if the origin exactly matches one of the configured origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Do not throw an error here; respond without CORS headers instead
    // so the request will be blocked by the browser without causing a 500.
    return callback(null, false);
  },
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Root route for health checks and browser requests
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Team Expense Tracker API is running.',
    routes: ['/api/categories', '/api/expenses', '/api/summary']
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/summary', summaryRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
