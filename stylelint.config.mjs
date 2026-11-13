/**
 * Correctness-only rules: no stylistic preferences, because src/styles/mk/* is the approved
 * mock's CSS copied verbatim and must stay diffable against it.
 * @type {import("stylelint").Config}
 */
export default {
  rules: {
    "color-no-invalid-hex": true,
    "function-calc-no-unspaced-operator": true,
    "unit-no-unknown": true,
    "property-no-unknown": true,
    "declaration-block-no-duplicate-properties": [true, { ignore: ["consecutive-duplicates-with-different-values"] }],
    "selector-pseudo-class-no-unknown": true,
    "selector-pseudo-element-no-unknown": true,
    "selector-type-no-unknown": [true, { ignore: ["custom-elements"] }],
    "media-feature-name-no-unknown": true,
    "at-rule-no-unknown": [true, { ignoreAtRules: ["theme", "plugin", "apply", "layer", "custom-variant", "utility", "source"] }],
    "no-invalid-double-slash-comments": true,
    "block-no-empty": true,
    "string-no-newline": true,
    "keyframe-declaration-no-important": true,
    "no-duplicate-at-import-rules": true,
  },
};
