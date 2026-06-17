import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Signed in as {user.email}</p>
      </div>
    </div>
  );
}
