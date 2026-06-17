import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import BackgroundBlobs from "@/components/BackgroundBlobs";

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
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      <BackgroundBlobs />
      <AppHeader email={user.email ?? ""} />
      <main className="relative flex flex-1 flex-col">{children}</main>
    </div>
  );
}
