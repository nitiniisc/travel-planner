import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Calendar, Compass, MapPin, Sparkles, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: recentTrips, count } = await supabase
    .from("trips")
    .select("id, destination, start_date, end_date, vibe, estimated_budget", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .limit(3);

  const firstName = user?.email?.split("@")[0] ?? "traveler";
  const tripCount = count ?? 0;
  const hasTrips = (recentTrips?.length ?? 0) > 0;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-teal-500 to-purple-500 px-6 py-16 text-center text-white shadow-2xl sm:px-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Plan your next perfect trip with AI
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 sm:text-base">
            {hasTrips
              ? `Welcome back, ${firstName}. You've planned ${tripCount} trip${tripCount === 1 ? "" : "s"} so far.`
              : "Get personalized travel suggestions based on your dates, budget, group type, vibe, and destination preference."}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/plan"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Create New Trip
            </Link>
            <Link
              href="/history"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Trip History
            </Link>
          </div>
        </div>
      </section>

      {hasTrips ? (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent trips</h2>
            <Link
              href="/history"
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {recentTrips!.map((trip) => (
              <Link
                key={trip.id}
                href="/history"
                className="group rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-semibold text-gray-900">{trip.destination}</h3>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  {(trip.start_date || trip.end_date) && (
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {trip.start_date ?? "?"} &ndash; {trip.end_date ?? "?"}
                    </p>
                  )}
                  {trip.estimated_budget && (
                    <p className="flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5" />
                      {trip.estimated_budget}
                    </p>
                  )}
                  {trip.vibe && (
                    <p className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      {trip.vibe}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 grid gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" />}
            title="AI-powered destination suggestions"
            description="Personalized picks based on your dates, budget, group, and travel vibe."
          />
          <FeatureCard
            icon={<Wallet className="h-5 w-5" />}
            title="Budget-aware planning"
            description="Every suggestion respects the budget you set, no surprises."
          />
          <FeatureCard
            icon={<Compass className="h-5 w-5" />}
            title="Save and revisit trip plans"
            description="Keep a history of every trip you've planned and pick up where you left off."
          />
        </section>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-md backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
