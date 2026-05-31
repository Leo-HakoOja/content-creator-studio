# CONTEXT.md — remotion/

## What happens here

Motion graphics compositions for the creator's brand. Three starter compositions are built and ready to customise. Renders always output to `../output/` — never inside this folder.

## Compositions

| ID | Duration | Purpose | Command |
|---|---|---|---|
| `Intro` | 5s | Branded video intro | `npm run motion:intro` |
| `LowerThird` | 3s | Animated name / location tag | `npm run motion:lower-third` |
| `TitleCard` | 3s | Chapter or section title | `npm run motion:title-card` |

## Files

| File | Purpose |
|---|---|
| `src/index.ts` | Entry point — registers root |
| `src/Root.tsx` | Registers all compositions with `defaultProps` |
| `src/compositions/Intro.tsx` | Intro composition |
| `src/compositions/LowerThird.tsx` | Lower third composition |
| `src/compositions/TitleCard.tsx` | Title card composition |

## Process

1. Customise brand: Update `defaultProps` in `src/Root.tsx` — set brand name, tagline, colors to match `_config/brand.md`
2. Preview: `npm run motion:studio` — opens Remotion Studio in browser for live preview
3. Render: Run the relevant `npm run motion:*` command — output lands in `../output/`
4. First-time setup: `cd remotion && npm install`

## Rules

- **Never use CSS transitions or Tailwind animation classes** — they do not render correctly in Remotion
- Always use `useCurrentFrame()` + `interpolate()` for all animation
- Load the `remotion-best-practices` skill before writing or editing any composition
- `defaultProps` in `Root.tsx` is the single place to set brand values — do not hardcode them inside composition files
- Renders go to `../output/` — never commit render artifacts to this folder

## Good output

Rendered `.mp4` files that match the creator's brand colors and name, play at the correct duration, and have no visual glitches at frame 0 or the final frame.
