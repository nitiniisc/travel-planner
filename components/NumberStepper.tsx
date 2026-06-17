"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function NumberStepper({ id, value, onChange, min = 1, max = 20 }: Props) {
  function clamp(n: number) {
    return Math.max(min, Math.min(max, n));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }}
        className="w-16 rounded-xl border border-gray-300 bg-white px-2 py-2.5 text-center text-sm shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-500/30"
      />
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
