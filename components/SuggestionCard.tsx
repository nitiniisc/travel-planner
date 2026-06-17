import { Calendar, Clock, MapPin, RefreshCw, Sparkles, Wallet } from "lucide-react";
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
