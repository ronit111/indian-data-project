# Narrative Overhaul — Implementation Guide

## HARD CONSTRAINT: NO DATA FABRICATION

**You MUST NOT create, fabricate, invent, or hardcode any data values.** The data pipeline has been audited multiple times and is the ground truth. All numbers come from:
- Pipeline-generated JSON files in `public/data/`
- Curated constants in domain store files
- Runtime-computed derived values

What you CAN change:
- Section ordering within a page
- Narrative bridge text (NarrativeBridge component content)
- Annotation text (the `text-annotation` paragraphs beside visualizations)
- Section titles and hero text
- Key Takeaway pill labels and ordering
- Denominator framing ("per rupee spent" not "per rupee earned")
- Cross-domain link configuration
- DomainCTA related stories

What you MUST NOT change:
- Data loading logic (Zustand stores, data hooks)
- Chart component data bindings (the `data` prop passed to charts)
- Pipeline JSON file contents
- Curated data constants
- Computed values (paisaBorrowed, perCapitaDailyExpenditure, etc.)
- Chart component internals (LineChart, TreeMap, WaffleChart, etc.)

If an outline proposes a beat that requires data we don't have, SKIP that beat or reshape it to use available data. Message the quality-guard with what you skipped and why.

## Editorial Decisions (locked in by user)

1. **Budget**: Invert section order — open with per-capita (₹137/day), trace backward and forward
2. **Education**: Triumph first, then gut punch — celebrate enrollment + gender in Beats 1-2, then dropout + ASER crisis
3. **Energy capacity vs generation**: Fix everywhere — "43% of installed capacity" must always note "coal generates 70%+ of electricity"
4. **Urban-Rural topic**: Merge into Regional Inequality as a new beat
5. **Democratic Health topic**: Expand with Crime + Budget domains
6. **Topic roster**: 12 topics (see BRIEF.md for list)

## Implementation Pattern

For each domain page, the work is:

### Step 1: Read the outline
`docs/narrative-outlines/{domain}.md` — this is your blueprint.

### Step 2: Read the current page
`src/pages/{Domain}Page.tsx` — understand current section order, component imports, data flow.

### Step 3: Read section components
`src/components/{domain}/` — understand what each section renders and what data it needs.

### Step 4: Restructure
- Reorder section components in the page TSX to match outline beat order
- Update NarrativeBridge text between sections to match outline transitions
- Update annotation text within sections to match outline narrative function
- Fix Key Takeaway pills (order, labels) if the outline changes emphasis
- Update DomainCTA related stories if cross-domain connections changed
- Fix denominator consistency per outline's Internal Consistency Rules

### Step 5: Verify data integrity
- Every number displayed must still come from the data pipeline
- Every chart must still receive the same data props
- No hardcoded numbers in narrative text (use template literals with computed values)
- Check that reformatted text still references the correct variable names

## Specific Patterns to Follow

### Reordering sections
The page TSX renders sections in order. To reorder, move the JSX blocks. Keep the `id` attributes intact (they're used for scroll-to links from Key Takeaways and cross-domain links).

### Updating NarrativeBridge text
```tsx
<NarrativeBridge
  text="New bridge text here with accent colored keywords"
  highlights={{ accent: 'var(--saffron)', keywords: 'var(--cyan)' }}
/>
```
The `highlights` prop is a `Record<string, string>` where keys are **lowercase words with punctuation stripped** (the component lowercases and strips `.,!?;:'"` before matching) and values are CSS color strings. Choose 1-3 words that carry the emotional weight of the transition. Always follow the pattern in existing page files (BudgetPage.tsx, etc.), NOT any other example.

### Updating annotations
These are the `text-annotation` paragraphs. They use template literals with data:
```tsx
<p className="text-annotation">
  {`The fiscal deficit stands at ${summary.fiscalDeficitPercentGDP}% of GDP.`}
</p>
```
You can rewrite the surrounding text but MUST keep the data reference intact.

### Updating Key Takeaways
```tsx
<KeyTakeaways
  accent="#FF6B35"
  pills={[
    { value: `₹${perCapita}/day`, label: 'New label text', sectionId: 'section-id' },
  ]}
/>
```
You can change label text and pill order. The `value` must use computed data. The `sectionId` must match an existing section's `id`.

### SectionNumber
When reordering, update `<SectionNumber number={N} />` to reflect the new position in the sequence.

## Voice & Tone Quick Reference

- Direct, declarative, present tense
- "Where the money goes" not "Explore How the Government Spends"
- "For every rupee spent, X paise is borrowed" not "Borrowings constitute X%"
- Indian number format always (crore/lakh, ₹ symbol)
- No marketing speak, no cheerleading, no catastrophizing
- Class 10-12 citizen audience — simple but not simplistic

## Team Communication Protocol

- Message quality-guard when your cluster is done for review
- Message quality-guard if you encounter data that doesn't match the outline (DON'T fabricate)
- Message copy-editor if you're unsure about voice/tone for a specific bridge
- DO NOT message the user unless quality-guard + copy-editor cannot resolve the issue
- When in doubt about a narrative choice, apply first principles: "does this serve the citizen reader?"

## File Locations

| What | Where |
|------|-------|
| Narrative outlines | `docs/narrative-outlines/{domain}.md` |
| Topic outlines | `docs/narrative-outlines/topics/{slug}.md` |
| Domain pages | `src/pages/{Domain}Page.tsx` |
| Section components | `src/components/{domain}/` |
| Bridge component | `src/components/ui/NarrativeBridge.tsx` |
| Cross-domain links | `src/lib/crossDomainLinks.ts` |
| Topic config | `src/config/topics.ts` or `src/lib/topics/` |
| Data stores | `src/stores/` |
| Chart registry | `src/lib/registry/{domain}.ts` |
| Brand guide | `BRAND.md` |
