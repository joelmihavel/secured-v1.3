import Link from "next/link";

export default function OfferNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <h1 className="text-xl font-bold text-zinc-900">Offer not found</h1>
      <p className="mt-2 text-zinc-600">This offer may have been removed or the link is incorrect.</p>
      <Link
        href="/offers"
        className="mt-6 text-sm font-medium text-zinc-900 underline underline-offset-2"
      >
        Go home
      </Link>
    </div>
  );
}
