import express from 'express';
import env from './config/env.js';
import restaurantRoutes from './routes/restaurant.js';

// Initialize Express app
const app = express();
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  next();
});

// Register routes
app.use('/api/restaurant-agent', restaurantRoutes);

// Start the server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});