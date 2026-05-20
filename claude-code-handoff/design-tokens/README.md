# LittMer — Design Tokens

Design tokens for the LittMer landing aesthetic: warm paper, ink-black borders, hard offset shadows, hand-drawn marginalia.

## Files

| File | Use it for |
|---|---|
| `tokens.css` | Drop-in CSS custom properties. Import once at the root, use `var(--token)` everywhere. |
| `tokens.json` | Source of truth (W3C Design Tokens-flavored). Feed Style Dictionary, Tailwind, etc. |
| `tailwind.config.js` | Pre-wired Tailwind v3 config consuming the same values. |
| `fonts.html` | `<link>` tags for the three Google Fonts. |

## Aesthetic direction

**Children's-book editorial.** Three rules that hold the system together:

1. **Ink-black borders on everything that's a "thing".** Cards, buttons, chips, swatches. Border `2px solid var(--color-ink)`.
2. **Hard offset shadow, never soft.** `Npx Npx 0 var(--color-ink)` — no blur, no opacity. Cards lift on hover by translating up-left and growing the shadow by 1–2px.
3. **Three voices of type.** `Fraunces` (display, italic for emphasis), `Nunito` (body & UI), `Caveat` (handwritten — only for marginalia, not body).

## Color usage

- **Paper tones** (`--color-paper-*`) are surfaces. The page background is `--color-paper`; cards sit on `--color-paper-card`; alt sections use `--color-paper-warm`.
- **Ink tones** (`--color-ink-*`) are text and borders. Don't introduce gray.
- **Accents are sparing.** `--color-accent` (brand red) for CTAs and italic emphasis. `--color-accent-blue` for the handwritten Norwegian voice (`Caveat` text). `--color-accent-mustard` for the squiggly-underline highlight.
- **Category swatches** are pastel paper tints — meant for the top half of category cards behind a hand-drawn SVG.

## Typography rules

- Hero H1: `--fs-display-xl` / `--fw-semibold` / `--lh-display` / `--tracking-tight`. Italic words use `<em>` with `color: var(--color-accent)`.
- Section H2: `--fs-display-lg`, same family/weight. Italic phrase inside `<em>` shifts to `--color-accent-blue`.
- Lede: `--fs-body-xl` / `--lh-body` / `--color-ink-soft`, `<b>` returns to `--color-ink` for emphasis.
- All-caps eyebrow: `--fs-body-xs` / `--fw-bold` / `--tracking-wide` / uppercase.
- Handwritten notes: `--font-hand` / `--color-accent-blue`, often with `transform: rotate(-2deg)`.

## Header pattern

```css
header.top {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: var(--color-paper);
  border-bottom: var(--border-width-thin) solid var(--color-ink);
}
```

Inside: brand mark (serif wordmark, `em` half is colored), nav links (Nunito 600), language toggle (RU bold, NO muted), ghost "Войти" button + primary CTA. Buttons inside header use `--btn-sm` sizing (12px padding, `--radius-md`).

## Card / button frame pattern

The defining shape — reuse it for cards, buttons, level pills, plan cards, FAQ items, gloss tooltips:

```css
.frame {
  background: var(--color-paper-card);
  border: var(--border-width) solid var(--color-ink);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}
.frame:hover {
  transform: var(--hover-lift-lg);
  box-shadow: var(--shadow-hover-lg);
}
```

Adjust `--radius-*` and `--shadow-*` to taste — small chips use `sm`, hero demo uses `xl`.

## Tailwind quick start

```js
// tailwind.config.js  (provided)
import preset from './design-tokens/tailwind.config.js';
export default { presets: [preset], content: [...] };
```

Then: `bg-paper text-ink border-2 border-ink rounded-xl shadow-card`.
