import type {
  HeroContent,
  CommitmentContent,
  CreditCardContent,
  GettingStartedContent,
  DownloadAppContent,
  FaqItem,
  StatsContent,
  FooterContent,
  TrustContent,
  WhyJoinContent,
  CoverageContent,
  CallbackContent,
} from "./types";

export const HERO_DEFAULTS: HeroContent = {
  headingPrefix: "Earn ",
  headingHighlight: "1% back",
  subheading: "on every rent payment",
  description: "You already pay rent on time every month\nNow it actually works for you",
  ctaButtonText: "Download the app",
  ctaDisclaimer: "",
};

export const HERO_LANDLORD_DEFAULTS: HeroContent = {
  headingPrefix: "Get paid ",
  headingHighlight: "even if your tenant leaves",
  subheading: "Protect your rental income from empty months and sudden exits",
  description: "You invested crores into your home\n\nBut your rent is still not guaranteed\n\nSecured fixes that",
  ctaButtonText: "Get a callback",
  ctaDisclaimer: "Free forever | ₹1.5 lakh protection | Instant payouts",
};

export const TRUST_DEFAULTS: TrustContent = {
  heading: "Already used across Bangalore",
  description: "Thousands of rent payments already happen through Secured\nPeople across Whitefield, HSR, Indiranagar and more are already earning",
  points: [
    "Built by the team behind Flent homes",
    "Used by working professionals across the city",
    "Growing every week",
  ],
};

export const TRUST_LANDLORD_DEFAULTS: TrustContent = {
  heading: "Already used by homeowners across Bangalore",
  description: "Landlords across the city already use Secured to protect their rent",
  points: [
    "No fees ever",
    "Works with your current tenants",
    "Simple setup",
  ],
};

export const COMMITMENT_DEFAULTS: CommitmentContent = {
  subtitle: "",
  heading: "Rent is your biggest monthly expense",
  description: "You've been paying it every month\nAnd getting nothing back\n\nNo returns\nNo leverage\nNo advantage\n\nSecured changes that",
  benefitCards: [
    { text: "Earn cashback every time you pay rent", icon: "/assets/dither/icon-cashback.png", iconKey: "cashback" },
    { text: "Know if you're overpaying", icon: "/assets/dither/icon-zero-deposit.png", iconKey: "zero-deposit" },
    { text: "Build a renter profile that actually matters", icon: "/assets/dither/icon-renter-profile.png", iconKey: "renter-profile" },
    { text: "Unlock better homes and lower deposits over time", icon: "/assets/dither/icon-better-homes.png", iconKey: "better-homes" },
  ],
  marqueeText1: "Welcome to the side where rent actually works for you",
  marqueeText2: "Welcome to the side where rent actually works for you",
};

export const COMMITMENT_LANDLORD_DEFAULTS: CommitmentContent = {
  subtitle: "",
  heading: "Rent is your biggest monthly dependency",
  description: "One tenant leaves\nOne empty month\n\nAnd you lose real money\n\nSecured makes sure that doesn't happen",
  benefitCards: [
    { text: "Get paid even if your home stays vacant", icon: "/assets/dither/icon-vacancy-cover.png", iconKey: "vacancy-cover" },
    { text: "Protection from sudden tenant exits", icon: "/assets/dither/icon-tenant-exit.png", iconKey: "tenant-exit" },
    { text: "Zero-cost tenant verification", icon: "/assets/dither/icon-verification.png", iconKey: "verification" },
    { text: "Better control over your rental income", icon: "/assets/dither/icon-growth.png", iconKey: "growth" },
  ],
  marqueeText1: "High value property needs proper protection",
  marqueeText2: "High value property needs proper protection",
};

export const CREDIT_CARD_DEFAULTS: CreditCardContent = {
  heading: "Yes, you can pay rent using your credit card",
  subheading: "And yes, you still earn cashback",
  ctaButtonText: "Join the waitlist",
  ctaDisclaimer: "",
  featureCards: [
    { text: "Setup once, pay in seconds", icon: "/assets/dither/icon-setup-fast.png", iconKey: "setup-fast" },
    { text: "Earn card points + cashback", icon: "/assets/dither/icon-card-points.png", iconKey: "card-points" },
    { text: "Up to 45 days breathing room", icon: "/assets/dither/icon-breathing-room.png", iconKey: "breathing-room" },
    { text: "Lower fees than most platforms", icon: "/assets/dither/icon-low-fees.png", iconKey: "low-fees" },
  ],
};

