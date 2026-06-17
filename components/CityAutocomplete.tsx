"use client";

import { useRef, useState, type FocusEvent } from "react";
import { MapPin } from "lucide-react";
import { INDIAN_CITIES } from "@/lib/indian-cities";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CityAutocomplete({
  id,
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions =
    value.trim().length >= 2
      ? INDIAN_CITIES.filter((city) =>
          city.toLowerCase().startsWith(value.trim().toLowerCase())
        ).slice(0, 8)
      : [];

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className={className}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {suggestions.map((city) => (
            <li key={city}>
              <button
                type="button"
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
