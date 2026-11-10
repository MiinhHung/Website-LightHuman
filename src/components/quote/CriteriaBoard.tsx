"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  CATALOG,
  type EducationValue,
  type ExperienceValue,
  type GroupKey,
  type IndustryValue,
  type LanguageValue,
  type RegionValue,
  labelFor,
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
  onRemove: (groupKey: GroupKey, value: string) => void;
  multiLanguage: boolean;
  inlineError?: string;
};

/** Right column — droppable zones per group + the derived multi-language badge. */
export function CriteriaBoard({ selected, onRemove, multiLanguage, inlineError }: Props) {
  return (
    <section className="lh-quote-column" aria-label={vi.board}>
      <h4>{vi.board}</h4>
      <p className="lh-quote-column-hint">
        Bấm × để bỏ một hạng mục. Mỗi nhóm là một yêu cầu.
      </p>
      {inlineError && (
        <p className="lh-quote-error-text" role="alert">
          {inlineError}
        </p>
      )}
      {CATALOG.map((group) => (
        <Zone
          key={group.key}
          groupKey={group.key}
          label={group.label}
          values={valuesForGroup(selected, group.key)}
          onRemove={onRemove}
        />
      ))}
      {multiLanguage && (
        <div className="lh-quote-multi-language" aria-live="polite">
          <span className="lh-quote-type-badge lh-quote-type-badge--hunt">
            {vi.multiLanguageBadge}
          </span>
          <span className="lh-quote-note">
            Nhãn tự suy ra khi chọn từ 2 ngôn ngữ trở lên.
          </span>
        </div>
      )}
    </section>
  );
}

function Zone({
  groupKey,
  label,
  values,
  onRemove,
}: {
  groupKey: GroupKey;
  label: string;
  values: string[];
  onRemove: (groupKey: GroupKey, value: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `zone:${groupKey}`,
    data: { groupKey },
  });
  const classes = [
    "lh-quote-drop-zone",
    values.length === 0 ? "lh-quote-drop-zone--empty" : "",
    isOver ? "lh-quote-drop-zone--active" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      className="lh-quote-group"
      role="group"
      aria-label={`${vi.board} — ${label}`}
    >
      <div className="lh-quote-group__legend">
        <span>{label}</span>
      </div>
      <div ref={setNodeRef} className={classes}>
        {values.length === 0 ? (
          <span>Kéo hoặc bấm thẻ bên trái để thêm.</span>
        ) : (
          <div className="lh-quote-chip-row">
            {values.map((v) => (
              <button
                key={v}
                type="button"
                className="lh-quote-chip lh-quote-chip--selected"
                onClick={() => onRemove(groupKey, v)}
                aria-label={`${vi.removeChip} ${labelFor(groupKey, v)}`}
              >
                <span>{labelFor(groupKey, v)}</span>
                <span className="lh-quote-chip-x" aria-hidden="true">
                  ×
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function valuesForGroup(s: SelectedState, key: GroupKey): string[] {
  switch (key) {
    case "industries":
      return [...s.industries];
    case "languages":
      return [...s.languages];
    case "experience":
      return s.experience ? [s.experience] : [];
    case "region":
      return s.region ? [s.region] : [];
    case "education":
      return s.education ? [s.education] : [];
  }
}
