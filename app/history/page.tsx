import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: trips } = await supabase
    .from("trips")
    .select("id, destination, start_date, end_date, notes")
    .order("start_date", { ascending: false, nullsFirst: false });

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your trips</h1>
          <Link href="/plan" className="text-sm font-medium text-black underline">
            Plan a trip
          </Link>
        </div>

        {!trips || trips.length === 0 ? (
          <p className="text-sm text-gray-600">
            No trips yet. <Link href="/plan" className="underline">Plan one</Link>.
          </p>
        ) : (
          <ul className="space-y-3">
            {trips.map((trip) => (
              <li
                key={trip.id}
                className="rounded-md border border-gray-200 p-4 space-y-1"
              >
                <p className="font-medium">{trip.destination}</p>
                {(trip.start_date || trip.end_date) && (
                  <p className="text-sm text-gray-600">
                    {trip.start_date ?? "?"} &ndash; {trip.end_date ?? "?"}
                  </p>
                )}
                {trip.notes && (
                  <p className="text-sm text-gray-600">{trip.notes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
