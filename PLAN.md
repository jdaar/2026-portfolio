# PLAN.md — Scrollytelling Portfolio Implementation

**Audience:** engineer or LLM implementing this page. Written to be self-contained: every decision includes the reasoning behind it, the alternatives that were considered, and the criteria used to pick the chosen path. Read top-to-bottom; sections build on each other.

**Source of truth:** `src/lib/assets/data.json`. Everything the page renders comes from that file.

---

## 0. How this plan was built (meta-reasoning)

Before writing any part of this plan, I asked myself three questions:

1. **What is the artifact selling?** Not the tools used, but the *impact* the developer produced. Concrete numbers (users served, hours saved, response times cut) beat adjectives. This informed the choice of scrollytelling — a format that lets each metric breathe with its own narrative beat, instead of drowning in a grid.

2. **What's already in the repo?** SvelteKit 2 + Svelte 5 + Tailwind 4 + GSAP + `adapter-static` are installed. No chart library. This means the plan should lean on what's there (no new heavy deps) and treat charts as first-class Svelte components — not as a third-party black box that fights the scroll engine.

3. **What data actually exists?** The `data.json` has 7 experiences, 12 projects, 14 highlights, 14 certifications, keyword clouds pre-weighted, and before/after pairs pre-computed. The narrative has to be built *around* what the data can prove — not what would be nice to say.

The rest of the plan is the consequence of those three questions.

### Design principles applied throughout

- **Data-driven, not copy-driven.** Every act renders from `data.json`; the narrative text just contextualizes numbers that are already there. This keeps the site truthful and easy to update.
- **Progressive enhancement.** Base HTML (SSR) shows all the content with no animation; scrollytelling is enhancement, not requirement. If JS fails, the visitor still learns everything.
- **One chart, one message.** Every visualization answers a single question. No composite dashboards where the eye doesn't know where to land.
- **Numbers front, words back.** Big numeric callouts first, prose second. This is a portfolio, not an essay.

---

## 1. Goal and success criteria

**Goal:** a single-page scrollytelling site that presents Jhonatan David Asprilla Arango as a Senior Software Engineer whose value proposition is *measurable engineering impact*.

**Success criteria (Definition of Done for the whole page):**

- Loads in under 2s on a fast connection (Lighthouse Performance ≥ 90).
- SSR-rendered HTML contains all facts and numbers even without JS.
- Every scroll act has a visualization that reflects data pulled directly from `data.json`.
- Respects `prefers-reduced-motion` (no forced animations for users who opted out).
- Bilingual (en/es) with a single toggle; content already exists bilingually in `data.json`.
- No console errors, no CLS above 0.1, no layout thrash on scroll.

If any of those fails, the page is not done.

---

## 2. Narrative arc (10 acts)

The narrative already exists in `data.json` under `narrative[]`. Each entry has `act`, `id`, `section`, `title.{en,es}`, `subtitle.{en,es}`, `body.{en,es}`, `visualizations[]`, and `dataRefs[]`.

**Why 10 acts and not fewer:** the story has three distinct signature engagements (L.O. Trading, SURA México, Diners Club) that each deserve their own pinned moment. Compressing them would waste the strongest evidence in the CV.

**Why in this order:**

| # | id | Why it comes here |
|---|---|---|
| 1 | `hook` | Highest-magnitude number up front (250K users). Establish "this person moves real numbers." |
| 2 | `origin` | Once curious, the visitor wants context. Timeline anchors the whole story chronologically. |
| 3 | `foundations` | Firplak is small in stack but huge in *pattern*: automation → time saved. Introduces the "measurable engineering" thesis. |
| 4 | `consultancy` | Zooms out to show four parallel worlds. Prepares the visitor for the deep-dives that follow. |
| 5 | `signature-lotrading` | Strongest single story: rescued a failed launch, with hard numbers on both sides (before/after). |
| 6 | `signature-suramx` | Complements #5 with scale numbers (100K/mo) and the async-architecture story. |
| 7 | `signature-diners` | Closes signature triptych with the largest user-base story and the AI Center enablement. |
| 8 | `ai-thread` | Elevates the AI moments from #6 and #7 into a portfolio-level thread. |
| 9 | `arsenal` | Only now does the "list of tools" appear — after the impact has been proven. |
| 10 | `present-cta` | Ends where the visitor should act: contact card. |

