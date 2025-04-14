import { Request, Response } from 'express';
import { RestaurantAgent } from '../agent/restaurantAgent.js';

/**
 * Controller for handling Vapi tool calls
 */
export async function vapiToolCallController(req: Request, res: Response): Promise<void> {
  try {
    const { message } = req.body;
    
    if (!message || !message.toolCallList || !Array.isArray(message.toolCallList)) {
      res.status(400).json({ error: 'Invalid request format' });
      return;
    }

    const results = [];
    
    for (const toolCall of message.toolCallList) {
      const { id, function: { name, arguments: args } } = toolCall;
      
      // Handle different tool calls based on the name
      if (name === 'restaurant-agent') {
        const agent = new RestaurantAgent();
        const result = await agent.run(args.query || '');
        results.push({
          toolCallId: id,
          result
        });
      } else {
        // Handle unknown tools
        results.push({
          toolCallId: id,
          result: `Unknown tool: ${name}`
        });
      }
    }
    
    res.json({ results });
  } catch (error) {
    console.error('Error in vapiToolCallController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 