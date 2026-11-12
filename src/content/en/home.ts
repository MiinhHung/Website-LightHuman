import type { heroIntents, homeToolkit, StepIcon, TrustIcon } from "../home";
import { quoteHref, site } from "../site";

export const heroIntentsEn: typeof heroIntents = {
  label: "You need to hire",
  items: [
    { icon: "executive", label: "Executives and managers", href: "/dich-vu/tuyen-dung-nhan-su-cao-cap" },
    { icon: "mass", label: "Hundreds of staff", href: "/dich-vu/tuyen-dung-nhan-su-so-luong-lon" },
    { icon: "temporary", label: "Seasonal staff", href: "/dich-vu/tuyen-dung-nhan-su-tam-thoi" },
    { icon: "branding", label: "Better talent", href: "/dich-vu/xay-dung-thuong-hieu-tuyen-dung" },
  ],
};

export const homeToolkitEn: typeof homeToolkit = {
  title: "Run the numbers, decide faster",
  lede: "The tools Light Human advisers use every day for offers and quotes, now open to you. No sign-up.",
  salary: {
    tag: "Gross ⇄ Net salary 2026",
    title: "How much of a gross salary do you take home?",
    gross: "Gross salary per month",
    dependents: "Dependants",
    net: "Take-home (net)",
    insurance: "Insurance",
    tax: "Income tax",
    note: "Vietnam's 2026 rules, region I, insurance on the full gross salary.",
    cta: "See the full breakdown",
    unit: "₫",
  },
  quote: {
    tag: "Recruitment quote",
    title: "Drag cards, get a quote",
    body: "Pick the field, experience and location like dealing cards onto a table. The quote is ready instantly and our team follows up within one working day.",
    cards: ["Accounting", "3–5 years", "Ho Chi Minh City", "Bachelor's"],
    sheet: "Quote",
    cta: "Try the quote board",
  },
  compound: {
    tag: "Compound interest",
    title: "Save 5 million a month: what do you have in 10 years?",
    cta: "Calculate",
  },
};

/**
 * English home page (/en). Same structure and images as the Vietnamese page;
 * client quotes are translations and are labelled as such on the page.
 */

