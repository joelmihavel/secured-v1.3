import type {
  HeroContent,
  CommitmentContent,
  CreditCardContent,
  GettingStartedContent,
  DownloadAppContent,
  FaqItem,
  StatsContent,
  FooterContent,
} from "./types";

export const HERO_DEFAULTS: HeroContent = {
  headingPrefix: "Earn ",
  headingHighlight: "1% back",
  subheading: "On every timely rent payment",
  description: "Because habits like yours should\nbe rewarded, not overlooked.",
  ctaButtonText: "Join the Waitlist",
  ctaDisclaimer: "This isn\u2019t for average renters, really..",
};

export const HERO_LANDLORD_DEFAULTS: HeroContent = {
  headingPrefix: "You ",
  headingHighlight: "get Paid",
  subheading: "even after your tenants vacate",
  description: "Protect your rental income from empty months\nand sudden exits \u2013 free of cost.",
  ctaButtonText: "Join the Waitlist",
  ctaDisclaimer: "Free Forever | \u20B91.5 lakh protection limit | Instant, hassle-free payout",
};

export const COMMITMENT_LANDLORD_DEFAULTS: CommitmentContent = {
  subtitle: "YOU INVESTED CRORES INTO THAT HOME",
  heading: "Yet, your rental income is just one event away from disruption",
  description:
    "Secured is a protection stack built around your rental asset. It starts with vacancy cover today and expands into smarter tools that future-proof your rental income for whatever comes next.",
  benefitCards: [
    "Zero-Cost Vacancy Cover",
    "Zero-cost tenant background verification",
    "Loan Against Rental Income",
    "Property Damage Cover",
  ],
  marqueeText1: "High Value Property",
  marqueeText2: "Needs High Value Protection",
};

export const CREDIT_CARD_LANDLORD_DEFAULTS: CreditCardContent = {
  heading: "Tenant or Not. Get paid on time, every month.",
  subheading: "No questions-asked coverage up to \u20B91.5 lakh",
  ctaButtonText: "Join the Waitlist",
  ctaDisclaimer: "Simple | Compliant | No Workarounds",
  featureCards: [
    { text: "Complimentary tenant credit report", icon: "/assets/icons/icon-credit-report.svg" },
    { text: "Simple, one-click signup", icon: "/assets/icons/icon-one-click.svg" },
    { text: "If the tenant leaves, you can collect one month\u2019s rent if the home is vacant for 30 days.", icon: "/assets/icons/icon-vacancy-cover.svg" },
    { text: "If a tenant leaves without notice, you can collect up to one month\u2019s rent after adjusting the deposit.", icon: "/assets/icons/icon-no-notice.svg" },
    { text: "Instant payouts, zero paperwork", icon: "/assets/icons/icon-instant-payout.svg" },
    { text: "Complimentary tenant BGV report", icon: "/assets/icons/icon-bgv-report.svg" },
  ],
};

export const COMMITMENT_DEFAULTS: CommitmentContent = {
  subtitle:
    "RENT IS YOUR BIGGEST MONTHLY COMMITMENT.",
  heading:
    "You\u2019ve handled it responsibly, but it\u2019s never really led to anything",
  description:
    "Secured changes that with a simple cashback today, and ultimately opens doors to renting benefits that you truly deserve.",
  benefitCards: [
    "1% cashback on timely rental payment",
    "Zero Security Deposits",
    "First dibs on upcoming flent homes (coming soon)",
    "Home design @zero service fee (coming soon)",
  ],
  marqueeText1: "Welcome to the right side of renting",
  marqueeText2: "Because responsibility should feel rewarding",
};

export const CREDIT_CARD_DEFAULTS: CreditCardContent = {
  heading: "Yes, you can pay rent using your credit card here",
  subheading: "And yes, you still earn 1% back",
  ctaButtonText: "Join the Waitlist",
  ctaDisclaimer: "This isn\u2019t for average renters, really..",
  featureCards: [
    { text: "One-time setup, lightning fast payments", icon: "/assets/icons/icon-lightning.svg" },
    { text: "Collect points on every rent payment", icon: "/assets/icons/icon-coins.svg" },
    { text: "Get upto 45 days of interest free breathing room", icon: "/assets/icons/icon-calendar.svg" },
    { text: "Industry low net effective convenience fee", icon: "/assets/icons/icon-receipt.svg" },
  ],
};

