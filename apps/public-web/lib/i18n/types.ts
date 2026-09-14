export type Locale = "id" | "en";

export interface NavTranslations {
  about: string;
  services: string;
  portfolio: string;
  pricing: string;
  caseStudies: string;
  guides: string;
  howItWorks: string;
  home: string;
  ctaButton: string;
  mobileCta: string;
  openMenu: string;
  closeMenu: string;
  navAria: string;
  mobileNavAria: string;
}

export interface HeroTranslations {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTextLink: string;
  flowSteps: Array<{ label: string; detail: string }>;
  flowAria: string;
}

export interface WhatIsQiraTranslations {
  kicker: string;
  headingPart1: string;
  headingHighlight: string;
}

export interface SolutionItem {
  number: string;
  problem: string;
  question: string;
  solution: string;
  result: string;
  imagePosition: "left" | "right";
}

export interface SolutionsTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  problemLabel: string;
  qiraMakes: string;
  resultLabel: string;
  cta: string;
  items: SolutionItem[];
}

export interface BenefitsTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
}

export interface BeforeAfterTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  sliderAria: string;
  imageAria: string;
  outcomes: [string, string, string];
}

export interface ApplicationExample {
  label: string;
  title: string;
  items: string[];
  result: string;
}

export interface ApplicationsTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  viewMore: string;
  examples: ApplicationExample[];
}

export interface AudiencePath {
  href: string;
  tag: string;
  title: string;
  cta: string;
}

export interface AudienceTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  paths: AudiencePath[];
}

export interface ProofItem {
  href: string;
  tag: string;
  title: string;
  cta: string;
  isDemo?: boolean;
}

export interface ProofTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  items: ProofItem[];
  disclaimer: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface ProcessTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  steps: ProcessStep[];
}

export interface GuaranteeCard {
  badge: string;
  icon: string;
  title: string;
  desc: string;
  points: [string, string];
}

export interface GuaranteesTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  cards: GuaranteeCard[];
}

export interface LearningCard {
  href: string;
  tag: string;
  title: string;
  cta: string;
}

export interface LearningTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  cards: LearningCard[];
}

export interface PricingTranslations {
  kicker: string;
  heading: string;
  headingHighlight: string;
  subtext: string;
  cta: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqTranslations {
  kicker: string;
  heading: string;
  lead: string;
  items: FaqItem[];
}

export interface ClosingCtaTranslations {
  kicker: string;
  heading: string;
  subtext: string;
  primaryText: string;
  waText: string;
}

export interface FooterTranslations {
  brandTagline: string;
  trustBadge: string;
  colSolutions: string;
  colLearn: string;
  colCompany: string;
  solutionsLinks: Array<{ href: string; label: string }>;
  learnLinks: Array<{ href: string; label: string }>;
  companyLinks: Array<{ href: string; label: string }>;
  waText: string;
  bottomText: string;
  privacy: string;
  about: string;
  start: string;
}

export interface WhatsAppTranslations {
  floatingTooltip: string;
  floatingText: string;
  floatingAria: string;
  defaultPrefill: string;
}

export interface TranslationDictionary {
  nav: NavTranslations;
  hero: HeroTranslations;
  whatIsQira: WhatIsQiraTranslations;
  solutions: SolutionsTranslations;
  benefits: BenefitsTranslations;
  beforeAfter: BeforeAfterTranslations;
  applications: ApplicationsTranslations;
  audience: AudienceTranslations;
  proof: ProofTranslations;
  process: ProcessTranslations;
  guarantees: GuaranteesTranslations;
  learning: LearningTranslations;
  pricing: PricingTranslations;
  faq: FaqTranslations;
  closingCta: ClosingCtaTranslations;
  footer: FooterTranslations;
  whatsapp: WhatsAppTranslations;
}