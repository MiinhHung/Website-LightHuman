import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  Check,
  ClipboardCheck,
  Clock,
  Compass,
  Crown,
  Globe,
  GraduationCap,
  Handshake,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Users,
  UsersRound,
} from "lucide-react";
import type { ServiceIcon as IconName } from "@/content/services";

const map: Record<IconName, LucideIcon> = {
  award: Award,
  briefcase: Briefcase,
  check: Check,
  "clipboard-check": ClipboardCheck,
  clock: Clock,
  compass: Compass,
  crown: Crown,
  globe: Globe,
  "graduation-cap": GraduationCap,
  handshake: Handshake,
  play: Play,
  search: Search,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  sprout: Sprout,
  target: Target,
  users: Users,
  "users-round": UsersRound,
};

/** Icon lucide theo tên trong dữ liệu (nét 1.75 như site gốc). */
export function ServiceIcon({ name, size }: { name: IconName; size: number }) {
  const Icon = map[name];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