export const GETTING_STARTED_LANDLORD_DEFAULTS: GettingStartedContent = {
  sectionLabel: "How does it work?",
  heading: "Setup Your Cover in <5 Minutes",
  steps: [
    {
      number: 1,
      title: "Request your invite",
      description: "Request your invite and upload your existing rental contract for property verification",
      phone: "/assets/illustrations/how-it-works-phone-landlord-1.png",
      connector: "/assets/backgrounds/connector-1.svg",
    },
    {
      number: 2,
      title: "We approve your property",
      description: "We approve your property if you\u2019re eligible",
      phone: "/assets/illustrations/how-it-works-phone-landlord-2.png",
      connector: "/assets/backgrounds/connector-2.svg",
    },
    {
      number: 3,
      title: "Invite your tenants",
      description: "Invite your tenants and collect rent as usual. Your tenants get 1% back on each rent payment.",
      phone: "/assets/illustrations/how-it-works-phone-landlord-3.png",
      connector: "/assets/backgrounds/connector-3.svg",
    },
    {
      number: 4,
      title: "You\u2019re covered",
      description: "Collect three consistent rent payments, to activate your insurance.",
      phone: "/assets/illustrations/how-it-works-phone-landlord-4.png",
      connector: "/assets/backgrounds/connector-4.svg",
    },
  ],
};

export const GETTING_STARTED_DEFAULTS: GettingStartedContent = {
  sectionLabel: "How does it work?",
  heading: "Getting started is simple & straightforward",
  steps: [
    {
      number: 1,
      title: "Request your invite",
      description: "Request your invite, Share your address, rent amount, & phone number",
      phone: "/assets/illustrations/how-it-works/screen-1.png",
      connector: "/assets/backgrounds/connector-1.svg",
    },
    {
      number: 2,
      title: "Complete your KYC",
      description: "Complete your KYC, & invite your landlord, We handle the rest",
      phone: "/assets/illustrations/how-it-works/screen-2.png",
      connector: "/assets/backgrounds/connector-2.svg",
    },
    {
      number: 3,
      title: "Landlord accepts",
      description: "Landlord accepts and gets insured. A free \u20B91.5 lakh rental cover activates instantly.",
      phone: "/assets/illustrations/how-it-works/screen-3.png",
      connector: "/assets/backgrounds/connector-3.svg",
    },
    {
      number: 4,
      title: "Pay rent as usual",
      description: "Pay rent as usual, earn 1% back, Every timely payment unlocks more rewards.",
      phone: "/assets/illustrations/how-it-works/screen-4.png",
      connector: "/assets/backgrounds/connector-4.svg",
    },
  ],
};

export const DOWNLOAD_APP_DEFAULTS: DownloadAppContent = {
  heading: "Get the App",
  description:
    "Get the Flent app to make renting simpler, faster, and stress-free.\nScan the QR or tap below to download and get started.",
  appStoreButtonText: "Download on App store",
  playStoreButtonText: "Download on Play store (coming soon)",
};

export const FAQ_DEFAULTS: FaqItem[] = [
  { question: "Will my landlord even agree to this?", answer: "Most do, because it gives them something too: a free rental insurance cover of up to \u20B91.5 lakh. You just send an invite link; we guide them through the rest." },
  { question: "Is paying rent through Secured\u2026 safe?", answer: "Yes. Boringly yes. Payments move through RBI-regulated rails. Everything works exactly as it should, just with rewards attached." },
  { question: "Can I really pay rent using my credit card? Isn\u2019t that banned?", answer: "On most platforms, yes. But Secured processes rent the right way, fully compliant, no disguises, no loopholes. So yes, your card works here. And earns 1% back." },
  { question: "Do I get real cashback? Like\u2026 actual money?", answer: "You earn 1% back inside Secured. It isn\u2019t withdrawable, but it does reduce your next month\u2019s rent. Your rent finally helps pay rent :)" },
  { question: "What if my landlord doesn\u2019t respond to the invite?", answer: "We nudge them gently. If needed, we nudge again. If really needed, we show you how to nudge them. It\u2019s teamwork." },
  { question: "Is there any catch for tenants?", answer: "No fees, no lock-ins, no strange clauses. Just pay rent on time & earn 1% back. Your landlord gets their insurance; you get your reward." },
  { question: "What happens to my data?", answer: "Nothing scandalous. No selling, no sharing, no trading. Only used to run your account and keep payments secure." },
  { question: "Why do I need to pay rent for 3 months before the insurance activates?", answer: "Insurance needs a minimum activity window to stay valid. Three months of rent flow = active coverage. (You don\u2019t pay for this. It\u2019s still free for your landlord.)" },
  { question: "What if I change houses later?", answer: "Easy. Update your address \u2192 invite your next landlord \u2192 continue earning. Your good habits move with you." },
];

