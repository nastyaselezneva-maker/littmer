# LittMer — Frontend Handoff for Claude Code

Полный пакет для разработчика: design tokens, эталонная HTML-страница, скриншоты, инструкции по сборке.

## Что в пакете

```
claude-code-handoff/
├── HANDOFF.md                       ← этот файл
├── design-tokens/
│   ├── tokens.css                   ← CSS custom properties (drop-in)
│   ├── tokens.json                  ← W3C Design Tokens source
│   ├── tailwind.config.js           ← Tailwind v3 preset
│   ├── fonts.html                   ← <link> для Fraunces / Nunito / Caveat
│   └── README.md                    ← правила использования системы
├── reference/
│   └── LittMer Landing.html         ← эталонная одностраничная реализация
└── screenshots/
    ├── 01-hero.png                  ← hero + nav
    ├── 02-categories.png            ← карточки тем
    ├── 03-method.png                ← 3 шага + reader-демо
    └── 04-pricing.png               ← тарифы
```

## Эстетика — три правила

1. **Чёрные обводки на всём, что «вещь».** Карточки, кнопки, чипы, свотчи: `2px solid var(--color-ink)`.
2. **Жёсткая офсет-тень, никогда мягкая.** `Npx Npx 0 var(--color-ink)` — без блюра, без opacity. На hover карточка едет вверх-влево на 1–2px и тень растёт.
3. **Три голоса типографики.**
   - **Fraunces** (serif, opsz variable) — заголовки, italic для эмфазы
   - **Nunito** (rounded sans) — тело, UI, кнопки
   - **Caveat** (рукописный) — только маргиналии, подписи «на полях», подзаголовки на норвежском. **Никогда** в body-тексте.

## Цвет

| Назначение | Токен | Значение |
|---|---|---|
| Фон страницы | `--color-paper` | `#f6ecd6` |
| Альт. секция | `--color-paper-warm` | `#f3e3c1` |
| Поверхность карточки | `--color-paper-card` | `#fff8e8` |
| Текст / обводки | `--color-ink` | `#2a2418` |
| Вторичный текст | `--color-ink-soft` | `#5a4f3a` |
| Брендовый красный (CTA, italic эмфаза) | `--color-accent` | `#c5462e` |
| Норвежский синий (Caveat-текст) | `--color-accent-blue` | `#1f4d8f` |
| Жёлтое подчёркивание | `--color-accent-mustard` | `#e0a84a` |

Категорийные пастели — для верхней половины карточек тем (см. `--cat-*`).

## Структура страницы

1. **Sticky header** — бренд (`Litt` + красное `Mer` italic) + nav + RU/NO toggle + ghost «Войти» + primary CTA.
2. **Hero (2 колонки):** eyebrow chip → H1 84px (italic-эмфаза + волнистое подчёркивание) → handwritten subtitle на норвежском (Caveat, синий, slight rotate -1.5deg) → lede → CTA-row (primary + ghost + рукописная подпись «бесплатно» со стрелкой) → 4 stats. Справа — большой SVG-иллюстратор: горы, открытая книга с закладкой, плавающие пузыри со словами `fastlege`/`dugnad`/`koselig`, солнце, птица.
3. **Levels rail** — 6 пилюль A0..C1 с альтернирующим фоном (`#fff8e8`/`#f3e3c1`/`#fce8d6`).
4. **Categories grid 4×N** — 14 карточек: цветной верх с SVG (170px), № в кружке слева, уровни справа, низ с RU-названием (Fraunces 600), NO-названием (Caveat синий), описанием, dashed-разделителем и счётчиком.
5. **Method (warm bg)** — 3 шага с гигантским italic-номером (Fraunces 96px) + маленький SVG над ним. Ниже — `reader-demo` карточка: текст с подсвеченными норвежскими словами + сайдбар «на полях» с gloss-tooltip-ами.
6. **Quote + stats card.**
7. **Pricing (warm bg)** — 3 тарифа, центральный наклонён -1deg с лентой «любимый ✿» (Caveat на жёлтом).
8. **FAQ** — 5 пунктов, каждый с рукописным «Q.» в Caveat красного цвета.
9. **Footer** — тёмный (`--color-ink`), 4 колонки.

## Reusable patterns

### Frame (карточка / кнопка / чип)

```css
.frame {
  background: var(--color-paper-card);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);             /* 4px 4px 0 ink */
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.frame:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-xl);             /* 6px 6px 0 ink */
}
```

### Primary button

```css
.btn-primary {
  background: var(--color-accent);
  color: var(--color-paper-card);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  box-shadow: 3px 3px 0 var(--color-ink);
  font-family: var(--font-body);
  font-weight: 700;
  padding: 12px 22px;
}
```

