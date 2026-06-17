"use client";

import { useState } from "react";
import TripPlannerForm from "@/components/TripPlannerForm";
import SuggestionCard from "@/components/SuggestionCard";
import LoadingState from "@/components/LoadingState";
import { createClient } from "@/lib/supabase/client";
import type { TripFormValues, TripSuggestion } from "@/lib/trip-types";

export default function PlanPage() {
  const [formValues, setFormValues] = useState<TripFormValues | null>(null);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedIndexes, setSavedIndexes] = useState<Set<number>>(new Set());
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  async function generate(values: TripFormValues) {
    setFormValues(values);
    setLoading(true);
    setError(null);
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
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuggestions(body.suggestions);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(suggestion: TripSuggestion, index: number) {
    if (!formValues) return;
    setSavingIndex(index);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to save a trip.");
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
      setError(insertError.message);
      return;
    }

    setSavedIndexes((prev) => new Set(prev).add(index));
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Plan a trip</h1>
        <p className="mt-2 text-sm text-gray-500">
          Tell us a bit about your trip and we&apos;ll suggest where to go.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <TripPlannerForm onSubmit={generate} loading={loading} />
      </div>

      {error && (
        <p data-testid="form-error" className="mt-6 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {loading && <LoadingState message="Generating your trip ideas..." />}

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
