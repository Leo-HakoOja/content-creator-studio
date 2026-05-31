---
name: morning-pulse
description: Daily content briefing — fetches fresh trends, cross-refs footage library, surfaces 2-3 actionable ideas ready to make today. Run each morning to get the day's production priority.
---

# Morning Pulse

Run a complete morning briefing: fetch fresh trends, cross-reference the footage library, and surface the 2-3 best ideas to develop today.

## Steps

1. **Check brand config.** Read `_config/brand.md`. If it still contains `[CLIENT NAME]` placeholder text, stop and say: "Studio not configured — fill in `_config/brand.md` first."

2. **Fetch fresh trends.** From the project root, run:
   ```sh
   npm run trends
   ```
   If this fails (no API key, no keywords configured), note the error and skip to step 4 using cached `trends/latest.md` if present. If neither is available, say so and skip to step 6.

3. **Read trends output.** Read `trends/latest.md`. Extract the top 8–10 most niche-relevant videos/topics. Ignore generic or off-niche results.

4. **Read footage library.** Read `footage-library/_index.md`. Catalog what tagged clips exist and what subjects they cover.

5. **Check saved trends.** Scan files in `trends/saved/` (skip if empty). Saved trends = creator already flagged interest — weight these higher.

6. **Check ideas pipeline.** Read `ideas/_index.md` if it exists. Note any ideas already `approved` or in progress — don't re-suggest the same angle.

7. **Cross-reference trends vs footage:**
   - **Strong match** — trend topic + matching footage = actionable idea today
   - **Partial match** — adjacent trend, some footage = possible with a re-angle
   - **Gap** — strong trend, no footage = needs filming

8. **Output the morning briefing** in this exact format:

---

## Morning Pulse — [TODAY'S DATE]

**Top niche trends today**
- [Video title] — [Channel] — [view count] — *why relevant: one line*
- [repeat for 4–6 most relevant]

**Ideas you can make today** *(footage exists)*
1. **[Punchy idea title]**
   Footage: [clip name(s) from index]. Angle: [one sentence — the hook or transformation]. Trend link: [which trend it rides].
2. [repeat — only include if footage genuinely supports it]
3. [repeat — stop at 3 max, fewer is fine if matches are weak]

**What to film this week** *(trending, footage missing)*
- [Topic] — [why urgent: view numbers, velocity]

**Pipeline check**
- Ideas awaiting approval: [N or "none"]
- Projects in editing: [N or "none"]

---

9. **Ask one question:** "Which of these do you want to develop?" If the creator names one, immediately scaffold an idea file from `_templates/idea-template.md` and save it to `ideas/<kebab-case-title>.md`.

## Rules

- Never suggest an idea if no footage in `footage-library/_index.md` could support it.
- Never invent trends — only surface what `trends/latest.md` actually contains.
- Keep idea titles punchy — think thumbnail copy, not blog post titles.
- One idea per trend maximum — quality over padding.
- If the trends fetch fails and no cache exists, run a footage-only briefing: read the footage index and surface 2-3 ideas based on what's unlinked and could be developed.
