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
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Compass className="h-6 w-6" />
      </span>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      <Link
        href={ctaHref}
        className="mt-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