**Alternative considered:** starting with the arsenal (word cloud of tech). Rejected because it makes the page indistinguishable from every other developer portfolio.

**Alternative considered:** merging the three signature acts into one long "case studies" section. Rejected because pinning-and-scrubbing works best on one focused chart per screen; three side-by-side would fragment attention.

---

## 3. Visualization catalog

Each viz is a Svelte component under `src/lib/charts/`. The `narrative[].visualizations[]` array uses IDs shaped as `component:variant` so the section templates know what to mount.

### 3.1 `AnimatedCounter.svelte` — variants `counter:*` and `counters:hero`

- **Purpose:** headline numbers. Animates from `0` to `numericValue` over ~1.5s the first time it enters the viewport.
- **Data:** `highlights[i].numericValue`, `highlights[i].unit`, `highlights[i].displayValue`, `highlights[i].formatHint`.
- **Format hints and their meaning:**
  - `compact` → format with `Intl.NumberFormat(lang, { notation: 'compact' })` (`250K`, `100K`).
  - `integer` → thousands separators (`1,560`).
  - `percent` → append `%`.
  - `percent-decimal` → two decimals + `%` (`22.41%`).
  - `decimal` → two decimals (`0.87`).
  - `multiplier` → append `×`.
- **Why we added `displayValue`:** counters are often "close enough" (60+, 250K+, ≈1,560). `displayValue` holds the human-written form; the counter interpolates to `numericValue` and, at the end, swaps the DOM text to `displayValue` so the reader sees the actual copy (`250K+`) rather than the raw number (`250000`).
- **Reduced-motion fallback:** render `displayValue` directly.

### 3.2 `TimelineGantt.svelte` — `timelineGantt`, `timeline:certifications`

- **Purpose:** show career and cert chronology at a glance.
- **Data:** `timeline.work`, `timeline.education`, `timeline.certifications`.
- **Render:** horizontal SVG with three rows (work / education / certifications). Work items with `parent: "sofka"` render nested inside the Sofka bar (offset in y, thinner bar).
- **Scroll behavior:** as the viewport scrolls through Act 2, a vertical "now marker" moves across the timeline; each bar becomes fully opaque when the marker is over it. Uses `scrub: 1`.
- **Why SVG and not `<canvas>`:** SVG DOM nodes are text-accessible for screen readers, easier to hover with tooltips, and interpolate cleanly with GSAP.
- **Alternative considered:** vis-timeline npm package. Rejected because it ships too much CSS and doesn't play well with pinned scroll.

### 3.3 `SlopeChart.svelte` — `slope:*`

- **Purpose:** before/after comparisons. Two labeled dots connected by a line.
- **Data:** any entry under `chartData.beforeAfter` (there are five: apiResponseTimeSec, projectTimelineMonths, reportGenerationSec, aiMaturitySuramx, aiMaturityDiners).
- **Render:** two vertical axes (left = "before", right = "after"), a diagonal line, delta text between them.
- **Scroll behavior:** the line draws itself (`stroke-dasharray` animated) as the user scrolls through the pinned section. The delta chip fades in at the end.
- **Why slope over bar chart:** slope makes direction and magnitude of change instantly readable ("it went down"), while bar comparisons force the eye to read numbers.

### 3.4 `WordCloud.svelte` — `wordCloud:technologiesAll`, `wordCloud:bankingStack`

- **Purpose:** show breadth of stack; category color-coding shows depth.
- **Data:** `keywordClouds.technologies` (~70 items). Variants filter by category or by project.
- **Render:** custom SVG cloud (d3-cloud is a common pick, but you can build a simple spiral placer in ~40 lines). Font-size = `weight` mapped to a range. Fill = `category` mapped to a palette.
- **Interactive filter:** category legend acts as toggle. Filtered-out words fade to 20% opacity.
- **Why not `react-wordcloud`-style libs:** they force React or add non-trivial bundle size. A native Svelte SVG cloud is ~2KB.

