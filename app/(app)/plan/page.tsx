"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import TripPlannerForm from "@/components/TripPlannerForm";
import SuggestionCard from "@/components/SuggestionCard";
import SuggestionSkeleton from "@/components/SuggestionSkeleton";
import { useToast } from "@/components/Toast";
import { createClient } from "@/lib/supabase/client";
import type { TripFormValues, TripSuggestion } from "@/lib/trip-types";

export default function PlanPage() {
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<TripFormValues | null>(null);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIndexes, setSavedIndexes] = useState<Set<number>>(new Set());
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  async function generate(values: TripFormValues) {
    setFormValues(values);
    setLoading(true);
    setSuggestions([]);
    setSavedIndexes(new Set());

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json();

      if (!res.ok) {
        toast(body.error ?? "Something went wrong. Please try again.", "error");
        return;
      }

      setSuggestions(body.suggestions);
      toast(`Found ${body.suggestions.length} trip ideas for you.`, "success");
    } catch {
      toast("Could not reach the server. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(suggestion: TripSuggestion, index: number) {
    if (!formValues) return;
    setSavingIndex(index);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast("You must be logged in to save a trip.", "error");
      setSavingIndex(null);
      return;
    }

    const { error: insertError } = await supabase.from("trips").insert({
      user_id: user.id,
      destination: suggestion.destination,
      start_date: formValues.startDate,
      end_date: formValues.endDate,
      notes: formValues.notes ?? null,
      travelers: formValues.travelers,
      group_type: formValues.groupType,
      vibe: formValues.vibe,
      terrain: formValues.terrain,
      budget_inr: formValues.budget,
      starting_city: formValues.startingCity,
      reason: suggestion.reason,
      best_time: suggestion.bestTime,
      estimated_budget: suggestion.estimatedBudget,
      duration: suggestion.duration,
      tags: suggestion.tags,
      highlights: suggestion.highlights,
      cost_breakdown: suggestion.costBreakdown ?? null,
      itinerary: suggestion.itinerary ?? null,
    });

    setSavingIndex(null);

    if (insertError) {
      toast(insertError.message, "error");
      return;
    }

    setSavedIndexes((prev) => new Set(prev).add(index));
    toast(`${suggestion.destination} saved to your trips.`, "success");
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-lg">
          <Sparkles className="h-6 w-6" />
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">Plan a trip</h1>
        <p className="mt-2 text-sm text-gray-500">
          Tell us a bit about your trip and we&apos;ll suggest where to go.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <TripPlannerForm onSubmit={generate} loading={loading} />
      </div>

      {loading && (
        <div
          data-testid="suggestions-loading"
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2].map((i) => (
            <SuggestionSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={`${suggestion.destination}-${index}`}
              suggestion={suggestion}
              saving={savingIndex === index}
              saved={savedIndexes.has(index)}
              onSave={() => handleSave(suggestion, index)}
              onRegenerate={() => formValues && generate(formValues)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
