# Mano

A restaurant recommendation agent built with Node.js, Express, Groq, Stagehand, and Prisma.

## Overview

Mano is an AI-powered restaurant recommendation system that helps users find and learn about restaurants that match their preferences. Using natural language conversations, users can specify their dining preferences and receive personalized recommendations complete with menu details, prices, and ratings.

The system uses the Groq API with Qwen's powerful language model to understand user requests, Google Places API to find relevant restaurants, and Browserbase's Stagehand for scraping menu information from restaurant websites.

## Features

- Express server with REST API endpoint
- AI-powered restaurant recommendations using Qwen model on Groq
- Google Places API integration for restaurant search with detailed field filtering
- Browser automation with Stagehand for fetching menu information
- OpenAI integration for web content analysis
- Real-time conversation about restaurant options and menus
- VAPI (Voice Agent) integration for using Mano as a tool in voice agent workflows 
- User session management with Prisma database integration
- Modular architecture with separation of concerns

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` and fill in the required API keys:
  - `GROQ_API_KEY`: API key for accessing Groq
  - `GOOGLE_PLACES_API_KEY`: API key for Google Places API
  - `BROWSERBASE_API_KEY`: API key for Browserbase Stagehand
  - `BROWSERBASE_PROJECT_ID`: Your Browserbase project ID
  - `OPENAI_API_KEY`: API key for OpenAI (used by Stagehand)
  - `DATABASE_URL`: Prisma database connection URL
  - `DIRECT_URL`: Direct database connection URL for Prisma
  - `SESSION_LIMIT`: Maximum number of sessions allowed without signup
  - `SESSION_LIMIT_ERROR_MESSAGE`: Custom error message for session limit reached
  - `AGENT_SYSTEM_PROMPT`: System prompt for the restaurant agent
  - `FIND_RESTAURANT_TOOL_DESCRIPTION`: Description for the restaurant search tool
  - `GOOGLE_PLACES_FIELD_MASK`: Field mask for Google Places API
  - `USE_BROWSER_TOOL_DESCRIPTION`: Description for the browser tool
  - `USE_BROWSER_TOOL_PROMPT`: System prompt for the browser tool

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── agent/          # AI agent components
│   ├── Tool.ts                # Base tool definition
│   ├── findRestaurantTool.ts  # Google Places API tool
│   ├── useBrowserTool.ts      # Browser automation tool
│   └── restaurantAgent.ts     # Main agent implementation
├── config/         # Configuration files
│   └── env.ts      # Environment variables validation
├── controllers/    # Request handlers
│   ├── restaurantController.ts
│   └── vapiController.ts      # VAPI tool handler
├── routes/         # API routes
│   └── restaurant.ts
├── types/          # TypeScript type definitions
│   └── index.ts
└── index.ts        # Application entry point
```

## API Usage

### Restaurant Agent Endpoint

`POST /api/restaurant-agent`

Request body:
```json
{
  "userQuery": "I'm looking for Italian restaurants in Boston with good pasta options"
}
```

Response:
```json
{
  "result": "Based on your request, I've found several great Italian restaurants in Boston known for their pasta dishes:\n\n1. **Giacomo's Ristorante** - A beloved local favorite with homemade pasta and rich sauces. Their butternut squash ravioli with sage brown butter is exceptional.\n\n2. **Sportello** - Modern Italian restaurant with handmade pasta by award-winning chef Barbara Lynch. Their tagliatelle with bolognese is outstanding.\n\n3. **Rino's Place** - Authentic family-owned spot with generous portions and incredible homemade pastas. The lobster ravioli is a must-try.\n\nMy top recommendation would be **Giacomo's Ristorante** for their consistently excellent pasta dishes, reasonable prices, and authentic Italian atmosphere. Would you like more details about any of these restaurants?"
}
```

### VAPI Tool Call Endpoint

`POST /api/restaurant-agent/vapi`

This endpoint supports using the restaurant agent as a tool for VAPI (Voice Agent) services.

Request body:
```json
{
  "message": {
    "toolCallList": [
      {
        "id": "tool-call-id-1",
        "function": {
          "name": "restaurant-agent",
          "arguments": {"userQuery": "I'm looking for Italian restaurants in Boston with good pasta options"}
        }
      }
    ]
  }
}
```

Response:
```json
{
  "results": [
    {
      "toolCallId": "tool-call-id-1",
      "result": "Based on your request, I've found several great Italian restaurants in Boston..."
    }
  ]
}
```

## Technical Implementation

### Agent System

Mano uses a tool-based agent system where the LLM can choose to:

1. **Find Restaurants** - Query the Google Places API with specific parameters like location, cuisine type, and other filters
   - Enhanced with field masking to fetch detailed restaurant information including ratings, reviews, and amenities
   - Filters results by minimum rating and ensures only open restaurants are shown
2. **Browse Websites** - Navigate to restaurant websites and extract menu information using browser automation
   - Integrates with OpenAI's computer-use-preview model for intelligent content analysis of restaurant websites
   - Uses Browserbase's Stagehand for reliable browser automation with built-in ad blocking

The agent loop works as follows:
1. User query is sent to the agent
2. The Qwen model on Groq analyzes the query and chooses appropriate tools to use
3. Tool execution results are fed back to the LLM with proper tool response formatting
4. Detailed logging provides transparency into the agent's decision-making process
5. The process repeats until the LLM has enough information to provide a final response
6. A formatted response with restaurant recommendations is returned to the user

### Voice Agent Integration

Mano can be used as a tool within VAPI (Voice Agent) workflows, allowing voice-based AI systems to leverage Mano's restaurant recommendation capabilities. The VAPI controller:

- Accepts standardized tool call requests from VAPI services
- Processes restaurant search queries through the RestaurantAgent
- Returns structured results that can be integrated into voice conversations
- Follows the VAPI tool protocol for seamless integration

### Session Management

Mano includes a session management system that:

- Tracks user sessions using Prisma ORM with database integration
- Limits the number of sessions per user based on configurable settings
- Provides custom error messages when session limits are reached
- Supports user signups for obtaining personal contact numbers

### Future Enhancements

- User preferences and history tracking with memory to provide more personalized recommendations over time
- Additional VAPI tool integrations for expanded voice agent capabilities
- Enhanced restaurant data retrieval with more detailed menu information
- Improved session analytics and user behavior tracking