### 3.5 `DonutIndustry.svelte` — `donutIndustry`

- **Purpose:** show industry breadth (banking, insurance, logistics, manufacturing, AI).
- **Data:** `chartData.industryMix`.
- **Render:** SVG donut with legend. On hover, industry slice highlights the corresponding experience card list at side.

### 3.6 `StackedFeatures.svelte` — `stackedFeatures:*`

- **Purpose:** show what *kind* of value each project delivered (automation, ux, security, performance, integration, analytics, ai...).
- **Data:** `projects[].featureCategories` (object of `{ category: count }`).
- **Render:** one horizontal stacked bar per project, colored by category, labeled by category count.

### 3.7 `GeoMap.svelte` — `geoMap`

- **Purpose:** subtle but powerful — show that work spanned three countries.
- **Data:** `experiences[].clientLocation.{country,city,lat,lng}`. Coordinates are already in the JSON. Colombia, Ecuador, Mexico are the three countries currently represented.
- **Render:** simplified TopoJSON of Latin America; dots at each city sized by engagement duration; hover reveals the experience card.
- **Note on data quality:** `clientLocation.verified: false` marks entries that need user confirmation (Firplak, L.O. Trading, Zanacode — see §11.2). The map can show them but should be flagged in dev logs when `verified=false`.

### 3.8 `ContactCard.svelte` — `contactCard`

- **Purpose:** the closing CTA. Not a chart, but treated like one for consistency.
- **Data:** `profile.contact.emails`, `profile.contact.meeting`, `profile.contact.linkedin`.
- **Render:** three big touchable buttons; each opens the appropriate app (mailto:, https:, https:).

### 3.9 Naming convention

Viz IDs in `narrative[].visualizations[]` follow `component:variant`:
- `counter:usersServed` → mount `AnimatedCounter`, pick highlight matching `context: usersServed`.
- `slope:apiResponseTime` → mount `SlopeChart`, use `chartData.beforeAfter.apiResponseTimeSec`.
- `counters:hero` → mount several `AnimatedCounter`s side by side.

The section component (`05a-Signature-LOT.svelte`, etc.) parses these strings and mounts the right components with the right props.

---

## 4. Tech stack decisions

### 4.1 Framework: SvelteKit 2 + Svelte 5

**Kept as-is.** Already installed. Svelte 5's runes (`$state`, `$derived`, `$effect`) make chart reactivity almost free — you write `$derived(interpolate(before, after, progress))` and the DOM updates automatically. No React reconciler tax.

### 4.2 Animation: GSAP + ScrollTrigger

**Kept as-is.** GSAP is the de-facto standard for scrollytelling. ScrollTrigger's `pin`, `scrub`, and `snap` cover 100% of what this page needs. Alternatives (Motion One, Framer Motion, native View Transitions) either lack pin-and-scrub or are React-only.

### 4.3 Charts: hand-written SVG, no chart library

**Decision:** write charts as Svelte components with plain SVG.

**Why:**
- Full control over the animation state — every chart primitive is a Svelte reactive variable, so binding it to a GSAP `progress` value is one line.
- No bundle bloat. A slope chart is 60 lines of SVG + math. A donut is ~80. A word cloud with spiral placement is ~120. Total custom-chart code is smaller than the smallest chart library.
- No conflicts with SSR: SVG renders on the server without special config.

**Alternatives considered and rejected:**
- **`d3` (whole thing):** too big and too imperative; imperative D3 fights Svelte's reactive updates.
- **`layerchart` (Svelte-native):** genuinely good, but it's opinionated about layout and adds ~40KB. Fine if the project later grows into a dashboard; overkill here.
- **`echarts` / `chart.js` (canvas-based):** canvas can't be styled by CSS, is opaque to screen readers, and doesn't animate cleanly with GSAP timelines (you have to redraw the whole frame on every scroll tick).

