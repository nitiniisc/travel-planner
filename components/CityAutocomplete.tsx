"use client";

import { useRef, useState, type FocusEvent } from "react";
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
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((city) => (
            <li key={city}>
              <button
                type="button"
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
