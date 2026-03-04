# Indian Data Project — Brand & Visual Identity

A reference document for maintaining visual and tonal consistency across the project. Share this with any designer, developer, or AI agent working on the codebase.

---

## Design Philosophy

Three principles guide every visual decision:

**1. Data IS the design.** Inspired by Information is Beautiful (David McCandless) — key numbers are physically enormous, visualizations paint directly onto the background (no card wrappers), and each composition uses a curated 2-3 color sub-palette. The visualization is the hero, not the chrome around it.

**2. Restrained craft.** Inspired by Kasia Siwosz (kasiasiwosz.com) — generous whitespace as a design element, numbered narrative sections (01, 02, 03...) reinforce sequential storytelling, staggered entrance animations, and scroll-triggered word reveals. The feeling is understated luxury: every pixel intentional, nothing flashy.

**3. Analytical beauty.** Inspired by Visual Cinnamon (Nadieh Bremer) and Truth & Beauty (Moritz Stefaner) — bespoke SVG visualizations, scrollytelling where the data transforms on scroll, analytical clarity meets aesthetic beauty. Also draws from Structify.ai for the modern dark landing aesthetic: glowing accents, smooth motion, premium feel.

### Creative License — Dare to Be Different

The brand philosophy is a guardrail, not a cage. Within its boundaries, **unconventional and unique choices are explicitly encouraged** — especially at the granular interaction and composition level.

What this means in practice:
- **Typography can be architecture.** A number doesn't have to sit politely in a card — it can fill the viewport, bleed across sections, layer over visualizations. If the data warrants spectacle, give it spectacle.
- **Whitespace is a design material.** A section with three words and 400px of breathing room can communicate more than a dense infographic. Don't fill space out of obligation.
- **Layout conventions are optional.** Cascading diagonal lists, asymmetric grids, text that steps across the page, sections with no clear "container" — all valid when they serve the narrative. The Kasia Siwosz reference (kasiasiwosz.com) demonstrates this: curly-brace list markers, progressive opacity text reveals, 3D typographic blocks, hard contrast shifts between dark and light sections.
- **Micro-interactions can be opinionated.** A hover state doesn't have to be a color change. A scroll transition doesn't have to be a fade-in. If a visualization wants to "breathe" or a number wants to "land" with weight, explore that.
- **Break patterns when a section demands it.** Not every composition needs the same SectionNumber → Title → Annotation → Visualization anatomy. If a data point is so striking it deserves its own full-viewport moment with nothing else, do that.

The constraint: every unconventional choice must serve the **data narrative**. Bold for the sake of bold is decoration. Bold because "31 paise of every rupee is borrowed" deserves to hit you in the chest — that's design.