**Escape hatch:** we can pull in `d3-scale` and `d3-shape` (single-purpose modules, ~3KB each) if the math for one specific chart gets tedious. That's the cheap upgrade; the full framework is not.

### 4.4 CSS: Tailwind 4

**Kept as-is.** Utility classes make section-level theming (each act can pick up `experiences[i].brandColor` via CSS variables) simple.

### 4.5 Static output: `adapter-static`

**Kept as-is.** The whole page is prerenderable at build time — there's no backend, no session, no dynamic content. Prerender + CDN = free performance win.

### 4.6 What we're NOT adding

- No CMS. `data.json` is the CMS.
- No i18n framework (like `svelte-i18n`). A 20-line store + a `t(obj)` helper covers our needs — the whole content is already bilingual objects.
- No headless charting engine. See §4.3.

---

## 5. File structure

```
src/
├── lib/
│   ├── assets/
│   │   └── data.json                        # source of truth (already exists)
│   ├── stores/
│   │   ├── lang.ts                          # current language 'en' | 'es'
│   │   └── motion.ts                        # honors prefers-reduced-motion
│   ├── utils/
│   │   ├── t.ts                             # t({ en, es }) helper
│   │   ├── format.ts                        # Intl formatters keyed by formatHint
│   │   └── interpolate.ts                   # numeric/color/date interpolators
│   ├── charts/
│   │   ├── AnimatedCounter.svelte
│   │   ├── TimelineGantt.svelte
│   │   ├── SlopeChart.svelte
│   │   ├── WordCloud.svelte
│   │   ├── DonutIndustry.svelte
│   │   ├── StackedFeatures.svelte
│   │   ├── GeoMap.svelte
│   │   └── ContactCard.svelte
│   └── scroll/
│       ├── ScrollSection.svelte             # wrapper: applies pin + scrub + reduced-motion fallback
│       ├── VisualizationSlot.svelte         # parses "component:variant" and mounts the right chart
│       ├── 01-Hook.svelte
│       ├── 02-Timeline.svelte
│       ├── 03-Foundations.svelte
│       ├── 04-Consultancy.svelte
│       ├── 05a-Signature-LOT.svelte
│       ├── 05b-Signature-SURA.svelte
│       ├── 05c-Signature-Diners.svelte
│       ├── 06-AIThread.svelte
│       ├── 07-Arsenal.svelte
│       └── 08-Present.svelte
└── routes/
    ├── +layout.svelte                       # global chrome, lang toggle, GSAP registration
    ├── +page.ts                              # load data.json + prerender = true
    └── +page.svelte                          # imports all 10 section components in order
```

**Why 10 section files instead of one big `+page.svelte`:** each section owns its own animation timeline. Splitting them keeps timeline setup local to the DOM it targets, and makes it obvious which files to touch when narrative changes.

**Why `VisualizationSlot`:** the narrative in `data.json` lists visualizations as strings (`slope:apiResponseTime`). A single slot component parses these strings and dispatches to the right chart. This keeps section files thin — they read narrative, they mount slots, done.

---

## 6. Animation pattern

### 6.1 The one pattern used everywhere

```svelte
<!-- ScrollSection.svelte (sketch) -->
<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { reducedMotion } from '$lib/stores/motion';

  let { children, pin = true, scrub = 1 } = $props();
  let container;
  let progress = $state(0);

  onMount(() => {
    if ($reducedMotion) { progress = 1; return; }
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=100%',
      pin,
      scrub,
      onUpdate: (self) => { progress = self.progress; }
    });
    return () => st.kill();
  });
</script>

<section bind:this={container} class="scroll-section">
  {@render children({ progress })}
</section>
```

Every chart accepts a `progress` prop between 0 and 1. The chart interpolates its own visual state from that number. GSAP is only responsible for producing `progress`; the chart owns everything else.

