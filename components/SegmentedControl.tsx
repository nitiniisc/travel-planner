"use client";

interface Props<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: Props<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              selected
                ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md"
                : "border border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
