import { PrismaClient } from '../generated/prisma/index.js';

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient();

export default prisma; 