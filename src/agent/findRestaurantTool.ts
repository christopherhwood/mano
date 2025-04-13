import Tool from "./Tool.js";
import { PlacesClient } from "@googlemaps/places";
import { z } from "zod";

const findRestaurantSchema = z.object({
  query: z.string(),
});

export default class FindRestaurantTool extends Tool<typeof findRestaurantSchema> {
  constructor() {
    super("findRestaurant", "Find restaurants matching a user query", findRestaurantSchema, async (parameters) => {
      const response = await this.placesClient.searchText({
        textQuery: parameters.query,
        languageCode: "en",
        regionCode: "US",
        includedType: "restaurant",
        openNow: true,
        maxResultCount: 10,
        minRating: 3,
      });
      return JSON.stringify(response);
    });
  }

  placesClient = new PlacesClient({
    apiKey: process.env.GOOGLE_PLACES_API_KEY,
  });
}