export type GroupType = "Solo" | "Couple" | "Friends" | "Family";
export type Vibe =
  | "Relaxing"
  | "Adventure"
  | "Romantic"
  | "Cultural"
  | "Luxury"
  | "Budget";
export type Terrain = "Beach" | "Hills" | "City" | "Nature" | "Spiritual" | "Any";

export const GROUP_TYPES: GroupType[] = ["Solo", "Couple", "Friends", "Family"];
export const VIBES: Vibe[] = [
  "Relaxing",
  "Adventure",
  "Romantic",
  "Cultural",
  "Luxury",
  "Budget",
];
export const TERRAINS: Terrain[] = [
  "Beach",
  "Hills",
  "City",
  "Nature",
  "Spiritual",
  "Any",
];

export interface TripFormValues {
  startDate: string;
  endDate: string;
  travelers: number;
  groupType: GroupType;
  vibe: Vibe;
  terrain: Terrain;
  budget: number;
  startingCity: string;
  // Optional destination the user already has in mind; when set,
  // suggestions are biased toward it.
  destination?: string;
  notes?: string;
}

export interface CostBreakdownLinks {
  transport?: string;
  accommodation?: string;
  food?: string;
  activities?: string;
}

export interface TripCostBreakdown {
  transport: string;
  accommodation: string;
  food: string;
  activities: string;
  total: string;
  // Real booking/search links so the estimate can be verified against live prices.
  links?: CostBreakdownLinks;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface TripSuggestion {
  destination: string;
  reason: string;
  bestTime: string;
  estimatedBudget: string;
  duration: string;
  tags: string[];
  highlights: string[];
  costBreakdown?: TripCostBreakdown;
  itinerary?: ItineraryDay[];
}
