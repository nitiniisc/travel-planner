"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PlanPage() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to plan a trip.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("trips").insert({
      user_id: user.id,
      destination,
      start_date: startDate || null,
      end_date: endDate || null,
      notes: notes || null,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setDestination("");
    setStartDate("");
    setEndDate("");
    setNotes("");
    setSuccess(true);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Plan a trip</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="destination" className="text-sm font-medium">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label htmlFor="start-date" className="text-sm font-medium">
                Start date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="flex-1 space-y-1">
              <label htmlFor="end-date" className="text-sm font-medium">
                End date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {error && (
            <p data-testid="form-error" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p data-testid="plan-success" className="text-sm text-green-600">
              Trip saved.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save trip"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          <Link href="/history" className="font-medium text-black underline">
            View your trips
          </Link>
        </p>
      </div>
    </div>
  );
}