Ghost — то же, но `background: transparent; color: ink`. Hover — `translate(-1px,-1px)` + тень `4px 4px 0`.

### Eyebrow chip

```html
<span class="eyebrow"><span class="dot"></span> NORSK · BOKMÅL · A0 → C1</span>
```

`background: paper-card`, `border 1.5px ink`, `border-radius: 999px`, `padding: 6px 14px`, `font-size: 12px / weight 700 / tracking 0.06em / uppercase`, `box-shadow: 2px 2px 0 ink`. Цветная точка слева — `--color-accent`.

### Squiggly underline (волнистая)

В H1 заворачиваем нужное слово в `<span class="squiggle">…</span>` — псевдоэлемент рисует SVG-волну `--color-accent-mustard` на 10px ниже baseline.

### Handwritten note

```html
<span class="hand-note">
  <svg class="hand-arrow">…</svg>
  бесплатно
</span>
```

`font-family: Caveat`, `color: --color-accent-blue`, `transform: rotate(-2deg)`. Стрелка — отдельный inline SVG со скруглёнными концами.

### Section header

```html
<div class="sec-head">
  <div class="sec-num">§ темы</div>
  <div>
    <h2 class="sec-title">14 тем — <em>тех, которых нет в курсах.</em></h2>
    <p class="sec-sub">…</p>
  </div>
</div>
```

`sec-num` — Caveat 40px, красный, `rotate(-3deg)`. `sec-title` — Fraunces 600, 54px, `<em>` синим italic.

## Иллюстрации

Все 14 категорийных + hero + step-иллюстрации — **inline SVG**, сделаны вручную в эстетике детской книги: толстая чёрная обводка `#2a2418`, минимум деталей, плоские заливки из категорийной палитры. Ссылки в коде:

- Hero: см. `<svg viewBox="0 0 520 520">` внутри `.hero-art`
- 14 категорий: см. объект `ILLUS` в `<script type="text/babel">`
- 3 step-illustrations: inline в `.steps`
- Reader-demo: HTML + CSS, без SVG

При расширении системы держи правила:
- viewBox 200×120 для категорий, 160×120 для step-ов
- обводка `#2a2418` толщиной 1.5–2px
- 2–3 цветных заливки максимум на иллюстрацию
- избегай градиентов и теней внутри SVG

## Шрифты

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..600&family=Caveat:wght@500..700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
```

Fraunces — variable, обязательно проставляй `font-variation-settings: 'opsz' 144` на больших заголовках.

## Tailwind quick start

```js
// tailwind.config.js
module.exports = {
  presets: [require('./design-tokens/tailwind.config.js')],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
};
```

Доступные классы: `bg-paper`, `bg-paper-card`, `text-ink`, `text-ink-soft`, `text-accent`, `border-ink`, `rounded-xl`, `shadow-card-lg`, `font-display`, `font-hand`, `text-display-xl`, и т.д.

## Контент-гайд (копирайт)

- Заголовки — короткие, с italic-эмфазой («Норвежский, *прочитанный по-русски*»).
- Норвежские слова в тексте — italic, без кавычек: *fastlege*, *dugnad*, *koselig*.
- Технические термины (NAV, BankID, helsenorge.no) — обычным текстом.
- Тон — тёплый, разговорный, без маркетингового пафоса. «Ты», не «вы».
- Числа в hero-stats — крупные Fraunces, подпись маленькая Nunito.

## Что НЕ делать

- ❌ Soft drop-shadows, blurs, glass-morphism
- ❌ Gradient backgrounds (только мягкие watercolor-blob внутри hero SVG)
- ❌ Inter, Roboto, system-ui для display-текста
- ❌ Caveat в body — только маргиналии
- ❌ Эмодзи (кроме одного `✿` в ленте «любимый» и `☕` в footer)
- ❌ Иконочные библиотеки — все иллюстрации hand-drawn SVG

## Сборка с нуля

1. Скопируй `design-tokens/` в проект как есть.
2. Подключи `tokens.css` в корневом stylesheet ИЛИ примени Tailwind preset.
3. Подключи fonts из `fonts.html`.
4. Открой `reference/LittMer Landing.html` рядом — он одностраничный, всё inline, легко расщепить на компоненты.
5. Скриншоты в `screenshots/` — финальный визуальный таргет.

Структуру компонентов рекомендую такую: `Header`, `Hero`, `LevelRail`, `CategoryCard` + `CategoryGrid`, `MethodStep` + `ReaderDemo`, `Quote`, `StatsCard`, `PricingPlan`, `FaqItem`, `Footer`. Иллюстрации — отдельные `.svg` файлы в `assets/illustrations/`.
