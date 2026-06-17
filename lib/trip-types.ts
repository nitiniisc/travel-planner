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
  notes?: string;
}

export interface TripSuggestion {
  destination: string;
  reason: string;
  bestTime: string;
  estimatedBudget: string;
  duration: string;
  tags: string[];
  highlights: string[];
}
