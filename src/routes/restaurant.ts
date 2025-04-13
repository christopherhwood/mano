import express from 'express';
import { restaurantAgentController } from '../controllers/restaurantController.js';

const router = express.Router();

// Restaurant agent endpoint
router.post('/', restaurantAgentController);

export default router;