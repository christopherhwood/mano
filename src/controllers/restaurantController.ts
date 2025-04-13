import { Request, Response } from 'express';
import { RestaurantAgent } from '../agent/restaurantAgent.js';

/**
 * Controller for the restaurant agent endpoint
 */
export async function restaurantAgentController(req: Request, res: Response): Promise<void> {
  try {
    const { userQuery } = req.body;
    const agent = new RestaurantAgent();

    if (!userQuery || typeof userQuery !== 'string') {
      res.status(400).json({ error: 'Missing or invalid userQuery' });
      return;
    }

    const result = await agent.run(userQuery);
    res.json({ result });
  } catch (error) {
    console.error('Error in restaurantAgentController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}