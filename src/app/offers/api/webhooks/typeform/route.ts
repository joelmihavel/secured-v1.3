import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/app/offers/_lib/supabase/server";

type TypeformWebhookEvent = {
  event_id?: string;
  event_type?: string;
  form_response?: {
    token?: string;
    submitted_at?: string;
    landed_at?: string;
    answers?: Array<
      | {
          type?: string;
          email?: string;
        }
      | Record<string, unknown>
    >;
  };
};

function getEmailFromAnswers(answers: unknown): string | null {
  if (!Array.isArray(answers)) return null;
  for (const a of answers) {
    if (!a || typeof a !== "object") continue;
    const maybe = a as { type?: string; email?: unknown };
    if (maybe.type === "email" && typeof maybe.email === "string" && maybe.email) {
      return maybe.email;
    }
  }
  return null;
}

function verifyTypeformSignature(payload: string, receivedSignature: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const digest = hmac.digest("base64");
  const expected = `sha256=${digest}`;
  return crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expected));
}

export async function POST(request: Request) {
  const payload = await request.text();
  const secret = process.env.TYPEFORM_WEBHOOK_SECRET;

  if (secret) {
    const received =
      request.headers.get("Typeform-Signature") ?? request.headers.get("typeform-signature");
    if (!received) {
      return NextResponse.json({ error: "Missing Typeform signature header" }, { status: 400 });
    }

    try {
      const ok = verifyTypeformSignature(payload, received, secret);
      if (!ok) {
        return NextResponse.json({ error: "Invalid Typeform signature" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid Typeform signature" }, { status: 400 });
    }
  }

  let event: TypeformWebhookEvent;
  try {
    event = JSON.parse(payload) as TypeformWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (event.event_type !== "form_response") {
    return NextResponse.json({ ok: true });
  }

  const formResponse = event.form_response;
  const landlordEmail = getEmailFromAnswers(formResponse?.answers);
  if (!landlordEmail) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServerClient();
  const { data: offerRow } = await supabase
    .from("offers")
    .select("id")
    .eq("landlord_email", landlordEmail)
    .eq("agreed", true)
    .eq("onboarding_completed", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!offerRow?.id) {
    return NextResponse.json({ ok: true });
  }

  const onboardingCompletedAtIso = new Date().toISOString();
  const typeformToken = formResponse?.token ?? null;

  const { error: updateError } = await supabase
    .from("offers")
    .update({
      onboarding_completed: true,
      onboarding_completed_at: onboardingCompletedAtIso,
      onboarding_typeform_token: typeformToken,
    })
    .eq("id", offerRow.id)
    .eq("onboarding_completed", false);

  if (updateError) {
    console.error("typeform webhook: failed to update offer:", updateError);
  }

  return NextResponse.json({ ok: true });
}
