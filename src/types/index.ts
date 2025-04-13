// Restaurant-related types
export interface Restaurant {
  name: string;
  address: string;
  rating: number;
  price_level: number;
  place_id: string;
  website?: string;
  formatted_address?: string;
}

export interface EnrichedRestaurant extends Restaurant {
  menu: MenuItem[];
  menu_source: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price?: string;
}

export interface RestaurantQueryResult {
  response: string;
  restaurants: EnrichedRestaurant[];
}

// API response types
export interface GooglePlacesResponse {
  results?: any[];
  status?: string;
  error_message?: string;
}