**Living reference**: [kasiasiwosz.com](https://www.kasiasiwosz.com/) — study the typography-as-hero approach, the hard light/dark section shifts, the diagonal cascading layouts, and how section numbering with margin annotations creates wayfinding without traditional navigation.

### What this is NOT

- Not a government website aesthetic (no tricolor bars, no serif fonts, no busy layouts)
- Not a generic dashboard (no card grids, no 12-color chart palettes, no cramped data tables)
- Not minimal to the point of sterility — there should be warmth, texture, and moments of visual delight

---

## Color System

### Backgrounds — Deep Navy-Black

The entire app sits on deep navy-black, inspired by IIB poster compositions. This isn't pure black — it has a slight blue undertone that gives depth.

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-void` | `#06080f` | Page background, the canvas |
| `--bg-surface` | `#0e1420` | Alternate section backgrounds, cards |
| `--bg-raised` | `#1a2230` | Hover states, expanded rows, inner cards |
| `--bg-hover` | `#243040` | Active states |
| `--bg-glass` | `rgba(14,20,32, 0.85)` | Header, overlays (with backdrop-filter blur) |

### Text — Warm White Hierarchy

Not pure white. The primary text color has a warm cream tone that feels more approachable than clinical white.

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#f0ece6` | Headlines, key numbers, primary content |
| `--text-secondary` | `#b0b8c4` | Body text, annotations, descriptions |
| `--text-muted` | `#5c6a7e` | Captions, source attributions, section numbers |

### Accent Palette — The IIB Approach

The core principle: **2-3 intentional colors per composition**, not 12 random chart colors. Each visualization gets its own curated sub-palette with semantic meaning.

| Token | Hex | Meaning |
|-------|-----|---------|
| `--saffron` | `#FF6B35` | Primary accent. Energy, urgency, tax revenue, action |
| `--saffron-light` | `#ff8c5a` | Lighter variant for hover states |
| `--gold` | `#FFC857` | Secondary warmth. Indirect taxes, highlights, callouts |
| `--cyan` | `#4AEADC` | Cool counterpoint. Borrowings, secondary data, per-capita |

### Per-Composition Palettes

Each homepage section has its own constrained palette:

- **Revenue (Waffle Chart)**: saffron (direct tax) + gold (indirect tax) + cyan (borrowings) + muted gray (non-tax). Four groups, not individual items.
- **Expenditure (Treemap)**: teal (`#4AEADC` family) for transfers/interest + saffron/orange family for ministry spending. Children are lighter tints of their parent.
- **Sankey (Flow)**: blue nodes (`#3B82F6`, revenue sources) + saffron center node + cyan nodes (expenditure destinations). Link gradients flow source-color to target-color.
- **Choropleth (Map)**: diverging scale — cyan (below median per-capita) through neutral (`#1a2230`) to saffron (above median per-capita).

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--positive` | `#34d399` | YoY increases, rebate applied |
| `--negative` | `#f87171` | YoY decreases, warnings |

---

## Typography

### Fonts

| Role | Font | Fallback |
|------|------|----------|
| Body | Inter (Variable) | system-ui, -apple-system, sans-serif |
| Mono/Numbers | JetBrains Mono (Variable) | Fira Code, monospace |

### Type Scale — Numbers as Heroes

The IIB pattern: the key number is physically enormous, supporting text scaled proportionally. Numbers are always in mono.

| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `.text-hero` | `clamp(3rem, 8vw, 7rem)` | 800 | The one hero number per page (e.g., Rs 50,65,345) |
| `.text-composition` | `clamp(1.5rem, 3vw, 2.5rem)` | 700 | Section titles ("Where the money goes") |
| `.text-stat` | `1.75rem` mono | 700 | Inline stats within visualizations |
| `.text-annotation` | `0.9375rem` (15px) | 400 | Descriptive text beside visualizations |
| `.text-caption` | `0.75rem` | 400 | Source attributions, legends, footnotes |
| `.text-section-num` | `0.6875rem` mono | — | Section markers (01, 02, 03...) |

### Gradient Text

Hero numbers use a saffron-to-gold gradient fill:
```css
.gradient-text-saffron {
  background: linear-gradient(135deg, var(--saffron), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Motion & Animation

### Principles

1. **Entrance, not decoration.** Animations serve to introduce content as the user scrolls. Once visible, elements are static. No perpetual bouncing or pulsing (except the subtle hero glow).
2. **Staggered reveals.** Elements within a section enter sequentially: title (0s) then subtitle (+0.1s) then data (+0.2s). Creates a reading rhythm.
3. **Ease-out-expo.** The primary easing curve is `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, smooth deceleration. Feels decisive, not sluggish.

### Timing

| Context | Duration | Easing |
|---------|----------|--------|
| Text entrance | 600ms | ease-out-expo |
| Visualization entrance | 800ms | ease-out-expo |
| Hover state | 150-300ms | ease |
| Page transition | 300ms | ease |
| Sankey link draw | 1200ms | ease-out-expo (two-wave: revenue 0-800ms, expenditure 800-1600ms) |

### Scroll-Triggered Patterns

- **Section entrances**: IntersectionObserver at 8-20% threshold triggers framer-motion `animate`
- **Narrative bridges**: Word-by-word opacity reveal tied to `useScroll` progress (Kasia Siwosz style)
- **Hero glow**: Subtle 4s pulse animation on the radial gradient behind the hero number

### What NOT to animate

- Table rows (too many elements, performance cost)
- Tooltip position changes (use instant repositioning, 60fps cursor tracking)
- Route transitions beyond a simple fade (keep navigation snappy)

---

## Layout & Spacing

### Grid

- 4px base grid for all spacing
- Section gap: `min(10vh, 96px)` — breathing room between compositions
- Container max: `max-w-7xl` (1280px) for most content
- Narrow container: `max-w-4xl` (768px) for CTA sections and narrative bridges

### Section Anatomy

Each homepage composition follows this structure:
```
[composition-divider — thin gradient line]
[NarrativeBridge — word-by-word reveal, generous py-24/py-32]
[composition-divider]
[Section]
  [SectionNumber — "01" in muted mono]
  [Title — text-composition]
  [Annotation — text-annotation, max-w-xl]
  [Visualization — full-width or grid layout]
  [Source attribution — text-caption, muted]
[/Section]
```

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px (mobile) | Single column. Viz stacks below text. DataTable becomes card layout. Bottom nav visible. |
| 768-1024px (tablet) | Side-by-side layouts begin. 2-column grids. |
| > 1024px (desktop) | Full layouts. Sticky annotation panels. Wide treemap/sankey. |

---

## Component Patterns

### Glass Header
- Fixed, full-width, z-50
- `backdrop-filter: blur(16px)` with scroll-aware background opacity (transparent at top, opaque on scroll)
- Active nav link: bottom saffron underline with `layoutId` animation (framer-motion)

### Tooltip (Shared)
- Cursor-following, 60fps via `mousemove`
- Glass background (`bg-glass` + blur)
- Compact hierarchy: TooltipTitle (bold) + TooltipRow (label: value pairs)
- Used by all visualizations — treemap, sankey, choropleth, waffle

### Cards (Interior Pages)
- `rounded-xl` with `bg-raised` background
- Left accent borders for metric cards (3px solid, accent color)
- Section headers use colored dots (saffron, cyan, gold) to categorize

### CTA Cards (GlowCard)
- `p-px` trick for gradient borders
- Hover: border brightens to full opacity + blur-xl glow at 12% + translateY(-4px) lift
- Each card has its own accent color

---

## Voice & Tone

### Headlines

Direct, declarative, present tense. The data speaks.

| Do | Don't |
|----|-------|
| "Where the money goes" | "Explore How the Government Spends Your Money" |
| "Follow the money" | "An Interactive Visualization of Revenue Flows" |
| "Rs 12.00 lakh crore to states" | "State-wise Budget Allocation Summary" |

### Annotations

Conversational but precise. Use "paisa" and "rupee" framing to make abstract numbers tangible.

| Do | Don't |
|----|-------|
| "For every rupee earned, the government borrows 28 paise more." | "Borrowings constitute 28.2% of total receipts." |
| "Nearly 1 in 4 rupees flows directly to state governments." | "24% of expenditure is allocated to state transfers." |
| "Each square = 1%" | "This waffle chart represents percentage distribution" |

### Key principles

1. **Numbers in Indian format.** Always: Rs 12,00,000 Cr. Never: Rs 12,000,00 or $1.2B.
2. **"Crore" and "lakh" are first-class units.** Don't convert to millions/billions.
3. **Annotations sit beside the data they describe.** Not in a separate paragraph above. The text and the visualization are one composition.
4. **Source attribution on every composition.** Small, muted, bottom of section: "Source: Union Budget 2025-26, Receipt Budget"
5. **No marketing speak.** This is a civic tool. The tone is informative and respectful — "here's the data, make your own conclusions."
6. **humanContext strings** are editorially reviewed cultural annotations (e.g., "Enough to buy 1,362 Tejas fighter jets"). They add texture but must be factually accurate and culturally sensitive.

---

## Technical Constraints

- **Tailwind v4 + CSS Layers**: All custom CSS must be in `@layer base` or `@layer components`. Unlayered CSS overrides Tailwind utilities (this was the root cause of a critical layout bug).
- **No Lenis/smooth-scroll libraries**: They interfere with native scroll on interior pages. Use native `scroll-behavior: smooth` only.
- **Framer Motion for entrance animations**, CSS transitions for hover/interactive states. Don't mix.
- **SVG for all visualizations**: d3 for layout computation, React for rendering. No canvas.
- **TopoJSON for India map**: Survey of India-compliant boundaries. State ID mapping via `stateMapping.ts`.
- **Prefers-reduced-motion**: All animations respect `@media (prefers-reduced-motion: reduce)` with near-zero durations.

---

## File Map (Key Design Files)

| File | Purpose |
|------|---------|
| `src/index.css` | All design tokens, CSS layers, keyframes |
| `src/components/ui/Tooltip.tsx` | Shared cursor-following tooltip |
| `src/components/ui/NarrativeBridge.tsx` | Scroll-triggered word reveal |
| `src/components/ui/SectionNumber.tsx` | Numbered section markers |
| `src/components/layout/Header.tsx` | Glass header with scroll-aware opacity |
| `src/components/layout/Footer.tsx` | Minimal footer |
| `src/components/home/HeroSection.tsx` | Hero with radial glow + animated counter |
| `src/components/home/CTASection.tsx` | GlowCard CTA cards |
| `src/hooks/useScrollTrigger.ts` | IntersectionObserver for section entrances |
