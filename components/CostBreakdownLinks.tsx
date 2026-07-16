import { ExternalLink } from "lucide-react";
import type { CostBreakdownLinks as Links } from "@/lib/trip-types";

const LABELS: { key: keyof Links; label: string }[] = [
  { key: "transport", label: "Flights / Trains" },
  { key: "accommodation", label: "Hotels" },
  { key: "food", label: "Restaurants" },
  { key: "activities", label: "Activities" },
];

// Renders the real booking/search links so a user can verify the cost
// estimate against live prices. Renders nothing if no links are present.
export default function CostBreakdownLinks({ links }: { links?: Links | null }) {
  if (!links) return null;
  const items = LABELS.filter(({ key }) => links[key]);
  if (items.length === 0) return null;

  return (
    <div className="col-span-2 mt-1 border-t border-gray-200 pt-2">
      <p className="mb-1.5 text-[11px] text-gray-400">
        Check live prices & deals:
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map(({ key, label }) => (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
          >
            {label}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
