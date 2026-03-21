"use client";

import {
  Hero,
  GridDivider,
  Commitment,
  CreditCard,
  GettingStarted,
  Stats,
  FAQ,
  DownloadApp,
} from "@/components/secured";
import { Navbar } from "@/components/secured/Navbar";
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
    <>
      <Navbar />
      <main className="flex flex-col gap-12 md:gap-0">
        <Hero data={data.hero} variant={variant} />
        <div className="-mt-4 md:mt-[34px]">
          <GridDivider variant={variant} />
        </div>
        <div style={{ marginTop: 48 }} />
        <Commitment data={data.commitment} variant={variant} />
        <CreditCard data={data.creditCard} />
        <div className="-mt-12 pt-8 md:mt-0 md:pt-0">
          <GettingStarted data={data.gettingStarted} />
        </div>
        <div className="pb-10 md:pb-[80px]" />
        <DownloadApp data={DOWNLOAD_APP_DEFAULTS} />
        <div className="pt-10 md:pt-[80px]" />
        <FAQ items={data.faq} />
        <Stats data={STATS_DEFAULTS} />
      </main>
      <Footer data={FOOTER_DEFAULTS} />
    </>
  );
}
