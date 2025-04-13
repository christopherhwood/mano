import express from 'express';
import env from './config/env.js';
import restaurantRoutes from './routes/restaurant.js';

// Initialize Express app
const app = express();
app.use(express.json());

// Register routes
app.use('/api/restaurant-agent', restaurantRoutes);

// Start the server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});