**Why this pattern:**
- Decouples "how does scroll behave" (ScrollTrigger's job) from "how does the chart look at 0.3" (the chart's job).
- Makes reduced-motion trivial: force `progress = 1` and the chart renders its final state.
- Makes SSR trivial: on the server, `progress = 1` too, so the SSR HTML is the "finished" render.

### 6.2 One-shot vs. scrubbed

- **Scrubbed** (default): visual state maps to scroll position. Use for signature acts and the timeline (§3.3, §3.2).
- **One-shot**: fires once when the section enters viewport. Use for headline counters (§3.1). Implementation: same wrapper but with `scrub: false` and a `onEnter` callback that runs an internal GSAP timeline.

### 6.3 Why not just use CSS `@scroll-timeline`

Because Safari doesn't ship it yet (as of writing) and the polyfill has issues with pinned sections. Revisit when browser support hits ~95%.

---

## 7. Data flow

### 7.1 Load

```ts
// src/routes/+page.ts
import data from '$lib/assets/data.json';
export const prerender = true;
export function load() { return { data }; }
```

`data.json` is imported statically; Vite bundles it. The whole 70KB blob ships in the HTML payload (prerendered), so no runtime fetch is needed.

**Why static import over `fetch('/data.json')`:** static import lets Vite tree-shake unused branches, gives TypeScript autocomplete for free, and eliminates a network round-trip during SSR.

### 7.2 Propagation

Sections receive `data` as a prop. They pluck what they need:

```svelte
<!-- 05a-Signature-LOT.svelte -->
<script>
  let { data } = $props();
  const act = data.narrative.find(n => n.id === 'signature-lotrading');
  const experience = data.experiences.find(e => e.id === 'lotrading');
  const before = data.chartData.beforeAfter.apiResponseTimeSec;
</script>
```

No global state, no context. Everything is a lookup.

### 7.3 TypeScript

Generate a type from the JSON with a small build step or hand-write an interface. For a first pass, `import data from '$lib/assets/data.json'` gives you inferred types automatically because Vite treats JSON as a typed module.

---

## 8. Internationalization

### 8.1 Store

```ts
// src/lib/stores/lang.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initial = browser ? (localStorage.getItem('lang') || 'es') : 'es';
export const lang = writable<'en' | 'es'>(initial);
if (browser) lang.subscribe(v => localStorage.setItem('lang', v));
```

Default is `es` because the developer is based in Colombia and the primary audience is likely Spanish-speaking. The toggle is one button in the layout header.

### 8.2 Helper

```ts
// src/lib/utils/t.ts
import { get } from 'svelte/store';
import { lang } from '$lib/stores/lang';

export function t(obj: { en: string; es: string }): string {
  return obj[get(lang)];
}
```

For reactive usage in Svelte 5:

```svelte
<script>
  import { lang } from '$lib/stores/lang';
  let { data } = $props();
  const summary = $derived(data.profile.summary[$lang]);
</script>
```

### 8.3 What's already bilingual in `data.json`

- `profile.summary`
- `narrative[].title` / `.subtitle` / `.body`
- `experiences[].description`
- `projects[].description`
- `projects[].features[].name` (some — see file for exceptions)

What is NOT bilingual (English only for now):
- `highlights[].title` / `.subtitle` / `.context` — these are compact and can be bilingualized later without breaking the schema.
- Certification names — mostly proper nouns.

**Fallback rule:** if `.es` is missing, fall back to `.en`, never to empty. Encode this in `t()`.

---

## 9. Accessibility

### 9.1 Reduced motion

Detect and honor `prefers-reduced-motion: reduce`. When active:
- Skip all `ScrollTrigger.pin` calls; the page becomes a normal vertical scroll.
- Counters render `displayValue` directly (no interpolation).
- Slope charts render fully drawn.
- Word cloud renders in its "unfiltered" final state, no cascading fade-in.

```ts
// src/lib/stores/motion.ts
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const reducedMotion = readable(false, (set) => {
  if (!browser) return;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  set(mq.matches);
  const l = (e: MediaQueryListEvent) => set(e.matches);
  mq.addEventListener('change', l);
  return () => mq.removeEventListener('change', l);
});
```

