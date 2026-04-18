import { redirect } from "next/navigation";

export default async function AdminGoogleCallbackPage() {
  redirect("/admin-login");
}
