# Narrative Arc Overhaul — Team Brief

## Why We're Doing This

The current scrollytelling pages were built **bottom-up**: we had data, made sections for each dataset, then added narrative bridges to connect them. The result works but lacks deliberate storytelling. A friend (Rahula) reviewed the Budget page and found:

- **Internal inconsistency**: Different sections used different denominators for the same concept (e.g., "45 paise per rupee earned" vs "31 paise per rupee spent"), confusing readers.
- **Unclear context**: Visualizations lacked clarity about what time period or scope they covered.
- **No deliberate outline**: Sections exist because the data exists, not because the story demands them.

His core feedback: **"We need to sit through, make an outline — how I want to tell a story, what factors to highlight — then using that outline we need to build this."**

## What We're Producing

**For each of the 11 domains**, a narrative outline document. **For the 12 cross-domain topics**, a separate outline document. These are editorial planning documents, NOT code changes yet.

## The Audience

Class 10-12 Indian citizen. Simple but not simplistic. Someone who reads a newspaper but wouldn't read an RBI bulletin. Every number should feel tangible — use "paisa per rupee," "per day," "per family" framings. Indian number format always (crore/lakh, not million/billion).

## Outline Format (per domain)

```
# [Domain Name] — Narrative Outline

## Headline Thesis
One sentence. What is the ONE story this domain tells?
Example: "India's budget is a ₹50 lakh crore bet on borrowing today to build tomorrow."

## Arc Type
Name the narrative structure:
- Cause-chain (problem → root cause → persistence)
- Contradiction (X is true AND the opposite is also true)
- Window-of-opportunity (asset exists but window is closing)
- Follow-the-money (trace a rupee from source to destination)
- Institutional-quality (who shows up → who represents → how well)
- Systemic-breakdown (escalating failures across a system)

## Opening Hook
What grabs the reader in the first 3 seconds? A shocking number? A paradox? A personal question?

## Beats (ordered)
For each beat:
- **Beat name**: Short label
- **Narrative function**: What this beat ARGUES (not just what it shows)
- **Key data**: The specific number/chart that proves the argument
- **Emotional register**: curiosity / tension / surprise / urgency / hope / anger / resolution
- **Transition to next**: How this beat creates momentum toward the next one

## Internal Consistency Rules
- What denominator/framing is used throughout (e.g., "per rupee spent" not "per rupee earned")
- What time period is the default (latest year? trend over N years?)
- Any numbers that appear in multiple beats — ensure they use the same source and framing

## Closing
What does the reader walk away with? (Not just "explore more" — an emotional or intellectual landing)

## Cross-Domain Connections
Which other domains does this story naturally link to, and at which beat?
```

## Outline Format (per cross-domain topic)

```
# [Topic Name] — Narrative Outline

## Thesis
What does the INTERSECTION of these domains reveal that no single domain can?

## Domains Used (and why)
List each domain this topic pulls from, and what specific data/insight it contributes.

## Argument Arc
3-5 beats that build a cross-cutting argument.

## Why This Matters
The "so what" — why should a citizen care about this intersection?
```

## Voice & Tone Reference

From BRAND.md:
- Direct, declarative, present tense. The data speaks.
- DO: "Where the money goes" / DON'T: "Explore How the Government Spends Your Money"
- DO: "For every rupee earned, the government borrows 28 paise more." / DON'T: "Borrowings constitute 28.2% of total receipts."
- No marketing speak. This is a civic tool. Informative and respectful.
- Numbers in Indian format. Crore and lakh are first-class units.

## Current Domain Structure (from audit)

### Strongest Arcs (use as models)
- **Crime**: Volume → targets women → roads deadlier → police understaffed → courts broken. Cumulative systemic failure.
- **Education**: "Enrollment is not learning" → girls drop after primary → teacher quality → underfunding. Clean cause-chain.
- **Census**: "Structure > size" → demographic dividend is a one-time window → uneven across states. Urgency frame.

### Weakest Arcs (need most work)
- **RBI**: Currently reads as "here's how the plumbing works." Informational, not narrative.
- **Environment**: "Contradictions" framing but sections feel loosely connected.

### All 11 Domains (current section count + arc type)
1. Budget (9 sections) — follow-the-money
2. Economy (6 sections) — growth-vs-stability
3. RBI (6 sections) — institutional-mechanics (weakest)
4. States (6 sections) — mosaic/inequality
5. Census (7 sections) — demographic-crossroads
6. Education (7 sections) — access-vs-quality
7. Employment (7 sections) — structural-anxiety
8. Healthcare (7 sections) — scarcity-with-pockets-of-hope
9. Environment (5 sections) — contradictions (weak)
10. Elections (6 sections) — participation-vs-representation
11. Crime (7 sections) — systemic-breakdown

### 12 Cross-Domain Topics
1. India's Growth Story
2. Demographic Dividend
3. Gender Gap
4. Rural-Urban Divide
5. Regional Inequality
6. Digital India
7. Fiscal Federalism
8. Public Health Spending
9. Education & Employment
10. Climate & Economy
11. Democratic Accountability
12. Social Safety Net

## Process

1. Read the current domain page code to understand existing sections
2. Read the domain's data files/schema to know what data is available
3. Draft the outline following the format above
4. Write it to `docs/narrative-outlines/{domain}.md` or `docs/narrative-outlines/topics/{topic-slug}.md`

The user (Ronit) is the editorial voice. He will review all outlines and discuss with Rahula before any implementation begins.