### 9.2 Semantic HTML

- Each act is `<section aria-labelledby="act-N-title">` with an `<h2 id="act-N-title">` inside.
- Charts include `<title>` and `<desc>` inside their SVG for screen readers.
- Counters include the final value as text visible to assistive tech even during animation (`<span class="sr-only">{displayValue}</span>`).

### 9.3 Keyboard

- Language toggle is a button, focusable, `aria-pressed` state.
- Contact card CTAs are anchors, focusable in tab order.
- Nothing else is interactive by default — the scroll narrative is passive.

### 9.4 Contrast

`experiences[].brandColor` is used for section accents (borders, chart line color) — not for text on background. Text always uses tokens from Tailwind's default palette to guarantee AA contrast.

---

## 10. Performance

### 10.1 SSR + prerender

`export const prerender = true` in `+page.ts` produces a static HTML file at build time. Deploy target: any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

### 10.2 Lazy mounting

Sections 5a/5b/5c/6/7 are below the fold on first paint. Wrap them in a `<LazySection>` that uses `IntersectionObserver` to mount their heavy chart children only when they're ~200vh from entering the viewport. Section shell (title, prose) is always rendered so SSR HTML is complete.

### 10.3 GSAP registration

Register `ScrollTrigger` only once in `+layout.svelte`, guarded by `browser` from `$app/environment`. Kill triggers on `beforeNavigate` to avoid leaks.

### 10.4 Fonts

Use `font-display: swap` and preload one weight per family. Text is critical; a FOIT would tank perceived performance.

### 10.5 Images

The `favicon.svg` is the only image asset today. If project screenshots are added later, use `<enhanced:img>` from `@sveltejs/enhanced-img` (needs a small vite config).

---

## 11. Changes made to `data.json` (and why)

All four optional changes are now applied. What they look like and why they exist:

### 11.1 `highlights[].numericValue`, `.unit`, `.displayValue`, `.formatHint`

```json
{
  "kind": "impact",
  "title": "250,000+ banking users served",
  "value": "250K+",
  "numericValue": 250000,
  "unit": "users",
  "displayValue": "250K+",
  "formatHint": "compact"
}
```

- `numericValue`: raw number used to interpolate counters from 0. **Why:** parsing strings like `"250K+"` is fragile; a real number lets `Intl.NumberFormat` and math work cleanly.
- `unit`: label shown next to the animated number.
- `displayValue`: preserved human-authored form (`"250K+"`, `"≈1,560 h/year"`). Shown after the animation ends so the reader sees the copy the author wrote, not the raw value.
- `formatHint`: tells the formatter which `Intl.NumberFormat` options to apply (`compact`, `percent`, `decimal`, `integer`, `multiplier`, `percent-decimal`). **Why:** removes formatting logic from the counter component itself.

### 11.2 `experiences[].clientLocation`

```json
"clientLocation": {
  "country": "Ecuador",
  "city": "Quito",
  "lat": -0.1807,
  "lng": -78.4678,
  "verified": true
}
```

- **Why:** without coordinates, no geo-map. Coordinates are cheap to add and unblock §3.7.
- `verified: true` for engagements where the client's country is well-known (Diners Club Ecuador, SURA México, Sofka Colombia, BMC Colombia).
- `verified: false` for engagements where I placed a best-guess city (Firplak, L.O. Trading, Zanacode) — **please confirm these before shipping the map**. The map component should log a dev-mode warning when it renders an unverified location.

### 11.3 `experiences[].brandColor`

```json
"brandColor": "#004990"
```

- **Why:** each section can theme its accents (borders, chart line color) with a color the visitor already associates with the brand — improves recall and visual variety.
- Colors used are approximations of public brand palettes; tweak in the JSON, not in components, so the theming stays data-driven.

### 11.4 `narrative[]` (top-level)

Ten entries corresponding to the 10 acts. Each entry has:

