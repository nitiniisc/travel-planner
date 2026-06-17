import type {
  ItineraryDay,
  TripCostBreakdown,
  TripFormValues,
  TripSuggestion,
} from "@/lib/trip-types";

export const SYSTEM_PROMPT = "You are an expert Indian travel planner.";

// Exact prompt template supplied for the /api/generate-trip LLM call.
// Used verbatim once OPENAI_API_KEY is set; the mock path below mirrors
// its rules and JSON shape without calling out to a model.
export function buildUserPrompt(input: TripFormValues): string {
  return `Generate personalized travel suggestions based on the user's trip details.

User input:

* Start date: ${input.startDate}
* End date: ${input.endDate}
* Number of travelers: ${input.travelers}
* Group type: ${input.groupType}
* Travel vibe: ${input.vibe}
* Terrain preference: ${input.terrain}
* Budget in INR: ${input.budget}
* Starting city: ${input.startingCity}
* Optional notes: ${input.notes || "None"}

Return 3 highly relevant travel suggestions.

Rules:

* Prefer realistic Indian travel destinations unless the user clearly asks for international travel.
* Keep the suggestions practical for the given budget.
* Consider travel time from the starting city.
* Match the destination to the group type, vibe, terrain, dates, and budget.
* Do not suggest unsafe or unrealistic trips.
* Give clear, useful, non-generic recommendations.
* Include a realistic cost breakdown (transport, accommodation, food, activities, total) that adds up close to the total budget.
* Include a day-by-day itinerary matching the trip duration.
* Return only valid JSON.
* Do not include markdown.
* Do not include explanations outside JSON.

JSON format:

{
"suggestions": [
{
"destination": "string",
"reason": "string",
"bestTime": "string",
"estimatedBudget": "string",
"duration": "string",
"tags": ["string"],
"highlights": ["string"],
"costBreakdown": {
"transport": "string",
"accommodation": "string",
"food": "string",
"activities": "string",
"total": "string"
},
"itinerary": [
{
"day": 1,
"title": "string",
"activities": ["string"]
}
]
}
]
}`;
}

interface MockDestination {
  destination: string;
  bestTime: string;
  highlights: string[];
}

const MOCK_DESTINATIONS_BY_TERRAIN: Record<string, MockDestination[]> = {
  Beach: [
    {
      destination: "Goa",
      bestTime: "November to February",
      highlights: [
        "Relax on Palolem or Agonda beach",
        "Sunset cruise on the Mandovi river",
        "Explore Old Goa's Portuguese churches",
        "Beach shacks and seafood by the shore",
      ],
    },
    {
      destination: "Andaman Islands",
      bestTime: "October to May",
      highlights: [
        "Snorkeling at Havelock Island",
        "Cellular Jail light and sound show",
        "Radhanagar Beach sunset",
        "Scuba diving at Elephant Beach",
      ],
    },
    {
      destination: "Pondicherry",
      bestTime: "October to March",
      highlights: [
        "Walk the French Quarter promenade",
        "Auroville and the Matrimandir",
        "Cafe-hopping on Rue Romain Rolland",
        "Paradise Beach boat ride",
      ],
    },
  ],
  Hills: [
    {
      destination: "Manali",
      bestTime: "March to June",
      highlights: [
        "Solang Valley adventure sports",
        "Old Manali cafes and riverside walks",
        "Hadimba Temple",
        "Day trip to Rohtang Pass",
      ],
    },
    {
      destination: "Munnar",
      bestTime: "September to May",
      highlights: [
        "Tea plantation tours",
        "Eravikulam National Park",
        "Mattupetty Dam boating",
        "Sunrise at Top Station",
      ],
    },
    {
      destination: "Darjeeling",
      bestTime: "March to May, October to December",
      highlights: [
        "Sunrise at Tiger Hill",
        "Darjeeling Himalayan toy train",
        "Padmaja Naidu Zoo",
        "Tea estate walks",
      ],
    },
  ],
  City: [
    {
      destination: "Jaipur",
      bestTime: "October to March",
      highlights: [
        "Amber Fort and City Palace",
        "Hawa Mahal at sunrise",
        "Shopping in Johari Bazaar",
        "Chokhi Dhani cultural evening",
      ],
    },
    {
      destination: "Mumbai",
      bestTime: "November to February",
      highlights: [
        "Gateway of India and Marine Drive",
        "Street food in Mohammed Ali Road",
        "Elephanta Caves day trip",
        "Bandra-Worli Sea Link views",
      ],
    },
    {
      destination: "Hyderabad",
      bestTime: "October to February",
      highlights: [
        "Charminar and Laad Bazaar",
        "Golconda Fort sound and light show",
        "Ramoji Film City",
        "Biryani trail across the old city",
      ],
    },
  ],
  Nature: [
    {
      destination: "Coorg",
      bestTime: "October to March",
      highlights: [
        "Coffee plantation walks",
        "Abbey Falls",
        "Dubare Elephant Camp",
        "Talacauvery sunrise trek",
      ],
    },
    {
      destination: "Rishikesh",
      bestTime: "September to April",
      highlights: [
        "River rafting on the Ganges",
        "Laxman Jhula and Ram Jhula",
        "Evening Ganga Aarti",
        "Beatles Ashram",
      ],
    },
    {
      destination: "Sikkim",
      bestTime: "March to June, October to December",
      highlights: [
        "Tsomgo Lake",
        "Nathula Pass day trip",
        "MG Marg evening walk",
        "Rumtek Monastery",
      ],
    },
  ],
  Spiritual: [
    {
      destination: "Varanasi",
      bestTime: "October to March",
      highlights: [
        "Sunrise boat ride on the Ganges",
        "Evening Ganga Aarti at Dashashwamedh Ghat",
        "Kashi Vishwanath Temple",
        "Sarnath day trip",
      ],
    },
    {
      destination: "Rishikesh",
      bestTime: "September to April",
      highlights: [
        "Yoga and meditation retreats",
        "Evening Ganga Aarti",
        "Neelkanth Mahadev Temple",
        "Laxman Jhula",
      ],
    },
    {
      destination: "Amritsar",
      bestTime: "October to March",
      highlights: [
        "Golden Temple and langar hall",
        "Wagah Border ceremony",
        "Jallianwala Bagh",
        "Local Punjabi food trail",
      ],
    },
  ],
};

