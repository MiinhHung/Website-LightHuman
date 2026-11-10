"use client";

import { useDraggable } from "@dnd-kit/core";
import {
  CATALOG,
  type EducationValue,
  type ExperienceValue,
  type GroupKey,
  type IndustryValue,
  type LanguageValue,
  type RegionValue,
} from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";

type SelectedState = {
  industries: readonly IndustryValue[];
  languages: readonly LanguageValue[];
  experience: ExperienceValue | null;
  region: RegionValue | null;
  education: EducationValue | null;
};

type Props = {
  selected: SelectedState;
  onToggle: (groupKey: GroupKey, value: string) => void;
};

/** Left column — every catalogue option rendered as a draggable+clickable chip. */
export function CriteriaPalette({ selected, onToggle }: Props) {
  return (
    <section className="lh-quote-column" aria-label={vi.palette}>
      <h4>{vi.palette}</h4>
      <p className="lh-quote-column-hint">{vi.paletteHint}</p>
      {CATALOG.map((group) => (
        <div
          key={group.key}
          className="lh-quote-group"
          role="group"
          aria-label={group.label}
        >
          <div className="lh-quote-group__legend">
            <span>{group.label}</span>
            <em>
              {group.required ? "bắt buộc" : "tuỳ chọn"} ·{" "}
              {group.selectType === "multi" ? "chọn nhiều" : "chọn một"}
            </em>
          </div>
          <div className="lh-quote-chip-row">
            {group.options.map((o) => (
              <PaletteChip
                key={o.value}
                groupKey={group.key}
                value={o.value}
                label={o.label}
                isSelected={isValueSelected(selected, group.key, o.value)}
                onClick={() => onToggle(group.key, o.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function PaletteChip({
  groupKey,
  value,
  label,
  isSelected,
  onClick,
}: {
  groupKey: GroupKey;
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `chip:${groupKey}:${value}`,
    data: { groupKey, value },
  });
  const classes = [
    "lh-quote-chip",
    isSelected ? "lh-quote-chip--selected" : "",
    isDragging ? "lh-quote-chip--dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      className={classes}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`${label}${isSelected ? " (đã chọn)" : ""}`}
    >
      {label}
    </button>
  );
}

function isValueSelected(s: SelectedState, groupKey: GroupKey, value: string): boolean {
  switch (groupKey) {
    case "industries":
      return s.industries.includes(value as IndustryValue);
    case "languages":
      return s.languages.includes(value as LanguageValue);
    case "experience":
      return s.experience === value;
    case "region":
      return s.region === value;
    case "education":
      return s.education === value;
  }
}
