import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GROUP_TYPES, TERRAINS, VIBES, type TripFormValues } from "@/lib/trip-types";
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  generateMockSuggestions,
} from "@/lib/prompts/generate-trip";

function validate(body: Record<string, unknown>): TripFormValues | null {
  const {
    startDate,
    endDate,
    travelers,
    groupType,
    vibe,
    terrain,
    budget,
    startingCity,
    notes,
  } = body;

  if (typeof startDate !== "string" || !startDate) return null;
  if (typeof endDate !== "string" || !endDate) return null;
  if (typeof travelers !== "number" || travelers < 1) return null;
  if (typeof groupType !== "string" || !GROUP_TYPES.includes(groupType as never))
    return null;
  if (typeof vibe !== "string" || !VIBES.includes(vibe as never)) return null;
  if (typeof terrain !== "string" || !TERRAINS.includes(terrain as never))
    return null;
  if (typeof budget !== "number" || budget <= 0) return null;
  if (typeof startingCity !== "string" || !startingCity.trim()) return null;
  if (notes !== undefined && typeof notes !== "string") return null;

  return {
    startDate,
    endDate,
    travelers,
    groupType: groupType as TripFormValues["groupType"],
    vibe: vibe as TripFormValues["vibe"],
    terrain: terrain as TripFormValues["terrain"],
    budget,
    startingCity,
    notes: notes as string | undefined,
  };
}

async function generateWithOpenAI(input: TripFormValues) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI request failed with status ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);

  if (!Array.isArray(parsed.suggestions)) {
    throw new Error("Malformed response from model");
  }

  return parsed.suggestions;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const input = body ? validate(body) : null;

  if (!input) {
    return NextResponse.json(
      { error: "Invalid trip details. Please check the form and try again." },
      { status: 400 }
    );
  }

  try {
    const suggestions = process.env.OPENAI_API_KEY
      ? await generateWithOpenAI(input)
      : generateMockSuggestions(input);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate trip suggestions. Please try again." },
      { status: 500 }
    );
  }
}