```json
{
  "act": 5,
  "id": "signature-lotrading",
  "section": "05a-Signature-LOT",
  "title":    { "en": "...", "es": "..." },
  "subtitle": { "en": "...", "es": "..." },
  "body":     { "en": "...", "es": "..." },
  "visualizations": ["slope:apiResponseTime", "slope:projectTimeline", "counter:effortReduction"],
  "dataRefs": ["chartData.beforeAfter.apiResponseTimeSec", "..."]
}
```

- **Why keep narrative in the JSON:** editing copy without touching component code, easy translation review, and it makes clear which data each act depends on (`dataRefs`).
- **Alternative considered:** narrative inline in `.svelte` files. Rejected because it couples copy to layout and complicates translation review.
- `visualizations[]` is the contract between narrative and section templates — the section reads it and mounts the corresponding chart components via `VisualizationSlot`.

---

## 12. Implementation order

Follow this order. Each step has a clear "done when…" criterion. Do NOT skip ahead.

### Step 1 — Skeleton (½ day)

- [ ] Create `src/lib/stores/lang.ts` and `src/lib/stores/motion.ts`.
- [ ] Create `src/lib/utils/t.ts` and `format.ts`.
- [ ] Update `src/routes/+layout.svelte` to include a language toggle and register GSAP once.
- [ ] Update `src/routes/+page.ts` to load `data.json` and set `prerender = true`.
- [ ] Update `src/routes/+page.svelte` to render 10 placeholder sections that just show `narrative[i].title` and `narrative[i].body`.

**Done when:** `npm run dev` shows all 10 acts as static text, bilingual toggle works, `npm run build` succeeds.

### Step 2 — Scroll wrapper (½ day)

- [ ] Create `src/lib/scroll/ScrollSection.svelte` following §6.1.
- [ ] Create `src/lib/scroll/VisualizationSlot.svelte` (no charts yet — just log the string).
- [ ] Wrap acts 1 and 10 with `ScrollSection`. Verify pin and scrub behave.

**Done when:** scrolling through acts 1 and 10 pins them; reducing motion in DevTools disables the pin.

### Step 3 — First chart end-to-end: AnimatedCounter (½ day)

- [ ] Implement `AnimatedCounter.svelte` using `formatHint`.
- [ ] Wire it into `01-Hook.svelte` reading 4 highlights.
- [ ] Verify: interpolates from 0, ends with `displayValue`, screen reader announces the final value.

**Done when:** Act 1 renders 4 live counters, and reduced-motion mode shows the values instantly.

### Step 4 — Timeline Gantt (1 day)

- [ ] Implement `TimelineGantt.svelte` with SVG rows for work / education / certifications.
- [ ] Wire it into `02-Timeline.svelte` with scrubbed "now marker".

**Done when:** scrolling Act 2 sweeps a marker across the timeline and each bar becomes opaque as the marker passes.

### Step 5 — Slope charts + three signature acts (2 days)

- [ ] Implement `SlopeChart.svelte`.
- [ ] Implement `05a-Signature-LOT.svelte` with two slopes + one counter.
- [ ] Implement `05b-Signature-SURA.svelte` with three visualizations.
- [ ] Implement `05c-Signature-Diners.svelte` with a counter + word cloud + slope.

**Done when:** the three signature acts read cleanly with pin+scrub and every viz reflects `data.json` accurately.

### Step 6 — Word cloud + industry donut (1 day)

- [ ] Implement `WordCloud.svelte` with category filter.
- [ ] Implement `DonutIndustry.svelte`.
- [ ] Wire into `04-Consultancy.svelte` and `07-Arsenal.svelte`.

**Done when:** category legend on the word cloud toggles filters; donut hover surfaces engagement lists.

### Step 7 — Stacked features + AI thread (½ day)

- [ ] Implement `StackedFeatures.svelte`.
- [ ] Wire into `03-Foundations.svelte` and `06-AIThread.svelte`.

**Done when:** each project renders its feature-category breakdown.

### Step 8 — Geo map (1 day, optional)

- [ ] Fetch or bundle a Latin America TopoJSON.
- [ ] Implement `GeoMap.svelte` reading `clientLocation`.
- [ ] Add to `04-Consultancy.svelte` as a companion to the donut.
- [ ] Log a warning when rendering `verified: false` locations.

