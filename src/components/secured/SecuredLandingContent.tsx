"use client";

import {
  Hero,
  RentMapSection,
  Commitment,
  CreditCard,
  GettingStarted,
  Stats,
  FAQ,
  DownloadApp,
  TrustSection,
  WhyJoinSection,
  CoverageSection,
  CallbackSection,
  TickerBanner,
} from "@/components/secured";
import { PhoneReveal } from "@/components/secured/PhoneReveal";
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
  TRUST_DEFAULTS,
  TRUST_LANDLORD_DEFAULTS,
  WHY_JOIN_DEFAULTS,
  WHY_JOIN_LANDLORD_DEFAULTS,
  COVERAGE_LANDLORD_DEFAULTS,
  CALLBACK_LANDLORD_DEFAULTS,
} from "@/lib/secured/defaults";

export function SecuredLandingContent() {
  const { variant } = useVariant();
  const data = variant === "landlord"
    ? {
        hero: HERO_LANDLORD_DEFAULTS,
        trust: TRUST_LANDLORD_DEFAULTS,
        commitment: COMMITMENT_LANDLORD_DEFAULTS,
        creditCard: CREDIT_CARD_LANDLORD_DEFAULTS,
        gettingStarted: GETTING_STARTED_LANDLORD_DEFAULTS,
        faq: FAQ_LANDLORD_DEFAULTS,
        whyJoin: WHY_JOIN_LANDLORD_DEFAULTS,
      }
    : {
        hero: HERO_DEFAULTS,
        trust: TRUST_DEFAULTS,
        commitment: COMMITMENT_DEFAULTS,
        creditCard: CREDIT_CARD_DEFAULTS,
        gettingStarted: GETTING_STARTED_DEFAULTS,
        faq: FAQ_DEFAULTS,
        whyJoin: WHY_JOIN_DEFAULTS,
      };

  return (
    <div className="relative">
      {/* Persistent vertical border lines */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-30 hidden lg:block"
        style={{ left: 160, width: "0.3px", backgroundColor: "#444444" }}
      />
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-30 hidden lg:block"
        style={{ right: 160, width: "0.3px", backgroundColor: "#444444" }}
      />

      {/* TickerBanner rendered in PageContent.tsx to escape transform containment */}

      <main className="flex flex-col gap-12 md:gap-0">
        <Hero data={data.hero} variant={variant} />
        {variant === "tenant" && (
          <>
            {/* Phone pulled up into hero viewport, sits above map z-index */}
            <div className="relative z-[32] -mt-[300px] flex justify-center bg-transparent md:-mt-[350px] lg:-mt-[400px]">
              <PhoneReveal />
            </div>
            <div className="h-[40px] md:h-[48px] bg-[#131313]" />
            <TrustSection data={data.trust} />
            <RentMapSection />
          </>
        )}
        {variant === "landlord" && (
          <>
            <div style={{ marginTop: 48 }} />
            <TrustSection data={data.trust} />
          </>
        )}
        <Commitment data={data.commitment} variant={variant} />
        {variant === "landlord" && (
          <CoverageSection data={COVERAGE_LANDLORD_DEFAULTS} />
        )}
        <CreditCard data={data.creditCard} />
        <div className="-mt-12 pt-8 md:mt-0 md:pt-0">
          <GettingStarted data={data.gettingStarted} />
        </div>
        <div className="pb-10 md:pb-[80px]" />
        {variant === "landlord" ? (
          <CallbackSection data={CALLBACK_LANDLORD_DEFAULTS} />
        ) : (
          <DownloadApp data={DOWNLOAD_APP_DEFAULTS} />
        )}
        <div className="pt-10 md:pt-[80px]" />
        <FAQ items={data.faq} />
        <Stats data={STATS_DEFAULTS} />
      </main>
      <Footer data={FOOTER_DEFAULTS} />
    </div>
  );
}
