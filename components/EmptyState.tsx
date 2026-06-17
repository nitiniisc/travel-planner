import Link from "next/link";
import { Compass } from "lucide-react";

export default function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-300 bg-white/70 px-6 py-16 text-center shadow-sm backdrop-blur-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
        <Compass className="h-7 w-7" />
      </span>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      <Link
        href={ctaHref}
        className="mt-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
