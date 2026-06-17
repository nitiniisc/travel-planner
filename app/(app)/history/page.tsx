import { createClient } from "@/lib/supabase/server";
import EmptyState from "@/components/EmptyState";
import TripCard from "@/components/TripCard";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: trips } = await supabase
    .from("trips")
    .select(
      "id, destination, start_date, end_date, notes, vibe, budget_inr, estimated_budget, reason, highlights, tags, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your trips</h1>

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
