"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  RefreshCw,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { TripSuggestion } from "@/lib/trip-types";

interface Props {
  suggestion: TripSuggestion;
  onSave: () => void;
  onRegenerate: () => void;
  saving?: boolean;
  saved?: boolean;
}

export default function SuggestionCard({
  suggestion,
  onSave,
  onRegenerate,
  saving,
  saved,
}: Props) {
  const [open, setOpen] = useState(false);
  const hasDetails =
    !!suggestion.costBreakdown || (suggestion.itinerary?.length ?? 0) > 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="bg-gradient-to-br from-blue-600 via-teal-500 to-purple-500 px-5 py-6 text-white">
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-white/80">
          <Sparkles className="h-3.5 w-3.5" /> AI suggestion
        </div>
        <h3 className="mt-1 text-xl font-semibold">{suggestion.destination}</h3>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm text-gray-600">{suggestion.reason}</p>

        <div className="flex flex-wrap gap-2">
          {suggestion.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {suggestion.bestTime}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {suggestion.duration}
          </div>
          <div className="col-span-2 flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5" /> {suggestion.estimatedBudget}
          </div>
        </dl>

        <ul className="space-y-1.5 text-sm text-gray-600">
          {suggestion.highlights.slice(0, 5).map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              {highlight}
            </li>
          ))}
        </ul>

        {hasDetails && (
          <div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
            >
              View full details &amp; expenses
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="mt-3 space-y-4 rounded-xl bg-gray-50 p-4 text-sm">
                {suggestion.costBreakdown && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Cost breakdown
                    </p>
                    <dl className="grid grid-cols-2 gap-2 text-gray-600">
                      <div className="flex justify-between gap-2">
                        <dt>Transport</dt>
                        <dd className="font-medium">{suggestion.costBreakdown.transport}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Stay</dt>
                        <dd className="font-medium">{suggestion.costBreakdown.accommodation}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Food</dt>
                        <dd className="font-medium">{suggestion.costBreakdown.food}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Activities</dt>
                        <dd className="font-medium">{suggestion.costBreakdown.activities}</dd>
                      </div>
                      <div className="col-span-2 flex justify-between gap-2 border-t border-gray-200 pt-2">
                        <dt className="font-semibold text-gray-900">Total</dt>
                        <dd className="font-semibold text-gray-900">
                          {suggestion.costBreakdown.total}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}

                {suggestion.itinerary && suggestion.itinerary.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Day-by-day itinerary
                    </p>
                    <ol className="space-y-2">
                      {suggestion.itinerary.map((day) => (
                        <li key={day.day}>
                          <p className="font-medium text-gray-800">
                            Day {day.day}: {day.title}
                          </p>
                          <ul className="ml-4 list-disc text-gray-600">
                            {day.activities.map((activity) => (
                              <li key={activity}>{activity}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-2">
          <button
            onClick={onSave}
            disabled={saving || saved}
            className="flex-1 rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saved ? "Saved" : saving ? "Saving..." : "Save Trip"}
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center justify-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
