import Link from "next/link";
import AdminForm from "./admin-form";
import AdminPasswordInput from "./admin-password-input";
import { isAdminAuthenticated } from "./auth";
import { loginAdmin, logoutAdmin } from "./actions";

type AdminPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const isAuthenticated = await isAdminAuthenticated();

  if (isAuthenticated) {
    return (
      <>
        <div className="mx-auto mt-4 flex w-full max-w-3xl items-center justify-end gap-2 px-4">
          <Link href="/offers/admin/dashboard" className="cta-button cta-button--sm">
            Offers Dashboard
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
        <AdminForm />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-flent-off-white px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-flent-pastel-brown bg-white p-6 shadow-sm">
        <Link href="/offers" className="text-sm font-semibold text-flent-brown underline">
          Back to home
        </Link>
        <div className="space-y-2">
          <h1 className="headline-display text-2xl font-bold text-flent-black">
            Supply Landlord Offers - Admin Login
          </h1>
          <p className="text-sm text-flent-brown">
            Enter the password to access the admin offer creation & offers dashboard.
          </p>
        </div>

        <form action={loginAdmin} className="space-y-4">
          <AdminPasswordInput />
          {params?.error === "invalid_password" && (
            <p className="text-sm font-medium text-red-700">Incorrect password.</p>
          )}
          <button type="submit" className="cta-button cta-button--sm w-full">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
