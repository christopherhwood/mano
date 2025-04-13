# Mano

A restaurant recommendation agent built with Node.js, Express, Groq, and Stagehand.

## Overview

Mano is an AI-powered restaurant recommendation system that helps users find and learn about restaurants that match their preferences. Using natural language conversations, users can specify their dining preferences and receive personalized recommendations complete with menu details, prices, and ratings.

The system uses the Groq API with DeepSeek's powerful language model to understand user requests, Google Places API to find relevant restaurants, and Browserbase's Stagehand for scraping menu information from restaurant websites.

## Features

- Express server with REST API endpoint
- AI-powered restaurant recommendations using DeepSeek model on Groq
- Google Places API integration for restaurant search
- Browser automation with Stagehand for fetching menu information
- Real-time conversation about restaurant options and menus
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
│   └── restaurantController.ts
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
  "result": {
    "response": "Based on your request, I've found several great Italian restaurants in Boston known for their pasta dishes:\n\n1. **Giacomo's Ristorante** - A beloved local favorite with homemade pasta and rich sauces. Their butternut squash ravioli with sage brown butter is exceptional.\n\n2. **Sportello** - Modern Italian restaurant with handmade pasta by award-winning chef Barbara Lynch. Their tagliatelle with bolognese is outstanding.\n\n3. **Rino's Place** - Authentic family-owned spot with generous portions and incredible homemade pastas. The lobster ravioli is a must-try.\n\nMy top recommendation would be **Giacomo's Ristorante** for their consistently excellent pasta dishes, reasonable prices, and authentic Italian atmosphere. Would you like more details about any of these restaurants?",
    "restaurants": [
      {
        "name": "Giacomo's Ristorante",
        "address": "355 Hanover St, Boston, MA 02113",
        "rating": 4.7,
        "price_level": 2,
        "place_id": "ChIJLbDVR6dwcUYRmNrxD0_O2zA",
        "menu": [
          {
            "name": "Butternut Squash Ravioli",
            "description": "Handmade ravioli filled with butternut squash, served with sage brown butter sauce and topped with toasted walnuts",
            "price": "$21.99"
          },
          {
            "name": "Linguine Frutti di Mare",
            "description": "Fresh linguine with clams, mussels, shrimp, and calamari in a light tomato sauce",
            "price": "$25.99"
          }
        ],
        "menu_source": "https://giacomosristorante-boston.com/menu"
      }
    ]
  }
}
```

## Technical Implementation

### Agent System

Mano uses a tool-based agent system where the LLM can choose to:

1. **Find Restaurants** - Query the Google Places API with specific parameters like location, cuisine type, and other filters
2. **Browse Websites** - Navigate to restaurant websites and extract menu information using browser automation

The agent loop works as follows:
1. User query is sent to the agent
2. The LLM analyzes the query and chooses appropriate tools to use
3. Tool execution results are fed back to the LLM
4. The process repeats until the LLM has enough information to provide a final response
5. A formatted response with restaurant recommendations is returned to the user

### Future Enhancements

- User preferences and history tracking with memory to provide more personalized recommendations over time