const ALL_MOCK_DESTINATIONS = Object.values(MOCK_DESTINATIONS_BY_TERRAIN).flat();

function dayCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  return Number.isFinite(days) && days > 0 ? days : 4;
}

function estimateBudgetRange(budget: number): string {
  const low = Math.round((budget * 0.85) / 1000) * 1000;
  const high = Math.round((budget * 1.05) / 1000) * 1000;
  return `₹${low.toLocaleString("en-IN")} - ₹${high.toLocaleString("en-IN")}`;
}

function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function buildMockCostBreakdown(budget: number): TripCostBreakdown {
  const transport = budget * 0.3;
  const accommodation = budget * 0.35;
  const food = budget * 0.2;
  const activities = budget * 0.15;

  return {
    transport: formatINR(transport),
    accommodation: formatINR(accommodation),
    food: formatINR(food),
    activities: formatINR(activities),
    total: formatINR(transport + accommodation + food + activities),
  };
}

function buildMockItinerary(
  destination: string,
  highlights: string[],
  days: number
): ItineraryDay[] {
  const clampedDays = Math.min(Math.max(days, 1), 7);

  return Array.from({ length: clampedDays }, (_, i) => {
    const day = i + 1;
    const isFirst = day === 1;
    const isLast = day === clampedDays && clampedDays > 1;
    const title = isFirst
      ? `Arrive in ${destination}`
      : isLast
        ? "Departure"
        : `Explore ${destination}`;
    const activities = highlights.length
      ? [highlights[(day - 1) % highlights.length]]
      : [`Free day to explore ${destination}`];

    return { day, title, activities };
  });
}

export function generateMockSuggestions(input: TripFormValues): TripSuggestion[] {
  const pool =
    input.terrain === "Any"
      ? ALL_MOCK_DESTINATIONS
      : MOCK_DESTINATIONS_BY_TERRAIN[input.terrain] ?? ALL_MOCK_DESTINATIONS;

  const days = dayCount(input.startDate, input.endDate);
  const duration = `${days} day${days === 1 ? "" : "s"}`;
  const estimatedBudget = estimateBudgetRange(input.budget);

  return pool.slice(0, 3).map((dest) => ({
    destination: dest.destination,
    reason: `A great ${input.vibe.toLowerCase()} pick for a ${input.groupType.toLowerCase()} trip from ${input.startingCity}, within your budget.`,
    bestTime: dest.bestTime,
    estimatedBudget,
    duration,
    tags: [input.vibe, input.terrain === "Any" ? "Versatile" : input.terrain],
    highlights: dest.highlights,
    costBreakdown: buildMockCostBreakdown(input.budget),
    itinerary: buildMockItinerary(dest.destination, dest.highlights, days),
  }));
}
