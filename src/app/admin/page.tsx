import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { AdminDashboardContent } from "./_components/admin-dashboard-content";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin-login");
  }

  return <AdminDashboardContent />;
}
