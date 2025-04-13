import express from 'express';
import { restaurantAgentController } from '../controllers/restaurantController.js';
import { vapiToolCallController } from '../controllers/vapiController.js';

const router = express.Router();

// Restaurant agent endpoint
router.post('/', restaurantAgentController);

// Vapi tool call endpoint
router.post('/vapi', vapiToolCallController);

export default router;