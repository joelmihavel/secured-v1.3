"use client";

import { useState } from "react";
import { Button } from "@/app/offers/_components/ui/button";
import { Input } from "@/app/offers/_components/ui/input";
import { Label } from "@/app/offers/_components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/offers/_components/ui/card";
import { Checkbox } from "@/app/offers/_components/ui/checkbox";
import { DEFAULT_TERMS } from "@/app/offers/_lib/constants";
import { createOffer } from "./actions";
import type { OfferInsert } from "@/app/offers/_types/offer";
import { Plus, Copy } from "lucide-react";
import Link from "next/link";

const SUPPLY_TEAM_CREATORS = [
  "Raghav Malhotra",
  "Ashish Oberoi",
  "Shubh Goel",
  "Amit Nicodemus",
  "Tanmay Rakshe",
] as const;

/** Matches `Input` styling for native selects. */
const INPUT_LIKE_SELECT =
  "flex h-10 w-full cursor-pointer rounded-[8px] border border-flent-pastel-brown bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-flent-forest focus-visible:ring-2 focus-visible:ring-flent-forest/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const FURNISHING_OPTIONS = [
  "Unfurnished",
  "Partially Furnished",
  "Fully Furnished",
] as const;

const RENT_FREE_NONE = "__none__";

const initialForm: Record<string, string> = {
  landlord_name: "",
  landlord_email: "",
  property_name: "",
  property_type: "",
  parking: "",
  rent_amount: "",
  security_deposit: "",
  key_handover_date: "",
  rent_start_date: "",
  lock_in: "",
};

