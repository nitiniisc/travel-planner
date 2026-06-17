import { Loader2 } from "lucide-react";

export default function LoadingState({ message }: { message: string }) {
  return (
    <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-3xl border border-white/60 bg-white/80 px-6 py-12 text-center shadow-lg backdrop-blur-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
        <Loader2 className="h-6 w-6 animate-spin" />
      </span>
      <p className="text-sm font-medium text-gray-700">{message}</p>
    </div>
  );
}
