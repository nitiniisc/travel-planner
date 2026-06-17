import Link from "next/link";
import type { ReactNode } from "react";
import { Compass, Sparkles, Wallet } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <section className="rounded-3xl bg-gradient-to-br from-blue-600 via-teal-500 to-purple-500 px-6 py-16 text-center text-white shadow-sm sm:px-12">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Plan your next perfect trip with AI
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 sm:text-base">
          Get personalized travel suggestions based on your dates, budget, group
          type, vibe, and destination preference.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/plan"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
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
      </section>

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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
