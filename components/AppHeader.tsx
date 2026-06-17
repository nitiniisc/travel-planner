"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plane, X } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan", label: "Plan Trip" },
  { href: "/history", label: "History" },
];

export default function AppHeader({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
            <Plane className="h-4 w-4" />
          </span>
          TripWise AI
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-gray-600 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 transition ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="text-sm text-gray-500">{email}</span>
          <LogoutButton />
        </div>

        <button
          aria-label="Toggle menu"
          className="text-gray-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-500">{email}</span>
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  );
}
