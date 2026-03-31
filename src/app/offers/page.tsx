import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <h1 className="text-2xl font-bold text-zinc-900">Flent</h1>
      <p className="mt-2 text-zinc-600">Supply - Create Offer for New Landlords.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/offers/admin" className="cta-button">
          Admin – Create Offer
        </Link>
      </div>
    </div>
  );
}
