"use client";

import { useState, type ReactNode } from "react";
import {
  Calendar,
  Heart,
  MapPin,
  Mountain,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import {
  GROUP_TYPES,
  TERRAINS,
  VIBES,
  type GroupType,
  type Terrain,
  type TripFormValues,
  type Vibe,
} from "@/lib/trip-types";
import CityAutocomplete from "@/components/CityAutocomplete";
import SegmentedControl from "@/components/SegmentedControl";
import NumberStepper from "@/components/NumberStepper";

interface Props {
  onSubmit: (values: TripFormValues) => void;
  loading: boolean;
}

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:shadow-md focus:ring-2 focus:ring-blue-500/30";

const BUDGET_PRESETS = [15000, 25000, 40000, 60000, 100000];

function Field({
  id,
  label,
  icon,
  helper,
  error,
  children,
}: {
  id: string;
  label: string;
  icon?: ReactNode;
  helper?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
      >
        {icon}
        {label}
      </label>
      {children}
      {helper && !error && <p className="text-xs text-gray-400">{helper}</p>}
      {error && (
        <p data-testid="form-error" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function TripPlannerForm({ onSubmit, loading }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [groupType, setGroupType] = useState<GroupType>("Couple");
  const [vibe, setVibe] = useState<Vibe>("Relaxing");
  const [terrain, setTerrain] = useState<Terrain>("Any");
  const [budget, setBudget] = useState("");
  const [startingCity, setStartingCity] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!startDate) e.startDate = "Start date is required.";
    if (!endDate) e.endDate = "End date is required.";
    if (startDate && endDate && endDate < startDate) {
      e.endDate = "End date must be on or after the start date.";
    }
    if (!travelers || travelers < 1) {
      e.travelers = "At least 1 traveler.";
    }
    if (!budget || Number(budget) <= 0) {
      e.budget = "Enter a budget greater than 0.";
    }
    if (!startingCity.trim()) {
      e.startingCity = "Starting city is required.";
    }
    return e;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      startDate,
      endDate,
      travelers,
      groupType,
      vibe,
      terrain,
      budget: Number(budget),
      startingCity,
      notes: notes || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="start-date" label="Start date" icon={<Calendar className="h-4 w-4" />} error={errors.startDate}>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field id="end-date" label="End date" icon={<Calendar className="h-4 w-4" />} error={errors.endDate}>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field id="travelers" label="Number of travelers" icon={<Users className="h-4 w-4" />} error={errors.travelers}>
          <NumberStepper id="travelers" value={travelers} onChange={setTravelers} min={1} max={20} />
        </Field>

        <Field id="starting-city" label="Starting city" icon={<MapPin className="h-4 w-4" />} error={errors.startingCity}>
          <CityAutocomplete
            id="starting-city"
            placeholder="e.g. Bengaluru"
            value={startingCity}
            onChange={setStartingCity}
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="group-type" label="Group type" icon={<Heart className="h-4 w-4" />}>
        <SegmentedControl
          ariaLabel="Group type"
          options={GROUP_TYPES}
          value={groupType}
          onChange={setGroupType}
        />
      </Field>

      <Field id="vibe" label="Travel vibe" icon={<Sparkles className="h-4 w-4" />}>
        <SegmentedControl ariaLabel="Travel vibe" options={VIBES} value={vibe} onChange={setVibe} />
      </Field>

      <Field id="terrain" label="Terrain preference" icon={<Mountain className="h-4 w-4" />}>
        <SegmentedControl
          ariaLabel="Terrain preference"
          options={TERRAINS}
          value={terrain}
          onChange={setTerrain}
        />
      </Field>

      <Field id="budget" label="Budget (INR)" icon={<Wallet className="h-4 w-4" />} error={errors.budget}>
        <input
          id="budget"
          type="number"
          min={0}
          placeholder="e.g. 40000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={inputClass}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {BUDGET_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setBudget(String(preset))}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                budget === String(preset)
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              ₹{preset.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
      </Field>

      <Field id="notes" label="Anything specific you want?" helper="Optional">
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. avoid long flights, want a spa day, traveling with kids..."
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-50"
      >
        {loading ? "Generating your trip ideas..." : "Generate trip ideas"}
      </button>
    </form>
  );
}