export const FAQ_LANDLORD_DEFAULTS: FaqItem[] = [
  { question: "Do I have to pay anything for this cover?", answer: "No. The cover is completely free for landlords. There are no charges, renewals, or hidden fees." },
  { question: "How does my cover activate?", answer: "Once your tenant pays three consecutive months of rent through Secured, your cover becomes active automatically." },
  { question: "What exactly does the cover protect me from?", answer: "Two situations:\nIf your tenant moves out after serving notice and your home stays vacant for 30 days, you get up to one month\u2019s rent.\nIf your tenant leaves without notice, you get up to one month\u2019s rent after the security deposit is adjusted." },
  { question: "What is the maximum amount I can receive?", answer: "You\u2019re covered for up to \u20B91.5 lakh of rental income." },
  { question: "How fast is the payout?", answer: "Instant. Once eligibility is met, payouts are processed immediately\u2014no paperwork or follow-ups." },
  { question: "What does signing Flent as a property management company mean?", answer: "It\u2019s a simple onboarding agreement that allows us to administer the protection stack. You retain full control of your property\u2014rent, tenants, decisions. Nothing operational changes for you." },
  { question: "Will my tenant know they are being insured?", answer: "Your tenant sees Secured as a rent payment product with benefits for them. They don\u2019t see insurance documents or claims\u2014they simply pay rent through the app." },
  { question: "What if my tenant doesn\u2019t want to switch to Secured?", answer: "Most tenants prefer Secured because they get 1% cashback and access to a better renting profile. But if they initially hesitate, you can invite them again\u2014they lose nothing by switching." },
  { question: "What if my property rarely stays vacant?", answer: "Great\u2014that means you may never need to claim. But when stakes are high, having a protection layer is better than relying on luck, especially with a property worth crores." },
  { question: "Does Secured intervene in my tenant relationships?", answer: "No. You manage your property exactly as you do today. Secured only handles:\nrent collection\nyour protection layer\npayouts when triggered" },
  { question: "What happens to the insurance if I change tenants?", answer: "Your cover continues. Once the new tenant completes 3 consecutive Secured payments, the protection automatically resets and stays active." },
  { question: "Does this cover damages or unpaid rent?", answer: "Not yet. Those protections are part of the broader protection stack we\u2019re building\u2014coming soon as additional layers." },
  { question: "Can I still collect rent in my bank account?", answer: "Yes. Secured simply facilitates the payment and protection. Funds ultimately settle to your account as usual." },
  { question: "Is my property data safe?", answer: "Yes. We only use the information required to activate and process payouts. No data is sold or shared externally." },
  { question: "Do I need to file paperwork to claim?", answer: "No paperwork. Once the conditions are met (vacancy for 30 days or an abrupt exit), your payout is processed automatically." },
];

export const STATS_DEFAULTS: StatsContent = {
  brandHeading: "Built with \uD83E\uDDE1",
  brandSubheading: "Curating India\u2019s Top 1% Rental Homes",
  stats: [
    { value: "150", suffix: "+ ", label: "Apartments in Bangalore" },
    { value: "4.8", separator: "/", suffix: "5", label: "Avg. Rating from Residents" },
    { prefix: "INR", value: " 27 Cr", label: "Raised since inception" },
  ],
};

export const FOOTER_DEFAULTS: FooterContent = {
  taglineLine1: "Welcome to the",
  taglineLine2: "right side of renting",
  copyright: "\u00A9 2026 FLENT. ALL RIGHTS RESERVED.",
  exploreLabel: "Explore",
  contactLabel: "Contact",
};
