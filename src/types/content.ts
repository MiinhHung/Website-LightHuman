export type PostTag = {
  label: string;
  slug: string;
};

export type PostSummary = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  readTime: string;
  author: string;
  thumbnail: string;
  tags: readonly PostTag[];
  featured?: boolean;
};

export type Post = PostSummary & {
  body: string;
};

export type CaseCategoryId = "all" | "executive" | "mass" | "rpo";

export type CaseStudy = {
  id: string;
  category: CaseCategoryId;
  title: string;
  client: string;
  industry: string;
  scale: string;
  timeline: string;
  challenge: string;
  solution: string;
  results: readonly { metric: string; label: string }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
};

export type ServiceIcon =
  | "search"
  | "users"
  | "briefcase"
  | "clipboard-check"
  | "award"
  | "shield"
  | "trending-up"
  | "sparkles";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  headline: string;
  lede: string;
  description: string;
  icon: ServiceIcon;
  badge?: string;
  metrics: readonly { value: string; label: string }[];
};

export type NavItem = {
  label: string;
  href: string;
  desc?: string;
  icon?: string;
};
