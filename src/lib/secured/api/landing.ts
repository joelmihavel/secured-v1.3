import { fetchStrapi, strapiMediaUrl } from "../strapi";
import type {
  HeroContent,
  CommitmentContent,
  CreditCardContent,
  GettingStartedContent,
  DownloadAppContent,
  FaqItem,
  StatsContent,
  FooterContent,
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StrapiAny = any;

export async function getHeroContent(): Promise<HeroContent | null> {
  const data = await fetchStrapi<StrapiAny>("/landing-hero", { populate: "*" });
  if (!data) return null;
  return {
    headingPrefix: data.headingPrefix,
    headingHighlight: data.headingHighlight,
    subheading: data.subheading,
    description: data.description,
    ctaButtonText: data.ctaButtonText,
    ctaDisclaimer: data.ctaDisclaimer,
  };
}

export async function getCommitmentContent(): Promise<CommitmentContent | null> {
  const data = await fetchStrapi<StrapiAny>("/landing-commitment", {
    "populate[benefitCards]": "*",
  });
  if (!data) return null;
  return {
    subtitle: data.subtitle,
    heading: data.heading,
    description: data.description,
    benefitCards: (data.benefitCards || []).map((c: StrapiAny) => c.text),
    marqueeText1: data.marqueeText1,
    marqueeText2: data.marqueeText2,
  };
}

export async function getCreditCardContent(): Promise<CreditCardContent | null> {
  const data = await fetchStrapi<StrapiAny>("/landing-credit-card", {
    "populate[featureCards][populate]": "*",
  });
  if (!data) return null;
  return {
    heading: data.heading,
    subheading: data.subheading,
    ctaButtonText: data.ctaButtonText,
    ctaDisclaimer: data.ctaDisclaimer,
    featureCards: (data.featureCards || []).map((c: StrapiAny) => ({
      text: c.text,
      icon: strapiMediaUrl(c.icon, "/assets/icons/icon-lightning.svg"),
    })),
  };
}

export async function getGettingStartedContent(): Promise<GettingStartedContent | null> {
  const data = await fetchStrapi<StrapiAny>("/landing-getting-started", {
    "populate[steps][populate]": "*",
  });
  if (!data) return null;
  return {
    sectionLabel: data.sectionLabel,
    heading: data.heading,
    steps: (data.steps || []).map((s: StrapiAny, i: number) => ({
      number: s.number,
      title: s.title,
      description: s.description,
      phone: strapiMediaUrl(s.phoneImage, `/assets/illustrations/how-it-works-phone-${i + 1}.png`),
      connector: `/assets/backgrounds/connector-${i + 1}.svg`,
    })),
  };
}

export async function getDownloadAppContent(): Promise<DownloadAppContent | null> {
  const data = await fetchStrapi<StrapiAny>("/landing-download-app", { populate: "*" });
  if (!data) return null;
  return {
    heading: data.heading,
    description: data.description,
    appStoreButtonText: data.appStoreButtonText,
    playStoreButtonText: data.playStoreButtonText,
  };
}

export async function getFaqItems(): Promise<FaqItem[] | null> {
  const data = await fetchStrapi<StrapiAny[]>("/faq-items", {
    "sort[0]": "order:asc",
    "pagination[pageSize]": "50",
  });
  if (!data || !Array.isArray(data)) return null;
  return data.map((item: StrapiAny) => ({
    question: item.question,
    answer: item.answer,
  }));
}

export async function getStatsContent(): Promise<StatsContent | null> {
  const data = await fetchStrapi<StrapiAny>("/landing-stats", {
    "populate[stats]": "*",
  });
  if (!data) return null;
  return {
    brandHeading: data.brandHeading,
    brandSubheading: data.brandSubheading,
    stats: (data.stats || []).map((s: StrapiAny) => ({
      value: s.value,
      prefix: s.prefix || undefined,
      suffix: s.suffix || undefined,
      separator: s.separator || undefined,
      label: s.label,
    })),
  };
}

export async function getFooterContent(): Promise<FooterContent | null> {
  const data = await fetchStrapi<StrapiAny>("/landing-footer", { populate: "*" });
  if (!data) return null;
  return {
    taglineLine1: data.taglineLine1,
    taglineLine2: data.taglineLine2,
    copyright: data.copyright,
    exploreLabel: data.exploreLabel,
    contactLabel: data.contactLabel,
  };
}
