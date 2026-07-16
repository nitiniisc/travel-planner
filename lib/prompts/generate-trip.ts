import type {
  CostBreakdownLinks,
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
* Preferred destination: ${input.destination || "None (suggest the best options)"}
* Optional notes: ${input.notes || "None"}

Return 3 highly relevant travel suggestions.

Rules:

* If the user gave a preferred destination, make the first suggestion that exact destination (or its immediate region), then offer 2 relevant alternatives.
* Prefer realistic Indian travel destinations unless the user clearly asks for international travel.
* Keep the suggestions practical for the given budget.
* Consider travel time from the starting city.
* Match the destination to the group type, vibe, terrain, dates, and budget.
* Do not suggest unsafe or unrealistic trips.
* Give clear, useful, non-generic recommendations.
* Include a realistic cost breakdown (transport, accommodation, food, activities, total) that adds up close to the total budget.
* Include real booking/search links (costBreakdown.links) the user can open to verify the estimate against live prices — e.g. a flight/train search from the starting city, a hotel search for the destination and dates, a restaurants search, and an activities/tours search. Use real booking sites (Google Flights, Booking.com, Google Maps, GetYourGuide, MakeMyTrip, etc.) with the destination, dates and traveler count filled into the URL.
* Include a day-by-day itinerary matching the trip duration. Every day must be distinct: do NOT repeat the same place or activity on multiple days. Give each day a specific title and 2-3 concrete activities (ideally morning / afternoon / evening).
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
"total": "string",
"links": {
"transport": "https://...",
"accommodation": "https://...",
"food": "https://...",
"activities": "https://..."
}
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

// Build real, working search links per cost category so the user can open
// them and check the estimate against live prices. Booking.com takes the
// exact dates and guest count; the others are reliable destination searches.
function buildBookingLinks(
  input: TripFormValues,
  destination: string
): CostBreakdownLinks {
  const dest = encodeURIComponent(destination);
  const origin = encodeURIComponent(input.startingCity);
  const adults = Math.max(1, input.travelers);

  return {
    transport: `https://www.google.com/travel/flights?q=${encodeURIComponent(
      `flights from ${input.startingCity} to ${destination} on ${input.startDate}`
    )}`,
    accommodation: `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${input.startDate}&checkout=${input.endDate}&group_adults=${adults}`,
    food: `https://www.google.com/maps/search/${encodeURIComponent(
      `best restaurants in ${destination}`
    )}`,
    activities: `https://www.getyourguide.com/s/?q=${dest}&searchSource=all`,
  };
}

function buildMockCostBreakdown(
  input: TripFormValues,
  destination: string
): TripCostBreakdown {
  const budget = input.budget;
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
    links: buildBookingLinks(input, destination),
  };
}

// Varied filler content so longer trips never repeat a day. Indexed by day so
// each day pulls a different theme/afternoon/evening.
const FILLER_THEMES = [
  "Local markets & cafes",
  "Hidden gems & viewpoints",
  "Leisure & short day trip",
  "Culture & local life",
  "Nature & slow morning",
  "Food trail & shopping",
];

const AFTERNOON_OPTIONS = [
  "Explore nearby markets and local cafes",
  "Relax and soak in the scenery at your own pace",
  "Take an optional guided tour of a nearby spot",
  "Wander the lanes and pick up local handicrafts",
  "Short day trip to a nearby attraction",
  "Unwind with a spa session or a lazy afternoon",
];

const EVENING_OPTIONS = [
  "Dinner at a highly-rated local restaurant",
  "Catch the sunset at a scenic viewpoint",
  "Stroll the main promenade and try street food",
  "Enjoy a cultural show or live music",
  "Cafe-hopping and people-watching",
  "Quiet evening walk and local dessert",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function buildMockItinerary(
  destination: string,
  highlights: string[],
  input: TripFormValues,
  days: number
): ItineraryDay[] {
  const clampedDays = Math.min(Math.max(days, 1), 10);

  if (clampedDays === 1) {
    return [
      {
        day: 1,
        title: `A day in ${destination}`,
        activities: [
          `Morning: Arrive in ${destination} from ${input.startingCity} and freshen up`,
          `Afternoon: ${highlights[0] ?? `Explore the heart of ${destination}`}`,
          `Evening: ${pick(EVENING_OPTIONS, 0)}`,
        ],
      },
    ];
  }

  // Middle days each get a distinct highlight as the anchor; once highlights
  // run out we fall back to varied themed days so nothing repeats.
  return Array.from({ length: clampedDays }, (_, i) => {
    const day = i + 1;
    const isFirst = day === 1;
    const isLast = day === clampedDays;

    if (isFirst) {
      return {
        day,
        title: `Arrive in ${destination}`,
        activities: [
          `Morning: Travel from ${input.startingCity} to ${destination}`,
          "Afternoon: Check in, settle down and get oriented",
          `Evening: ${pick(EVENING_OPTIONS, 0)}`,
        ],
      };
    }

    if (isLast) {
      return {
        day,
        title: "Departure",
        activities: [
          "Morning: Relaxed breakfast and last-minute local shopping",
          `Afternoon: Check out and travel back to ${input.startingCity}`,
        ],
      };
    }

    // middleIndex counts explorable days (day 2 => 0, day 3 => 1, ...)
    const middleIndex = day - 2;
    const anchor = highlights[middleIndex];

    return {
      day,
      title: anchor ?? pick(FILLER_THEMES, middleIndex - highlights.length),
      activities: [
        `Morning: ${anchor ?? pick(AFTERNOON_OPTIONS, middleIndex)}`,
        `Afternoon: ${pick(AFTERNOON_OPTIONS, middleIndex + 1)}`,
        `Evening: ${pick(EVENING_OPTIONS, middleIndex + 1)}`,
      ],
    };
  });
}

export function generateMockSuggestions(input: TripFormValues): TripSuggestion[] {
  const terrainPool =
    input.terrain === "Any"
      ? ALL_MOCK_DESTINATIONS
      : MOCK_DESTINATIONS_BY_TERRAIN[input.terrain] ?? ALL_MOCK_DESTINATIONS;

  // If the user named a destination, lead with it. Reuse our curated data
  // when we recognise the place, otherwise build a sensible generic entry.
  let pool = terrainPool;
  const wanted = input.destination?.trim();
  if (wanted) {
    const known = ALL_MOCK_DESTINATIONS.find(
      (d) => d.destination.toLowerCase() === wanted.toLowerCase()
    );
    const requested: MockDestination = known ?? {
      destination: wanted,
      bestTime: "Year-round (check local weather)",
      highlights: [
        `Explore the highlights of ${wanted}`,
        `Try the local food scene in ${wanted}`,
        `Visit the most popular landmarks near ${wanted}`,
        `Relax and soak in the atmosphere of ${wanted}`,
      ],
    };
    const rest = terrainPool.filter(
      (d) => d.destination.toLowerCase() !== wanted.toLowerCase()
    );
    pool = [requested, ...rest];
  }

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
    costBreakdown: buildMockCostBreakdown(input, dest.destination),
    itinerary: buildMockItinerary(dest.destination, dest.highlights, input, days),
  }));
}