export const CREDIT_CARD_LANDLORD_DEFAULTS: CreditCardContent = {
  heading: "Get paid on time. Every month",
  subheading: "Even when things don't go as planned",
  ctaButtonText: "Get a callback",
  ctaDisclaimer: "",
  featureCards: [
    { text: "Free tenant credit report", icon: "/assets/dither/icon-verification.png", iconKey: "verification" },
    { text: "Instant payouts", icon: "/assets/dither/icon-cashback.png", iconKey: "cashback" },
    { text: "No operational changes", icon: "/assets/dither/icon-growth.png", iconKey: "growth" },
  ],
};

export const COVERAGE_LANDLORD_DEFAULTS: CoverageContent = {
  heading: "You get paid. No matter what.",
  points: [
    "Tenant leaves → get one month's rent",
    "Tenant exits without notice → get compensated",
    "No paperwork. No chasing",
  ],
};

export const GETTING_STARTED_DEFAULTS: GettingStartedContent = {
  sectionLabel: "How does it work?",
  heading: "Getting started takes 2 minutes",
  steps: [
    {
      number: 1,
      title: "Join Secured",
      description: "Join Secured",
      phone: "/assets/illustrations/how-it-works/screen-1.png",
      connector: "/assets/backgrounds/connector-1.svg",
    },
    {
      number: 2,
      title: "Invite your landlord",
      description: "Invite your landlord",
      phone: "/assets/illustrations/how-it-works/screen-2.png",
      connector: "/assets/backgrounds/connector-2.svg",
    },
    {
      number: 3,
      title: "They get free protection",
      description: "They get free protection",
      phone: "/assets/illustrations/how-it-works/screen-3.png",
      connector: "/assets/backgrounds/connector-3.svg",
    },
    {
      number: 4,
      title: "You start earning cashback",
      description: "You start earning cashback",
      phone: "/assets/illustrations/how-it-works/screen-4.png",
      connector: "/assets/backgrounds/connector-4.svg",
    },
  ],
};

export const GETTING_STARTED_LANDLORD_DEFAULTS: GettingStartedContent = {
  sectionLabel: "How does it work?",
  heading: "Setup in under 5 minutes",
  steps: [
    {
      number: 1,
      title: "Upload agreement",
      description: "Upload agreement",
      phone: "/assets/illustrations/how-it-works-phone-landlord-1.png",
      connector: "/assets/backgrounds/connector-1.svg",
    },
    {
      number: 2,
      title: "We verify property",
      description: "We verify property",
      phone: "/assets/illustrations/how-it-works-phone-landlord-2.png",
      connector: "/assets/backgrounds/connector-2.svg",
    },
    {
      number: 3,
      title: "Invite tenant",
      description: "Invite tenant",
      phone: "/assets/illustrations/how-it-works-phone-landlord-3.png",
      connector: "/assets/backgrounds/connector-3.svg",
    },
    {
      number: 4,
      title: "You're covered",
      description: "You're covered",
      phone: "/assets/illustrations/how-it-works-phone-landlord-4.png",
      connector: "/assets/backgrounds/connector-4.svg",
    },
  ],
};

export const WHY_JOIN_DEFAULTS: WhyJoinContent = {
  problems: [
    "You already pay rent every month",
    "You might be overpaying",
    "You're getting nothing back",
  ],
  solutionHeading: "Secured fixes all three",
  solutions: [],
};

export const WHY_JOIN_LANDLORD_DEFAULTS: WhyJoinContent = {
  problems: [
    "Rental income is unpredictable",
    "Vacancies cost money",
    "Tenant exits are risky",
  ],
  solutionHeading: "Secured gives you a safety net",
  solutions: [],
};

export const DOWNLOAD_APP_DEFAULTS: DownloadAppContent = {
  heading: "Get the app",
  description: "Make renting simpler, faster, and actually rewarding",
  appStoreButtonText: "Download on App Store",
  playStoreButtonText: "Coming soon",
};

export const CALLBACK_LANDLORD_DEFAULTS: CallbackContent = {
  heading: "Want to understand how this works for your property?",
  description: "We'll walk you through everything\nNo pressure. No commitments",
  ctaButtonText: "Get a callback",
};