export const homeEn = {
  metaTitle: `${site.name} — Strategic HR partner for businesses in Vietnam`,
  metaDescription:
    "Light Human is an HR consultancy and headhunting firm in Vietnam: executive search, mass recruitment, employer branding, training and advisory.",

  stats: [
    { icon: "award", num: "6+", label: "Years of experience, 1,200+ HR projects" },
    { icon: "building", num: "800+", label: "Corporate clients, local and multinational" },
    { icon: "briefcase", num: "100+", label: "Projects a year, delivered on schedule" },
    { icon: "users", num: "36,000+", label: "Candidates placed" },
  ] satisfies { icon: TrustIcon; num: string; label: string }[],

  services: {
    /** Keyed by service slug; images come from the Vietnamese service data. */
    items: {
      "tuyen-dung-nhan-su-cao-cap": {
        name: "Executive search",
        summary:
          "Find people who fit your culture, values and long-term vision. A network of 5,000+ profiles from manager to C-level.",
      },
      "tuyen-dung-nhan-su-so-luong-lon": {
        name: "Mass recruitment",
        summary: "Large-scale hiring from 10 to 1,000+ candidates, fast enough to keep up with your expansion.",
      },
      "tuyen-dung-nhan-su-tam-thoi": {
        name: "Temporary staffing",
        summary: "Flexible, well-matched staff for short projects or peak seasons, at a cost that makes sense.",
      },
      "dao-tao-tuyen-dung": {
        name: "Recruitment training",
        summary: "Build your in-house HR team's skills in sourcing, interviewing and attracting talent.",
      },
      "huong-nghiep-va-tu-van-ca-nhan": {
        name: "Career coaching",
        summary: "One-to-one guidance that helps individuals find their direction and grow their careers.",
      },
      "xay-dung-thuong-hieu-tuyen-dung": {
        name: "Employer branding",
        summary: "Strategy for an employer image that attracts the best people and keeps them.",
      },
    } as Record<string, { name: string; summary: string }>,
  },

  stories: {
    title: { before: "Client ", em: "success stories" },
    lede: "Light Human works with Vietnamese and international companies to build stronger teams.",
    viewAll: "See all stories",
    tabsLabel: "Choose a story",
    usedLabel: "Services used",
    translated: "Translated from Vietnamese",
    /** Keyed by case-study slug. Brand and person names stay as they are. */
    items: {
      "kha-kim-beauty": {
        industry: "Cosmetics",
        headline: "Post-Covid restructuring: lower costs and a fresh look at the role of every position.",
        tags: ["Organisation design", "Payroll optimisation"],
        quote:
          "After Covid, Khả Kim Beauty had to restructure its workforce and redefine each role. Light Human helped us cut costs and rebuild a stronger team than before.",
        role: "CMO, Khả Kim Beauty",
      },
      "tan-hiep-phat": {
        industry: "FMCG / Beverages",
        headline: "Specialist staff for Tahefa Corp, hired on time and on budget.",
        tags: ["Specialist recruitment"],
        quote:
          "We use Light Human's specialist recruitment service and are very happy with both the quality of candidates and how quickly the team responds.",
        role: "Director, Tân Hiệp Phát",
      },
      canawan: {
        industry: "Marketing / Media",
        headline: "A Singapore-based firm opens in Vietnam, and Light Human covers its cross-border hiring.",
        tags: ["Executive search", "Mass recruitment"],
        quote:
          "Canawan is a marketing and media company headquartered in Singapore. Light Human met our cross-border hiring needs well when we opened our office in Vietnam.",
        role: "Founder, Canawan",
      },
      "pg-ung-vien": {
        brand: "P&G (candidate)",
        industry: "FMCG",
        headline: "Machine operator Lưu Tuyết Hoa finds the right job at P&G through Light Human advisers.",
        tags: ["Career coaching"],
        quote:
          "Thank you to the Light Human team for supporting me throughout my job search and connecting me with a machine operation role at P&G that fits my skills and what I wanted.",
        role: "Machine operator, P&G",
      },
      "dh-nguyen-tat-thanh": {
        brand: "Nguyen Tat Thanh University",
        industry: "Education",
        headline: "A third-year student lands a part-time job at an F&B company with Light Human's coaching.",
        tags: ["Career guidance"],
        quote:
          "I haven't finished my studies yet, but I already have a part-time job in the field I want, thanks to Light Human's advisers. It was a caring and practical experience.",
        role: "Third-year student, Nguyen Tat Thanh University",
      },
    } as Record<
      string,
      { brand?: string; industry: string; headline: string; tags: string[]; quote: string; role: string }
    >,
  },

  process: {
    steps: [
      { icon: "users", title: "Listen and understand", desc: "Get a full picture of your needs and core goals" },
      { icon: "search", title: "Analyse in depth", desc: "Assess your industry, culture and current team" },
      { icon: "target", title: "Design the solution", desc: "A tailored plan built around how your business works" },
      { icon: "handshake", title: "Deliver together", desc: "We roll it out with you and keep the process running smoothly" },
      { icon: "clipboard", title: "Measure and review", desc: "Track KPIs and report results openly" },
      { icon: "sprout", title: "Improve and grow", desc: "Keep refining so your business grows sustainably" },
    ] satisfies { icon: StepIcon; title: string; desc: string }[],
  },

  insights: {
    heading: "HR insights from Light Human",
    viewAll: "See all articles",
    note: "Articles are published in Vietnamese.",
    readTime: (min: number) => `${min} min read`,
  },

  closing: {
    heading: "Start with a quote",
    desc: "Choose the role and candidate requirements and get a quote code straight away. Our business team will follow up within one working day.",
    action: { label: "Get a quote", href: quoteHref },
    secondary: { label: "Looking for a job? See openings", href: site.jobsUrl },
  },
};

export const homeVideoEn = {
  play: "Watch our story",
  close: "Close video",
  dialog: "Light Human introduction film (in Vietnamese)",
};

export const manifestoEn = {
  segments: [
    { text: "One right person can change" },
    { text: "a whole team.", em: true },
    { text: "Our job is to find that person, and stay with you until they" },
    { text: "truly stay.", em: true },
  ] as { text: string; em?: boolean }[],
  sign: "The Light Human team",
};

export const homeChaptersEn = {
  belief: "What we believe",
  services: "What we do",
  process: "How we work",
  stories: "What it delivers",
  start: "Where to start",
  next: "Next",
};


export const edHeroEn = {
  kicker: "Strategic HR partner",
  title: { before: "Exceptional ", em1: "people", middle: " build ", em2: "extraordinary companies." },
  lede: "Headhunting, mass recruitment and HR advisory for more than 800 Vietnamese and international companies.",
  primary: { label: "Get a quote", href: quoteHref },
  secondary: { label: "Explore our services", href: "/dich-vu" },
  imageAlt: "A Light Human consultant meeting a candidate",
  film: "Our story on film",
};

export const servicesHeadEn = {
  title: "Six services, one HR partner",
  lede: "From finding a senior executive to staffing a new production line with hundreds of people, Light Human runs the whole process.",
  all: "Services overview",
};

export const processHeadEn = {
  title: "Six steps, each with a named owner",
  lede: "From understanding your needs to continuous improvement, you always know where the project stands and who is on it.",
};
