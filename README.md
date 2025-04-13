# Mano

A restaurant recommendation agent built with Node.js, Express, Groq, and Stagehand.

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
├── config/         # Configuration files
│   └── env.ts      # Environment variables validation
├── controllers/    # Request handlers
│   └── restaurantController.ts
├── routes/         # API routes
│   └── restaurant.ts
├── services/       # Business logic
│   ├── groq.ts     # Groq API integration
│   └── stagehand.ts # Browser automation
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
  "response": "AI-generated response about restaurant recommendations",
  "restaurants": [
    {
      "name": "Restaurant Name",
      "address": "123 Main St, Boston, MA",
      "rating": 4.5,
      "price_level": 2,
      "place_id": "google_place_id",
      "menu": [
        {
          "name": "Spaghetti Carbonara",
          "description": "Classic pasta dish with eggs, cheese, pancetta, and pepper",
          "price": "$18.99"
        }
      ],
      "menu_source": "https://restaurant-website.com/menu"
    }
  ]
}
```