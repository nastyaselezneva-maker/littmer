# Category illustrations

15 SVG-файлов: 14 категорий + логотип. ViewBox 200×120 (категории), 40×40 (логотип).

## Файлы

| # | Файл | RU | NO | Фон карточки |
|---|---|---|---|---|
| 01 | `01-economy.svg`     | Экономика     | Økonomi    | `#fce8d6` |
| 02 | `02-society.svg`     | Общество      | Samfunn    | `#a8c4d8` |
| 03 | `03-science.svg`     | Наука         | Vitenskap  | `#9ec8b8` |
| 04 | `04-work.svg`        | Работа        | Arbeid     | `#e8d4a8` |
| 05 | `05-education.svg`   | Образование   | Utdanning  | `#d4c4e0` |
| 06 | `06-culture.svg`     | Культура      | Kultur     | `#f0c8d0` |
| 07 | `07-health.svg`      | Здоровье      | Helse      | `#fcd9c8` |
| 08 | `08-transport.svg`   | Транспорт     | Transport  | `#c8d8b8` |
| 09 | `09-nature.svg`      | Природа       | Natur      | `#b4d4b4` |
| 10 | `10-home.svg`        | Дом           | Hjem       | `#f4d8a4` |
| 11 | `11-food.svg`        | Еда           | Mat        | `#fce0c0` |
| 12 | `12-family.svg`      | Семья         | Familie    | `#f0d4dc` |
| 13 | `13-bureaucracy.svg` | Бюрократия    | Byråkrati  | `#d4d8e8` |
| 14 | `14-sport.svg`       | Спорт         | Sport      | `#bcd4d8` |
| — | `logo.svg`            | Логотип LittMer | — | — |

## Использование (React)

```jsx
import economy from '@/assets/illustrations/01-economy.svg';
// или как inline компонент через svgr/vite-plugin-svgr:
import { ReactComponent as Economy } from '@/assets/illustrations/01-economy.svg';

<div style={{ background: 'var(--cat-economy)' }}>
  <img src={economy} alt="Экономика" />
</div>
```

## Использование (HTML)

```html
<div class="cat-pic" style="background:#fce8d6">
  <img src="assets/illustrations/01-economy.svg" alt="Экономика" width="200" height="120">
</div>
```

## Данные карточек (готовый массив)

```js
export const CATEGORIES = [
  {n:"01", slug:"economy",     ru:"Экономика",     no:"Økonomi",    desc:"Налоги, банки, цены, NAV, BankID",     ct:45, lvls:["A1","B1"],          bg:"#fce8d6"},
  {n:"02", slug:"society",     ru:"Общество",      no:"Samfunn",    desc:"Дугнад, фолькелиг, выборы, соседи",     ct:38, lvls:["A2","B1"],          bg:"#a8c4d8"},
  {n:"03", slug:"science",     ru:"Наука",         no:"Vitenskap",  desc:"Полярная ночь, климат, фьорды",         ct:24, lvls:["B1","B2"],          bg:"#9ec8b8"},
  {n:"04", slug:"work",        ru:"Работа",        no:"Arbeid",     desc:"CV, собеседования, права работника",    ct:31, lvls:["A2","B1"],          bg:"#e8d4a8"},
  {n:"05", slug:"education",   ru:"Образование",   no:"Utdanning",  desc:"Школа, лансен, барнехаге",              ct:22, lvls:["A1","A2"],          bg:"#d4c4e0"},
  {n:"06", slug:"culture",     ru:"Культура",      no:"Kultur",     desc:"Праздники, кино, литература",           ct:36, lvls:["A2","B1","B2"],     bg:"#f0c8d0"},
  {n:"07", slug:"health",      ru:"Здоровье",      no:"Helse",      desc:"Fastlege, аптеки, страховка",           ct:28, lvls:["A1","B1"],          bg:"#fcd9c8"},
  {n:"08", slug:"transport",   ru:"Транспорт",     no:"Transport",  desc:"Автобусы, поезда, паромы",              ct:19, lvls:["A1","A2"],          bg:"#c8d8b8"},
  {n:"09", slug:"nature",      ru:"Природа",       no:"Natur",      desc:"Friluftsliv, горы, allemannsretten",    ct:34, lvls:["A2","B1","B2"],     bg:"#b4d4b4"},
  {n:"10", slug:"home",        ru:"Дом",           no:"Hjem",       desc:"Аренда, koselig, Икея, дугнад",         ct:25, lvls:["A1","A2"],          bg:"#f4d8a4"},
  {n:"11", slug:"food",        ru:"Еда",           no:"Mat",        desc:"Brunost, kanelboller, рыба, рождество", ct:22, lvls:["A0","A1","A2"],     bg:"#fce0c0"},
  {n:"12", slug:"family",      ru:"Семья",         no:"Familie",    desc:"Pappapermisjon, дети, родственники",    ct:18, lvls:["A1","B1"],          bg:"#f0d4dc"},
  {n:"13", slug:"bureaucracy", ru:"Бюрократия",    no:"Byråkrati",  desc:"Skatt, Folkeregister, фоставтак",       ct:21, lvls:["B1","B2"],          bg:"#d4d8e8"},
  {n:"14", slug:"sport",       ru:"Спорт",         no:"Sport",      desc:"Лыжи, футбол, плавание в фьорде",       ct:14, lvls:["A2","B1"],          bg:"#bcd4d8"},
];
```