export const FAQ_DEFAULTS: FaqItem[] = [
  { question: "Will my landlord even agree to this?", answer: "Most do, because it gives them something too: a free rental insurance cover of up to ₹1.5 lakh. You just send an invite link; we guide them through the rest." },
  { question: "Is paying rent through Secured… safe?", answer: "Yes. Boringly yes. Payments move through RBI-regulated rails. Everything works exactly as it should, just with rewards attached." },
  { question: "Can I really pay rent using my credit card? Isn’t that banned?", answer: "On most platforms, yes. But Secured processes rent the right way, fully compliant, no disguises, no loopholes. So yes, your card works here. And earns 1% back." },
  { question: "Do I get real cashback? Like… actual money?", answer: "You earn 1% back inside Secured. It isn’t withdrawable, but it does reduce your next month’s rent. Your rent finally helps pay rent :)" },
  { question: "What if my landlord doesn’t respond to the invite?", answer: "We nudge them gently. If needed, we nudge again. If really needed, we show you how to nudge them. It’s teamwork." },
  { question: "Is there any catch for tenants?", answer: "No fees, no lock-ins, no strange clauses. Just pay rent on time & earn 1% back. Your landlord gets their insurance; you get your reward." },
  { question: "What happens to my data?", answer: "Nothing scandalous. No selling, no sharing, no trading. Only used to run your account and keep payments secure." },
  { question: "Why do I need to pay rent for 3 months before the insurance activates?", answer: "Insurance needs a minimum activity window to stay valid. Three months of rent flow = active coverage. (You don’t pay for this. It’s still free for your landlord.)" },
  { question: "What if I change houses later?", answer: "Easy. Update your address → invite your next landlord → continue earning. Your good habits move with you." },
];

export const FAQ_LANDLORD_DEFAULTS: FaqItem[] = [
  { question: "Do I have to pay anything for this cover?", answer: "No. The cover is completely free for landlords. There are no charges, renewals, or hidden fees." },
  { question: "How does my cover activate?", answer: "Once your tenant pays three consecutive months of rent through Secured, your cover becomes active automatically." },
  { question: "What exactly does the cover protect me from?", answer: "Two situations:\nIf your tenant moves out after serving notice and your home stays vacant for 30 days, you get up to one month’s rent.\nIf your tenant leaves without notice, you get up to one month’s rent after the security deposit is adjusted." },
  { question: "What is the maximum amount I can receive?", answer: "You’re covered for up to ₹1.5 lakh of rental income." },
  { question: "How fast is the payout?", answer: "Instant. Once eligibility is met, payouts are processed immediately—no paperwork or follow-ups." },
  { question: "What does signing Flent as a property management company mean?", answer: "It’s a simple onboarding agreement that allows us to administer the protection stack. You retain full control of your property—rent, tenants, decisions. Nothing operational changes for you." },
  { question: "Will my tenant know they are being insured?", answer: "Your tenant sees Secured as a rent payment product with benefits for them. They don’t see insurance documents or claims—they simply pay rent through the app." },
  { question: "What if my tenant doesn’t want to switch to Secured?", answer: "Most tenants prefer Secured because they get 1% cashback and access to a better renting profile. But if they initially hesitate, you can invite them again—they lose nothing by switching." },
  { question: "What if my property rarely stays vacant?", answer: "Great—that means you may never need to claim. But when stakes are high, having a protection layer is better than relying on luck, especially with a property worth crores." },
  { question: "Does Secured intervene in my tenant relationships?", answer: "No. You manage your property exactly as you do today. Secured only handles:\nrent collection\nyour protection layer\npayouts when triggered" },
  { question: "What happens to the insurance if I change tenants?", answer: "Your cover continues. Once the new tenant completes 3 consecutive Secured payments, the protection automatically resets and stays active." },
  { question: "Does this cover damages or unpaid rent?", answer: "Not yet. Those protections are part of the broader protection stack we’re building—coming soon as additional layers." },
  { question: "Can I still collect rent in my bank account?", answer: "Yes. Secured simply facilitates the payment and protection. Funds ultimately settle to your account as usual." },
  { question: "Is my property data safe?", answer: "Yes. We only use the information required to activate and process payouts. No data is sold or shared externally." },
  { question: "Do I need to file paperwork to claim?", answer: "No paperwork. Once the conditions are met (vacancy for 30 days or an abrupt exit), your payout is processed automatically." },
];

export const STATS_DEFAULTS: StatsContent = {
  brandHeading: "Built with care",
  brandSubheading: "Curating some of Bangalore's best rental homes",
  stats: [
    { value: "150", suffix: "+ ", label: "Apartments" },
    { value: "4.8", separator: "/", suffix: "5", label: "Rating" },
    { prefix: "₹", value: "27 Cr", label: "Raised" },
  ],
};

export const FOOTER_DEFAULTS: FooterContent = {
  taglineLine1: "Welcome to the",
  taglineLine2: "right side of renting",
  copyright: "© 2026 Flent. All rights reserved.",
  exploreLabel: "Explore",
  contactLabel: "Contact",
};
