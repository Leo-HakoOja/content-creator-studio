# CONTEXT.md — ideas/

## What happens here

One `.md` file per content idea. Ideas are developed here and graduate to `projects/` when approved. `_index.md` tracks status across all ideas.

## Files

| File | Purpose |
|---|---|
| `_index.md` | Status tracker — title, status, date created |
| `<kebab-case-title>.md` | One file per idea, scaffolded from `_templates/idea-template.md` |

## Process

1. Create: Scaffold from `_templates/idea-template.md`, save to `ideas/<kebab-case-title>.md`
2. Before writing anything, confirm: What is the core angle? Does footage exist for it? What trend does it ride?
3. Develop: Fill in title options, thumbnail concept, footage refs, trend link — leave "Client vision notes" blank for the creator
4. Score: Run `/score-idea <title>` against the rubric in `_config/content-methodology.md`
5. Approve: Creator marks it `approved` in `_index.md` → move to `projects/`

## Idea file must-haves

- Working title (at least one option)
- Core angle — one sentence: the hook or transformation
- Footage refs — exact clip names from `footage-library/_index.md`
- Trend link — which trend from `trends/` this idea rides
- Thumbnail concept — emotion + composition, not just "show the thing"
- Status — `draft` / `approved` / `in-production` / `published`

## Good output

- No idea references footage that isn't in `footage-library/_index.md`
- "Client vision notes" section is always blank — that is the creator's section
- Title options follow the formula in `_config/content-methodology.md`
- Score from `/score-idea` is attached or noted before moving to production

## ICM handoff

When an idea is approved and production will run through the ICM factory, the idea file must contain these five fields — they pre-answer the equivalent questions in ICM's `content-production/01-brief` stage:

| Idea file field | Maps to ICM `01-brief` question |
|---|---|
| Core angle (one or two sentences) | Concept |
| Platform target | Platform |
| Footage refs (from `footage-library/_index.md`) | Source material |
| Estimated length | Target length |
| Greenscreen flag (yes/no) | Format path (adds `03a-vfx` if yes) |

Deadline and client/channel are confirmed by the operator at the `01-brief` stage — they are not set in the idea file.

An approved idea file that contains all five fields above is a complete ICM handoff. Pass it as the starting input when opening `content-production/01-brief` in the factory.
