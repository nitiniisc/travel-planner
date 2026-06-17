import { Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import EmptyState from "@/components/EmptyState";
import TripCard from "@/components/TripCard";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: trips } = await supabase
    .from("trips")
    .select(
      "id, destination, start_date, end_date, notes, vibe, budget_inr, estimated_budget, reason, highlights, tags, cost_breakdown, itinerary, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
          <Compass className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your trips</h1>
      </div>

      <div className="mt-8">
        {!trips || trips.length === 0 ? (
          <EmptyState
            title="No saved trips yet."
            description="Start planning your first AI-powered trip."
            ctaHref="/plan"
            ctaLabel="Plan a Trip"
          />
        ) : (
          <ul className="space-y-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
