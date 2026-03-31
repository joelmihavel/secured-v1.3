import Link from "next/link";
import { redirect } from "next/navigation";
import AdminOffersTrackingTable from "../admin-offers-tracking-table";
import { isAdminAuthenticated } from "../auth";
import { logoutAdmin } from "../actions";

export default async function AdminDashboardPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/offers/admin");
  }

  return (
    <main className="min-h-screen bg-flent-off-white pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6">
        <div className="flex flex-col gap-4 border-b border-flent-pastel-brown/50 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <span className="eyebrow-pill inline-flex bg-flent-pastel-brown/35 text-flent-brown">
              Admin
            </span>
            <div className="space-y-1">
              <h1 className="headline-display text-3xl font-bold tracking-tight text-flent-black md:text-4xl">
                Offers dashboard
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-flent-brown">
                Track every offer sent to landlords: who created it, commercial terms, and delivery
                status across email and onboarding.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pt-1">
            <Link href="/offers/admin" className="cta-button cta-button--sm">
              Back to admin
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-md border border-flent-pastel-brown px-3 py-1.5 text-xs font-semibold text-flent-brown hover:border-flent-brown"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8">
          <AdminOffersTrackingTable />
        </div>
      </div>
    </main>
  );
}
