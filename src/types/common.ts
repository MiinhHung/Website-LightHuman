import type { Locale } from "@/i18n/config";

export type IconName = string;

export type OptionItem = {
  readonly value: string;
  readonly label: string;
};

export type KeyValuePair<K extends string = string, V = unknown> = Record<K, V>;

export type { Locale };
