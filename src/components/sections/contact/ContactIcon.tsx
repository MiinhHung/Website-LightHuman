import {
  Award,
  Clock,
  Gem,
  Handshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const icons = {
  award: Award,
  clock: Clock,
  gem: Gem,
  handshake: Handshake,
  mail: Mail,
  "map-pin": MapPin,
  phone: Phone,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  users: Users,
  "users-round": UsersRound,
} satisfies Record<string, LucideIcon>;

export type ContactIconName = keyof typeof icons;

/** Icon lucide như trang gốc (stroke 1.75, aria-hidden). */
export function ContactIcon({ name, size = 18 }: { name: ContactIconName; size?: number }) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