export default function AdminForm() {
  const [form, setForm] = useState(initialForm);
  const [furnishingState, setFurnishingState] = useState("");
  const [serviceTermChoice, setServiceTermChoice] = useState<
    "11" | "22" | "33" | "custom"
  >("11");
  const [serviceTermCustomMonths, setServiceTermCustomMonths] = useState("");
  const [rentFreeDays, setRentFreeDays] = useState(RENT_FREE_NONE);
  const [rentIncrementPct, setRentIncrementPct] = useState("");
  const [noticePeriodChoice, setNoticePeriodChoice] = useState("1 month");

  const [creatorName, setCreatorName] = useState("");
  const [selectedTerms, setSelectedTerms] = useState<string[]>(() =>
    Array.from(DEFAULT_TERMS)
  );
  const [customTerm, setCustomTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastOfferUrl, setLastOfferUrl] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isPresetCreator = SUPPLY_TEAM_CREATORS.some((name) => name === creatorName);

  const toggleTerm = (term: string, checked: boolean) => {
    setSelectedTerms((prev) =>
      checked ? [...prev, term] : prev.filter((t) => t !== term)
    );
  };

  const addCustomTerm = () => {
    const t = customTerm.trim();
    if (t && !selectedTerms.includes(t)) {
      setSelectedTerms((prev) => [...prev, t]);
      setCustomTerm("");
    }
  };

  const onRentIncrementInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const firstDotIndex = cleaned.indexOf(".");
    if (firstDotIndex === -1) {
      setRentIncrementPct(cleaned);
      return;
    }
    const normalized =
      cleaned.slice(0, firstDotIndex + 1) +
      cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
    setRentIncrementPct(normalized);
  };

  const buildServiceTerm = (): string | null => {
    if (serviceTermChoice === "custom") {
      const n = Number(serviceTermCustomMonths.replace(/\D/g, ""));
      if (!Number.isFinite(n) || n <= 0) return null;
      const rounded = Math.round(n);
      return `${rounded} months`;
    }
    return `${serviceTermChoice} months`;
  };

  const buildRentFreePeriod = (): string =>
    rentFreeDays === RENT_FREE_NONE ? "None" : `${rentFreeDays} days`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMessage(null);
    setLastOfferUrl(null);
    setCopyFeedback(false);
    setSubmitting(true);

    const normalizedCreatorName = creatorName.trim();
    if (!normalizedCreatorName) {
      setError("Please select or enter the offer creator's name.");
      setSubmitting(false);
      return;
    }

    if (!furnishingState) {
      setError("Please select a furnishing state.");
      setSubmitting(false);
      return;
    }

    const serviceTerm = buildServiceTerm();
    if (!serviceTerm) {
      setError("Please enter a valid number of months for the custom service term.");
      setSubmitting(false);
      return;
    }

    if (rentIncrementPct === "") {
      setError("Please enter the rent increment percentage.");
      setSubmitting(false);
      return;
    }

    const payload: OfferInsert = {
      landlord_name: form.landlord_name,
      landlord_email: form.landlord_email,
      created_by: normalizedCreatorName,
      property_name: form.property_name,
      property_type: form.property_type,
      furnishing_state: furnishingState,
      parking: form.parking,
      rent_amount: Number(form.rent_amount),
      security_deposit: Number(form.security_deposit),
      service_term: serviceTerm,
      rent_increment: `${rentIncrementPct}%`,
      key_handover_date: form.key_handover_date,
      rent_free_period: buildRentFreePeriod(),
      rent_start_date: form.rent_start_date,
      lock_in: form.lock_in,
      notice_period: noticePeriodChoice,
      selected_terms: selectedTerms,
    };

    const result = await createOffer(payload);
    setSubmitting(false);

    if (result.success) {
      setLastOfferUrl(result.offerUrl);
      if (result.emailSent) {
        setStatusMessage(`✓ Offer created and email sent to ${form.landlord_email}`);
      } else {
        const reason = result.emailError ? ` (${result.emailError})` : "";
        setStatusMessage(
          `✓ Offer created. Email failed to send${reason} — please share the link manually.`
        );
      }
      return;
    }
    setError(result.error);
  };

  const rentFreeDayOptions = Array.from({ length: 100 }, (_, i) => String(i + 1));

  return (
    <div className="min-h-screen bg-flent-off-white">
      <header className="border-b border-flent-pastel-brown/80 bg-flent-off-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/offers"
            className="flex items-center gap-3 font-semibold text-flent-black"
          >
            <img
              src="/flent-logo-black.png"
              alt="Flent"
              className="h-9 w-auto"
            />
            <span className="eyebrow-pill bg-flent-forest text-flent-yellow">
              ADMIN
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="headline-display text-3xl font-bold text-flent-black">
            Create a new{" "}
            <span className="headline-italic">partner offer.</span>
          </h1>
          <p className="max-w-xl text-sm font-medium text-flent-brown">
            Fill in the commercial details and selected terms below. Once saved, a
            shareable offer page is generated and an offer email is sent to the
            landlord.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="doorframe-wide border-none bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="headline-display text-xl font-semibold text-flent-black">
                Offer creator
              </CardTitle>
              <p className="text-sm font-medium text-flent-brown/80">
                Select your name, or enter a custom name if not listed.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {SUPPLY_TEAM_CREATORS.map((name) => (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-2 text-sm text-flent-black/90"
                  >
                    <Checkbox
                      checked={creatorName === name}
                      onCheckedChange={(checked) => setCreatorName(checked ? name : "")}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom_creator_name" className="text-xs font-semibold text-flent-brown">
                  Custom creator name
                </Label>
                <Input
                  id="custom_creator_name"
                  value={isPresetCreator ? "" : creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Type name if not listed above"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="doorframe-wide border-none bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="headline-display text-xl font-semibold text-flent-black">
                Commercial details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="landlord_name" className="text-xs font-semibold text-flent-brown">
                  Landlord name
                </Label>
                <Input
                  id="landlord_name"
                  value={form.landlord_name}
                  onChange={(e) => setForm((f) => ({ ...f, landlord_name: e.target.value }))}
                  placeholder="e.g. Rajesh Kumar"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="landlord_email" className="text-xs font-semibold text-flent-brown">
                  Landlord email address
                </Label>
                <Input
                  id="landlord_email"
                  type="email"
                  value={form.landlord_email}
                  onChange={(e) => setForm((f) => ({ ...f, landlord_email: e.target.value }))}
                  placeholder="e.g. name@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property_name" className="text-xs font-semibold text-flent-brown">
                  Property name / address
                </Label>
                <Input
                  id="property_name"
                  value={form.property_name}
                  onChange={(e) => setForm((f) => ({ ...f, property_name: e.target.value }))}
                  placeholder="e.g. Green Valley Apartments, Unit 4B"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property_type" className="text-xs font-semibold text-flent-brown">
                  Property type
                </Label>
                <Input
                  id="property_type"
                  value={form.property_type}
                  onChange={(e) => setForm((f) => ({ ...f, property_type: e.target.value }))}
                  placeholder="e.g. 3BHK Apartment"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="furnishing_state" className="text-xs font-semibold text-flent-brown">
                  Furnishing state
                </Label>
                <select
                  id="furnishing_state"
                  className={INPUT_LIKE_SELECT}
                  value={furnishingState}
                  onChange={(e) => setFurnishingState(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select furnishing state
                  </option>
                  {FURNISHING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parking" className="text-xs font-semibold text-flent-brown">
                  Parking
                </Label>
                <Input
                  id="parking"
                  value={form.parking}
                  onChange={(e) => setForm((f) => ({ ...f, parking: e.target.value }))}
                  placeholder="e.g. 1 covered car parking"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="rent_amount" className="text-xs font-semibold text-flent-brown">
                    Monthly rent (Rs)
                  </Label>
                  <Input
                    id="rent_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.rent_amount}
                    onChange={(e) => setForm((f) => ({ ...f, rent_amount: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="security_deposit" className="text-xs font-semibold text-flent-brown">
                    Security deposit (Rs)
                  </Label>
                  <Input
                    id="security_deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.security_deposit}
                    onChange={(e) => setForm((f) => ({ ...f, security_deposit: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service_term" className="text-xs font-semibold text-flent-brown">
                  Service term
                </Label>
                <select
                  id="service_term"
                  className={INPUT_LIKE_SELECT}
                  value={serviceTermChoice}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "11" || v === "22" || v === "33" || v === "custom") {
                      setServiceTermChoice(v);
                    }
                  }}
                >
                  <option value="11">11 months</option>
                  <option value="22">22 months</option>
                  <option value="33">33 months</option>
                  <option value="custom">Custom number of months</option>
                </select>
                {serviceTermChoice === "custom" && (
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={serviceTermCustomMonths}
                      onChange={(e) => setServiceTermCustomMonths(e.target.value)}
                      placeholder="Months"
                      className="max-w-[140px]"
                    />
                    <span className="text-sm font-medium text-flent-brown">months</span>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent_increment" className="text-xs font-semibold text-flent-brown">
                  Rent increment
                </Label>
                <div className="flex h-10 w-full overflow-hidden rounded-[8px] border border-flent-pastel-brown bg-white shadow-sm transition-colors focus-within:border-flent-forest focus-within:ring-2 focus-within:ring-flent-forest/40 focus-within:ring-offset-2">
                  <span className="flex shrink-0 items-center border-r border-flent-pastel-brown bg-flent-off-white px-3 text-sm font-semibold text-flent-brown">
                    %
                  </span>
                  <input
                    id="rent_increment"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={rentIncrementPct}
                    onChange={(e) => onRentIncrementInput(e.target.value)}
                    placeholder="e.g. 5"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-flent-brown/60"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="key_handover_date" className="text-xs font-semibold text-flent-brown">
                    Key handover date
                  </Label>
                  <Input
                    id="key_handover_date"
                    type="date"
                    value={form.key_handover_date}
                    onChange={(e) => setForm((f) => ({ ...f, key_handover_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rent_start_date" className="text-xs font-semibold text-flent-brown">
                    Rent start date
                  </Label>
                  <Input
                    id="rent_start_date"
                    type="date"
                    value={form.rent_start_date}
                    onChange={(e) => setForm((f) => ({ ...f, rent_start_date: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent_free_period" className="text-xs font-semibold text-flent-brown">
                  Rent free days
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    id="rent_free_period"
                    className={`${INPUT_LIKE_SELECT} sm:max-w-xs`}
                    value={rentFreeDays}
                    onChange={(e) => setRentFreeDays(e.target.value)}
                  >
                    <option value={RENT_FREE_NONE}>None</option>
                    {rentFreeDayOptions.map((d) => (
                      <option key={d} value={d}>
                        {d === "1" ? "1 day" : `${d} days`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lock_in" className="text-xs font-semibold text-flent-brown">
                  Lock-in
                </Label>
                <Input
                  id="lock_in"
                  value={form.lock_in}
                  onChange={(e) => setForm((f) => ({ ...f, lock_in: e.target.value }))}
                  placeholder="e.g. 24 months"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notice_period" className="text-xs font-semibold text-flent-brown">
                  Notice period
                </Label>
                <select
                  id="notice_period"
                  className={INPUT_LIKE_SELECT}
                  value={noticePeriodChoice}
                  onChange={(e) => setNoticePeriodChoice(e.target.value)}
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="None">None</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="doorframe-wide border-none bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="headline-display text-xl font-semibold text-flent-black">
                Other terms &amp; conditions
              </CardTitle>
              <p className="text-sm font-medium text-flent-brown/80">
                Check the terms that apply to this offer. You can add custom terms below.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {DEFAULT_TERMS.map((term, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedTerms.includes(term)}
                      onCheckedChange={(checked) => toggleTerm(term, !!checked)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-flent-black/80">{term}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add custom term..."
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTerm())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomTerm}
                  className="border-flent-pastel-brown text-sm font-semibold text-flent-brown hover:border-flent-brown hover:bg-flent-pastel-brown/40"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              {selectedTerms.some((t) => !(DEFAULT_TERMS as readonly string[]).includes(t)) && (
                <div className="rounded-xl border border-flent-pastel-brown bg-flent-off-white p-3">
                  <p className="mb-2 text-xs font-semibold text-flent-brown">
                    Custom terms added
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-flent-black/80">
                    {selectedTerms
                      .filter((t) => !(DEFAULT_TERMS as readonly string[]).includes(t))
                      .map((t, i) => (
                        <li key={i} className="flex items-center justify-between gap-2">
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => toggleTerm(t, false)}
                            className="text-flent-brown/70 hover:text-flent-brown"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {statusMessage && (
            <div className="text-sm font-medium text-flent-forest">
              {statusMessage}
            </div>
          )}
          {lastOfferUrl && (
            <div className="space-y-2 rounded-lg border border-flent-pastel-brown bg-flent-off-white/80 px-4 py-3">
              <p className="text-xs font-semibold text-flent-brown">Offer link</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  readOnly
                  value={lastOfferUrl}
                  className="font-mono text-xs text-flent-black sm:min-w-0 sm:flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(lastOfferUrl);
                      setCopyFeedback(true);
                      window.setTimeout(() => setCopyFeedback(false), 2000);
                    } catch {
                      setCopyFeedback(false);
                    }
                  }}
                  className="shrink-0 border-flent-pastel-brown text-sm font-semibold text-flent-brown hover:border-flent-brown hover:bg-flent-pastel-brown/40"
                >
                  <Copy className="mr-1.5 h-4 w-4" />
                  {copyFeedback ? "Copied" : "Copy link"}
                </Button>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="cta-button cta-button--sm w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating offer..." : "Create offer & send email"}
          </button>
        </form>
      </main>
    </div>
  );
}
