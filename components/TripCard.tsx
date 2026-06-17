"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Sparkles, Wallet } from "lucide-react";
import type { ItineraryDay, TripCostBreakdown } from "@/lib/trip-types";

export interface TripRow {
  id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  vibe: string | null;
  budget_inr: number | null;
  estimated_budget: string | null;
  reason: string | null;
  highlights: string[] | null;
  tags: string[] | null;
  cost_breakdown: TripCostBreakdown | null;
  itinerary: ItineraryDay[] | null;
  created_at: string;
}

export default function TripCard({ trip }: { trip: TripRow }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-900">{trip.destination}</p>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
            {(trip.start_date || trip.end_date) && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {trip.start_date ?? "?"} &ndash; {trip.end_date ?? "?"}
              </span>
            )}
            {(trip.budget_inr || trip.estimated_budget) && (
              <span className="flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" />
                {trip.estimated_budget ?? `₹${trip.budget_inr}`}
              </span>
            )}
            {trip.vibe && (
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {trip.vibe}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Saved {new Date(trip.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 whitespace-nowrap rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          View Details
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
          {trip.reason && <p>{trip.reason}</p>}
          {trip.notes && <p className="italic text-gray-500">&ldquo;{trip.notes}&rdquo;</p>}
          {trip.tags && trip.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {trip.highlights && trip.highlights.length > 0 && (
            <ul className="list-disc space-y-1 pl-5">
              {trip.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}

          {trip.cost_breakdown && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cost breakdown
              </p>
              <dl className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-3">
                <div className="flex justify-between gap-2">
                  <dt>Transport</dt>
                  <dd className="font-medium">{trip.cost_breakdown.transport}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Stay</dt>
                  <dd className="font-medium">{trip.cost_breakdown.accommodation}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Food</dt>
                  <dd className="font-medium">{trip.cost_breakdown.food}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Activities</dt>
                  <dd className="font-medium">{trip.cost_breakdown.activities}</dd>
                </div>
                <div className="col-span-2 flex justify-between gap-2 border-t border-gray-200 pt-2">
                  <dt className="font-semibold text-gray-900">Total</dt>
                  <dd className="font-semibold text-gray-900">{trip.cost_breakdown.total}</dd>
                </div>
              </dl>
            </div>
          )}

          {trip.itinerary && trip.itinerary.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Day-by-day itinerary
              </p>
              <ol className="space-y-2">
                {trip.itinerary.map((day) => (
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
    </li>
  );
}