**Done when:** the three represented countries show markers with hover popovers.

### Step 9 — Contact card + polish (½ day)

- [ ] Implement `ContactCard.svelte`.
- [ ] Wire into `08-Present.svelte`.
- [ ] Full accessibility pass: `sr-only` labels, focus states, contrast check.
- [ ] Full performance pass: Lighthouse, network waterfall, kill unused triggers.

**Done when:** Lighthouse ≥ 90 across all four scores.

### Step 10 — Bilingual fill-in and QA (½ day)

- [ ] Any hard-coded UI strings moved to a `messages.ts` bilingual map.
- [ ] Full read-through in both languages.
- [ ] Confirm the three `verified: false` `clientLocation` entries or update them.

**Done when:** every visible string switches with the language toggle.

**Total estimate:** ~7.5 developer-days.

---

## 13. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| GSAP pin conflicts with sticky headers or overflow ancestors | Sections don't pin | Never use `overflow: hidden` on `<body>` or ancestors of pinned sections. Test in the layout scaffold before building charts. |
| Word cloud placement algorithm produces overlaps at small viewports | Cloud looks broken on mobile | Use a spiral placer with collision detection; on `< 640px`, switch to a simple wrapping tag list. |
| `data.json` grows large enough to slow first render | Bundle bloat | Split into `data.core.json` (profile, narrative, highlights) inline and `data.projects.json` fetched lazily when past Act 3. Not needed at current 70KB. |
| Users on Firefox trigger a specific GSAP + Svelte 5 quirk with pinned sections | Broken layout | Verify on Firefox, Safari, and Chrome each step. Keep pinned sections simple (one child pinned, not multiple siblings). |
| Client-location placeholders ship without verification | Map shows a wrong city | The map's `verified: false` warning + a checklist item at Step 10 covers this. |
| Reduced-motion is silently forgotten in one chart | Fails a11y audit | The `ScrollSection` wrapper forces `progress = 1` centrally, but each chart's *entrance* animation (opacity fade-in via CSS) also needs a `@media (prefers-reduced-motion: reduce)` override. Grep for `transition` at the end of Step 9. |

---

## 14. Appendix — Glossary for anyone new to the terms

- **Scrollytelling:** a narrative technique where the page's story advances as the reader scrolls. Usually implemented by *pinning* a visual (holding it in place) while the accompanying text scrolls past.
- **Pin:** in GSAP ScrollTrigger, means the element stays visually locked at its position while the scroll offset advances. Feels like "sticky" but with more control.
- **Scrub:** ties animation progress directly to scroll progress. A value of `1` means the animation catches up smoothly over one second when the scroll stops.
- **Slope chart:** a compact chart of two data points connected by a line; excellent for before/after comparisons.
- **Sankey chart:** a flow diagram; here it would map companies → projects → technologies.
- **CRDT** (mentioned in `data.json` for iTarget): conflict-free replicated data type — a data structure that lets offline devices sync without a coordinator.
- **RAG** (mentioned for the WhatsApp bot): retrieval-augmented generation — pull relevant docs from a vector store, feed them into an LLM prompt.
- **`prefers-reduced-motion`:** an OS-level user preference exposed via CSS media query. Users who set it want less movement on screen.
- **SSR:** server-side rendering — the HTML is produced on the server (or at build time for prerender) so the first page load doesn't wait for JS.

---

## 15. Where to start if you're picking this up cold

1. Read `src/lib/assets/data.json` completely once. The narrative reads like a brief.
2. Read this file top to bottom.
3. Do Step 1 (skeleton). You'll see the 10 acts as text — that's the entire content of the site already, unstyled.
4. Do Step 2 (scroll wrapper). Once one section pins correctly, the rest follow the same shape.
5. From Step 3 onward, each step is independent enough that you can pause between them.

If a decision in this document ever conflicts with what the data actually supports, trust the data — this document is a plan, `data.json` is the truth.
