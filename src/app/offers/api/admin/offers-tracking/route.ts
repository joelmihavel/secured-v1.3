import { NextResponse } from "next/server";
import { createServerClient } from "@/app/offers/_lib/supabase/server";
import { isAdminAuthenticated } from "@/app/offers/admin/auth";

export async function GET(req: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);
  const creator = (searchParams.get("creator") ?? "").trim();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count: totalCount, error: totalCountError } = await supabase
    .from("offers")
    .select("id", { count: "exact", head: true });

  if (totalCountError) {
    return NextResponse.json({ error: totalCountError.message }, { status: 500 });
  }

  const { count: pendingCount, error: pendingCountError } = await supabase
    .from("offers")
    .select("id", { count: "exact", head: true })
    .eq("agreed", false);

  if (pendingCountError) {
    return NextResponse.json({ error: pendingCountError.message }, { status: 500 });
  }

  const { count: acceptedCount, error: acceptedCountError } = await supabase
    .from("offers")
    .select("id", { count: "exact", head: true })
    .eq("agreed", true);

  if (acceptedCountError) {
    return NextResponse.json({ error: acceptedCountError.message }, { status: 500 });
  }

  const counts = {
    total: totalCount ?? 0,
    pending: pendingCount ?? 0,
    accepted: acceptedCount ?? 0,
  };

  let creatorCounts:
    | { total: number; pending: number; accepted: number }
    | undefined;

  if (creator) {
    const { count: creatorPendingCount, error: creatorPendingError } = await supabase
      .from("offers")
      .select("id", { count: "exact", head: true })
      .eq("created_by", creator)
      .eq("agreed", false);

    if (creatorPendingError) {
      return NextResponse.json({ error: creatorPendingError.message }, { status: 500 });
    }

    const { count: creatorAcceptedCount, error: creatorAcceptedError } = await supabase
      .from("offers")
      .select("id", { count: "exact", head: true })
      .eq("created_by", creator)
      .eq("agreed", true);

    if (creatorAcceptedError) {
      return NextResponse.json({ error: creatorAcceptedError.message }, { status: 500 });
    }

    creatorCounts = {
      total: (creatorPendingCount ?? 0) + (creatorAcceptedCount ?? 0),
      pending: creatorPendingCount ?? 0,
      accepted: creatorAcceptedCount ?? 0,
    };
  }

  return NextResponse.json({
    offers: data ?? [],
    counts,
    creatorCounts: creatorCounts ?? null,
  });
}
