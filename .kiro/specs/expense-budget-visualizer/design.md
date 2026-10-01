# Technical Design — Expense & Budget Visualizer

## Overview

A single-page web app built with plain HTML, CSS, and Vanilla JavaScript. No build step, no framework, no server. Opening `index.html` in any modern browser is all that is needed.

---

## Architecture

```
Browser
└── index.html
    ├── <link> css/style.css
    └── <script> js/app.js
            ├── State (in-memory arrays)
            ├── LocalStorage (persistence)
            ├── DOM manipulation (rendering)
            └── Chart.js (CDN) — pie chart
```

All application state lives in two in-memory arrays that are kept in sync with `localStorage`:

| Variable        | Storage Key                    | Shape |
|-----------------|-------------------------------|-------|
| `transactions`  | `budget_tracker_transactions` | `{ id, name, amount, category }[]` |
| `todos`         | `budget_tracker_todos`        | `{ id, text, done }[]` |

---

## Module Breakdown (`js/app.js`)

### 1. Constants
- `STORAGE_KEY` — localStorage key for transactions.
- `TODO_KEY` — localStorage key for todos.
- `CATEGORY_COLORS` — map of category → hex colour used by chart and badges.
- `CATEGORY_ICONS` — map of category → emoji.

### 2. State
- `let transactions` — loaded from localStorage on startup.
- `let todos` — loaded from localStorage on startup.
- `let todoFilter` — current active filter (`'all'` | `'active'` | `'done'`).

### 3. Storage helpers
- `loadFromStorage(key)` — safe JSON parse from localStorage; returns `[]` on error.
- `saveToStorage(key, data)` — JSON.stringify and write to localStorage.

### 4. Formatters / Utilities
- `formatNumber(n)` — `toLocaleString('id-ID')` for Rupiah formatting.
- `formatRupiah(n)` — prepends `'Rp '`.
- `generateId()` — `Date.now().toString(36)` + random suffix.
- `escapeHtml(str)` — replaces `&`, `<`, `>`, `"`, `'` to prevent XSS.

### 5. Validation helpers
- `showError(input, errorEl)` — adds `.invalid` class + `.visible` to error span.
- `clearError(input, errorEl)` — removes both.

### 6. Render functions
| Function | What it does |
|----------|-------------|
| `render()` | Calls all four sub-renders |
| `renderBalance()` | Sums transactions and updates `#totalBalance` |
| `renderList()` | Clears and rebuilds `#transactionList` |
| `renderChart()` | Groups totals by category, updates Chart.js data |
| `renderTodos()` | Filters todos by `todoFilter`, rebuilds `#todoList`, updates footer |

### 7. CRUD
- `addTransaction()` — reads form, pushes to array, saves, renders.
- `deleteTransaction(id)` — filters array, saves, renders.
- `addTodo()` — reads input, pushes to array, saves, renders.
- `toggleTodo(id)` — flips `.done`, saves, renders.
- `deleteTodo(id)` — filters array, saves, renders.
- `clearDoneTodos()` — filters out done items, saves, renders.

### 8. Event listeners
| Event | Element | Handler |
|-------|---------|---------|
| `submit` | `#transactionForm` | validate → addTransaction → reset |
| `submit` | `#todoForm` | validate → addTodo → reset |
| `click` | `.filter-btn` | update `todoFilter`, update active class, renderTodos |
| `click` | `#btnClearDone` | clearDoneTodos |
| `input` | `#itemName`, `#amount` | clearError (live) |
| `change` | `#category` | clearError (live) |
| `input` | `#todoInput` | clearError (live) |

---

## UI Layout (mobile-first, max-width 480 px)

```
┌─────────────────────────────┐
│  💰 Budget Tracker          │  ← app title
│ ┌─────────────────────────┐ │
│ │  Total Spent            │ │  ← balance card (gradient)
│ │  Rp 0                   │ │
│ └─────────────────────────┘ │
│                             │
│  ┌─ Add Transaction ──────┐ │
│  │ Item Name  [________]  │ │
│  │ Amount     [________]  │ │
│  │ Category   [▾ Select ] │ │
│  │       [+ Add]          │ │
│  └────────────────────────┘ │
│                             │
│  ┌─ Spending by Category ─┐ │
│  │       🥧 Pie Chart     │ │
│  └────────────────────────┘ │
│                             │
│  ┌─ Transaction History ──┐ │
│  │  • Item   Cat   Rp X ✕ │ │
│  │  • ...                 │ │
│  └────────────────────────┘ │
│                             │
│  ┌─ 📝 To-Do List ────────┐ │
│  │  [Add a task…]      +  │ │
│  │  [All] [Active] [Done] │ │
│  │  ☐ Task one          ✕ │ │
│  │  ☑ Task two (done)   ✕ │ │
│  │  2 tasks left  [Clear] │ │
│  └────────────────────────┘ │
└─────────────────────────────┘
```

---

## CSS Architecture (`css/style.css`)

| Section | Key decisions |
|---------|--------------|
| Reset & base | `box-sizing: border-box`, CSS custom properties (variables) for all colours, radii, shadows |
| Layout | `.app-wrapper` — centered column, max-width 480 px, 16 px side padding |
| Balance card | Linear gradient background, large bold amount, `box-shadow` glow |
| Cards | White surface, `border-radius: 14px`, subtle shadow; used for every section |
| Form | Stacked `flex` groups; focus ring via `box-shadow`; `.invalid` border state |
| Chart | Flexbox centering, `min-height: 240px`, canvas capped at 260 px |
| Transaction list | `max-height: 380px`, `overflow-y: auto`, custom slim scrollbar |
| Transaction item | Flex row: colour dot badge — info column — amount — delete button; `slideIn` animation |
| To-Do section | Same card shell; input row is `flex` with `+` button; filter tab row; task rows with checkbox |
| Responsive | `@media (max-width: 360px)` reduces font sizes |

---

## Data Flow Diagram

```
User action
    │
    ▼
Event Listener
    │  validates input
    ▼
CRUD function ──► mutates array ──► saveToStorage()
    │
    ▼
render()
    ├── renderBalance()   ──► updates #totalBalance text
    ├── renderList()      ──► rebuilds transaction <ul>
    ├── renderChart()     ──► updates Chart.js data + chart.update()
    └── renderTodos()     ──► rebuilds todo <ul> + footer count
```

---

## LocalStorage Schema

### `budget_tracker_transactions`
```json
[
  { "id": "lf3k2abc1", "name": "Lunch",  "amount": 25000, "category": "Food"      },
  { "id": "lf3k2abc2", "name": "Grab",   "amount": 15000, "category": "Transport" },
  { "id": "lf3k2abc3", "name": "Cinema", "amount": 75000, "category": "Fun"       }
]
```

### `budget_tracker_todos`
```json
[
  { "id": "td1abc", "text": "Buy groceries", "done": false },
  { "id": "td2abc", "text": "Pay electric bill", "done": true }
]
```

---

## Security Considerations

- All user-supplied strings rendered via `innerHTML` are passed through `escapeHtml()` first to prevent stored XSS.
- No external API calls; no user data ever leaves the browser.

---

## Dependencies

| Dependency | Version | How loaded |
|------------|---------|-----------|
| Chart.js   | 4.4.3   | CDN `<script>` in `<head>` — `chart.umd.min.js` |

No npm, no bundler, no build step required.
