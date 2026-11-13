import { redirect } from "next/navigation";
import { requirePageAdmin } from "@/lib/admin-session";

export default async function AdminPage() {
  await requirePageAdmin();
  redirect("/admin/dashboard");
}
