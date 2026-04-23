"use client";

import {
  Hero,
  Commitment,
  CreditCard,
  GettingStarted,
  Stats,
  FAQ,
  DownloadApp,
} from "@/components/secured";
import { Footer } from "@/components/secured/Footer";
import { useVariant } from "./VariantContext";
import {
  HERO_DEFAULTS,
  HERO_LANDLORD_DEFAULTS,
  COMMITMENT_DEFAULTS,
  COMMITMENT_LANDLORD_DEFAULTS,
  CREDIT_CARD_DEFAULTS,
  CREDIT_CARD_LANDLORD_DEFAULTS,
  GETTING_STARTED_DEFAULTS,
  GETTING_STARTED_LANDLORD_DEFAULTS,
  DOWNLOAD_APP_DEFAULTS,
  FAQ_DEFAULTS,
  FAQ_LANDLORD_DEFAULTS,
  STATS_DEFAULTS,
  FOOTER_DEFAULTS,
} from "@/lib/secured/defaults";

export function SecuredLandingContent() {
  const { variant } = useVariant();
  const data = variant === "landlord"
    ? {
        hero: HERO_LANDLORD_DEFAULTS,
        commitment: COMMITMENT_LANDLORD_DEFAULTS,
        creditCard: CREDIT_CARD_LANDLORD_DEFAULTS,
        gettingStarted: GETTING_STARTED_LANDLORD_DEFAULTS,
        faq: FAQ_LANDLORD_DEFAULTS,
      }
    : {
        hero: HERO_DEFAULTS,
        commitment: COMMITMENT_DEFAULTS,
        creditCard: CREDIT_CARD_DEFAULTS,
        gettingStarted: GETTING_STARTED_DEFAULTS,
        faq: FAQ_DEFAULTS,
      };

  return (
    <div className="relative">
      {/* Persistent vertical border lines */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-30 hidden lg:block"
        style={{ left: 80, width: "0.3px", backgroundColor: "#444444" }}
      />
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-30 hidden lg:block"
        style={{ right: 80, width: "0.3px", backgroundColor: "#444444" }}
      />

      <main className="flex flex-col">
        <Hero data={data.hero} variant={variant} />
        <Commitment data={data.commitment} variant={variant} />
        <CreditCard data={data.creditCard} />
        <GettingStarted data={data.gettingStarted} />
        <DownloadApp data={DOWNLOAD_APP_DEFAULTS} />
        <FAQ items={data.faq} />
        <Stats data={STATS_DEFAULTS} />
      </main>
      <Footer data={FOOTER_DEFAULTS} />
    </div>
  );
}
