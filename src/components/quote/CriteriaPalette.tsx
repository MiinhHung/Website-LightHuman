"use client";

import { useDraggable } from "@dnd-kit/core";
import { Check } from "lucide-react";
import { CATALOG, type GroupKey } from "@/content/quote/catalog";
import { vi } from "@/content/quote/labels.vi";
import { isValueSelected, type SelectedState } from "./selection";

type Props = {
  selected: SelectedState;
  onToggle: (groupKey: GroupKey, value: string) => void;
};

/** Every catalogue option as a chip: click/Enter toggles, drag drops into the selection panel. */
export function CriteriaPalette({ selected, onToggle }: Props) {
  return (
    <div>
      {CATALOG.map((group) => {
        const legendId = `quote-group-${group.key}`;
        const rule = [
          group.required ? null : vi.group.optional,
          group.selectType === "multi" ? vi.group.multi : vi.group.single,
        ]
          .filter(Boolean)
          .join(", ");
        return (
          <div key={group.key} className="lh-quote-group" role="group" aria-labelledby={legendId}>
            <span id={legendId} className="lh-quote-group__legend">
              {group.label}
              {group.required && (
                <span className="lh-quote-req" aria-hidden="true">
                  *
                </span>
              )}{" "}
              <span className="lh-quote-group__rule">({rule})</span>
            </span>
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
        );
      })}
    </div>
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
    data: { groupKey, value, label },
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
    >
      {isSelected && <Check size={14} strokeWidth={2} aria-hidden="true" />}
      {label}
    </button>
  );
}
