---
name: score-idea
description: Score a content idea against the creator's methodology rubric. Usage: /score-idea <title-or-filename>. Returns a structured score before production starts.
---

# Score Idea

Apply the creator's methodology rubric to an idea file and return a structured score.

## Input

The user passes a title or filename: `/score-idea my-idea-title` or `/score-idea ideas/my-idea.md`.

Resolve to the correct file:
- If the argument ends in `.md` and the file exists, use it directly.
- Otherwise, search `ideas/` for a filename containing the argument (case-insensitive, partial match). Use the closest match.
- If no match, list available idea files and ask the creator to confirm which one.

## Steps

1. **Read the idea file.** Load the full contents of the matched `ideas/<name>.md`.

2. **Read the methodology.** Read `_config/content-methodology.md`. Extract:
   - The scoring rubric (criteria + questions + threshold)
   - The title formula
   - Core principle and hook structure (for qualitative notes)
   - If `content-methodology.md` still has placeholder text (no real criteria filled in), stop: "Methodology not configured — fill in `_config/content-methodology.md` before scoring."

3. **Read footage status.** Check `footage-library/_index.md` to verify whether the footage referenced in the idea actually exists and is tagged. Note any gaps.

4. **Score the idea.** Apply each rubric criterion from the methodology. For each criterion:
   - State the criterion
   - Answer the rubric question based on what's in the idea file
   - Assign a score (1–5, or whatever scale the methodology defines)
   - One-line rationale

5. **Output the score card** in this format:

---

## Score: [Idea Title]

| Criterion | Score | Note |
|---|---|---|
| [Criterion 1] | [X/5] | [one line] |
| [Criterion 2] | [X/5] | [one line] |
| ... | | |
| **Total** | **[X/25]** | |

**Verdict:** [Strong / Develop further / Reconsider] — based on the threshold in the methodology.

**Title check:** [Does the current working title match the formula? If not, offer 2 alternatives.]

**Footage check:** [All clips present / Missing: list gaps]

**One thing to fix before production:** [The single weakest point — specific and actionable]

---

6. **Ask:** "Want to develop this further or move it to a project?"

## Rules

- Score based only on what's in the idea file — don't assume content that isn't written.
- If the rubric criteria are blank placeholders, say so rather than making up criteria.
- Footage check is mandatory — never score an idea green if required footage doesn't exist in the index.
- Keep the "one thing to fix" to one thing. Don't pile on.
