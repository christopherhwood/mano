import Tool from "./Tool.js";
import { PlacesClient } from "@googlemaps/places";
import { z } from "zod";
import env from "../config/env.js";

const findRestaurantSchema = z.object({
  query: z.string(),
});

export default class FindRestaurantTool extends Tool<typeof findRestaurantSchema> {
  constructor() {
    super("findRestaurant", env.FIND_RESTAURANT_TOOL_DESCRIPTION, findRestaurantSchema, async (parameters) => {
      const response = await this.placesClient.searchText({
        textQuery: parameters.query,
        languageCode: "en",
        regionCode: "US",
        includedType: "restaurant",
        openNow: true,
        maxResultCount: 10,
        minRating: 3,
      }, {otherArgs: {
        headers: {
          "X-Goog-Fieldmask": env.GOOGLE_PLACES_FIELD_MASK
        }
      }});
      return JSON.stringify(response);
    });
  }

  placesClient = new PlacesClient({
    apiKey: process.env.GOOGLE_PLACES_API_KEY,
  });
}