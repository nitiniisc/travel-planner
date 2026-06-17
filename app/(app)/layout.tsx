import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-blue-50 via-white to-white">
      <AppHeader email={user.email ?? ""} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
