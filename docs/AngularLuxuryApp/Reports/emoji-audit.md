# Emoji Audit

- Generated at: 2026-10-02T22:47:46.299Z
- Scope: `src/`
- Total matches: 1979
- User-facing matches: 453
- Button emoji inputs: 0

## Priority Order

1. `button_emoji_input`: migrate templates/components still passing `emoji`.
2. `template_text` and `code_string`: replace visible emoji content with PrimeIcons or text.
3. `style_content`: replace glyph-based status markers with icon classes or semantic styles.
4. `code_comment`, `docs`, `template_comment`: cleanup pass once UI is covered.

## Top Modules

- app/modules: 1265
- app/shared: 277
- app/routing: 136
- src/styles: 136
- app/core: 117
- app/root: 38
- src/environments: 5
- src/root: 5

## Top User-Facing Modules

- app/modules: 348
- app/core: 63
- app/shared: 20
- app/root: 16
- src/styles: 6

## Top Categories

- docs: 1079
- code_string: 229
- template_text: 218
- code_comment: 198
- template_comment: 167
- style_comment: 45
- code_misc: 25
- style_text: 9
- style_content: 6
- config: 3

## Highest Priority Files


## Notes

- Full detail lives in `reports/emoji-audit.json`.
- `styles/emojis.md` is treated as documentation/reference and should not block UI cleanup.
- This audit is line-based: it is conservative and designed to over-report rather than miss visual cases.

