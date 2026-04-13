import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/app/offers/_lib/supabase/server";

type ResendWebhookEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    created_at?: string;
    click?: {
      timestamp?: string;
      link?: string;
    };
  };
};

function toIsoOrNull(maybeIso: unknown): string | null {
  if (typeof maybeIso !== "string" || !maybeIso) return null;
  const d = new Date(maybeIso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendWebhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!resendApiKey) {
    return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  }
  if (!resendWebhookSecret) {
    return NextResponse.json(
      { error: "Missing RESEND_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  let payload: string;
  try {
    // IMPORTANT: raw body is required for signature verification.
    payload = await request.text();
  } catch {
    return NextResponse.json({ error: "Unable to read request body" }, { status: 400 });
  }

  const resend = new Resend(resendApiKey);

  const headers = {
    id: request.headers.get("svix-id") ?? "",
    timestamp: request.headers.get("svix-timestamp") ?? "",
    signature: request.headers.get("svix-signature") ?? "",
  };

  let verified: ResendWebhookEvent;
  try {
    verified = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret: resendWebhookSecret,
    }) as ResendWebhookEvent;
  } catch (e) {
    console.error("resend webhook: signature verification failed:", e);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const eventType = verified?.type;
  const emailId = verified?.data?.email_id;

  if (!eventType || !emailId) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServerClient();

  if (eventType === "email.opened") {
    const openedAtIso = toIsoOrNull(verified.data?.created_at ?? verified.created_at);
    if (!openedAtIso) return NextResponse.json({ ok: true });

    // Update whichever column matches the message id (idempotent).
    const { error: firstOpenedUpdateError } = await supabase
      .from("offers")
      .update({ first_email_opened_at: openedAtIso })
      .eq("first_email_message_id", emailId)
      .is("first_email_opened_at", null);

    if (firstOpenedUpdateError) {
      console.error(
        "resend webhook: failed to update first_email_opened_at:",
        firstOpenedUpdateError
      );
    }

    const { error: agreeOpenedUpdateError } = await supabase
      .from("offers")
      .update({ agree_email_opened_at: openedAtIso })
      .eq("agree_email_message_id", emailId)
      .is("agree_email_opened_at", null);

    if (agreeOpenedUpdateError) {
      console.error(
        "resend webhook: failed to update agree_email_opened_at:",
        agreeOpenedUpdateError
      );
    }
  } else if (eventType === "email.clicked") {
    const clickedAtIso = toIsoOrNull(verified.data?.click?.timestamp);
    const clickedUrl = verified.data?.click?.link;
    if (!clickedAtIso) return NextResponse.json({ ok: true });

    const { error: firstClickedUpdateError } = await supabase
      .from("offers")
      .update({
        first_email_clicked_at: clickedAtIso,
        first_email_clicked_url: clickedUrl ?? null,
      })
      .eq("first_email_message_id", emailId)
      .is("first_email_clicked_at", null);

    if (firstClickedUpdateError) {
      console.error(
        "resend webhook: failed to update first_email_clicked_at:",
        firstClickedUpdateError
      );
    }

    const { error: agreeClickedUpdateError } = await supabase
      .from("offers")
      .update({
        agree_email_clicked_at: clickedAtIso,
        agree_email_clicked_url: clickedUrl ?? null,
      })
      .eq("agree_email_message_id", emailId)
      .is("agree_email_clicked_at", null);

    if (agreeClickedUpdateError) {
      console.error(
        "resend webhook: failed to update agree_email_clicked_at:",
        agreeClickedUpdateError
      );
    }
  }

  return NextResponse.json({ ok: true });
}
