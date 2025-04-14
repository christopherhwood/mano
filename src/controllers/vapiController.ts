import { Request, Response } from 'express';
import { RestaurantAgent } from '../agent/restaurantAgent.js';
import prisma from '../config/prisma.js';
import { env } from 'process';

/**
 * Helper function to handle user and session management
 * @param number - Customer phone number
 * @param agentNumber - Agent phone number
 * @param res - Express response object
 * @returns The created session or null if session limit reached
 */
async function handleUserAndSession(number: string, agentNumber: string, res: Response) {
  // Atomically find or create user based on phone number
  const user = await prisma.user.upsert({
    where: {
      phone_number: number
    },
    update: {}, // No updates needed if user exists
    create: {
      phone_number: number
    }
  });

  // Check if user already has 3 or more sessions and doesn't have an agent number assigned
  const sessionCount = await prisma.session.count({
    where: {
      user_id: user.id
    }
  });

  if (sessionCount >= parseInt(env.SESSION_LIMIT || '3') && !user.agent_number) {
    console.log(`User ${user.id} has reached session limit without signing up`);
    return null;
  }
  
  // Create a new session for the user
  const session = await prisma.session.create({
    data: {
      user_id: user.id,
      phone_number: number,
      agent_number: agentNumber
    }
  });
  console.log(`Created new session with ID: ${session.id}`);
  return session;
}

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

    let session = null;
    const customer = message.customer;
    if (customer) {
      const number = customer.number;
      const agentNumber = message.phoneNumber.number;

      // Handle user and session management
      session = await handleUserAndSession(number, agentNumber, res);
    }
    
    for (const toolCall of message.toolCallList) {
      const { id, function: { name, arguments: args } } = toolCall;

      if (!session) {
        results.push({
          toolCallId: id,
          result: env.SESSION_LIMIT_ERROR_MESSAGE
        });
        continue;
      }

      // Handle different tool calls based on the name
      if (name === 'restaurant-agent') {
        const agent = new RestaurantAgent();
        const result = await agent.run(args.userQuery || '');
        const cleanedResult = await agent.clean(result);
        results.push({
          toolCallId: id,
          result: cleanedResult
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