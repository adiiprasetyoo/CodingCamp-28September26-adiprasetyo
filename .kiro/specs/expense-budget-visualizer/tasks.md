# Implementation Plan

## Overview

This plan covers the full build of the Expense & Budget Visualizer — a single-page HTML/CSS/JS app that lets users track transactions by category, visualise spending with a Chart.js pie chart, and manage a to-do list. All data persists to `localStorage`. The work is broken into six phases: scaffold, HTML structure, styling, JavaScript logic, integration verification, and new features (dark/light mode, monthly summary, sort).

## Tasks

### Status Legend
- `[ ]` Not started
- `[x]` Complete

---

### Phase 1 — Project Scaffold

- [x] **TASK-01** Create `css/` and `js/` directories inside the project root.
- [x] **TASK-02** Create `index.html` with correct `<meta charset>`, `<meta viewport>`, link to `css/style.css`, and `<script>` for Chart.js CDN + `js/app.js`.

---

### Phase 2 — HTML Structure

- [x] **TASK-03** Add header section with app title and `#totalBalance` balance card.
- [x] **TASK-04** Add "Add Transaction" form with fields: `#itemName`, `#amount`, `#category` (select), submit button, and inline error `<span>` elements.
- [x] **TASK-05** Add chart section with `<canvas id="spendingChart">` and `#chartEmpty` empty-state paragraph.
- [x] **TASK-06** Add transaction history section with `<ul id="transactionList">` and `#listEmpty` placeholder.
- [ ] **TASK-07** Add To-Do List section with:
  - `<form id="todoForm">` containing `#todoInput` and add `+` button
  - Filter tab buttons (All / Active / Done)
  - `<ul id="todoList">` and `#todoEmpty` placeholder
  - Footer row with `#todoCount` and `#btnClearDone`

---

### Phase 3 — Styling (`css/style.css`)

- [x] **TASK-08** CSS reset, custom properties (colours, radius, shadow, font).
- [x] **TASK-09** App wrapper layout (centered column, max-width 480 px).
- [x] **TASK-10** Header + balance card styles (gradient background, large amount text).
- [x] **TASK-11** Card component styles (white surface, rounded corners, shadow).
- [x] **TASK-12** Form styles: label, input/select (focus ring, `.invalid` state), error messages, submit button.
- [x] **TASK-13** Chart container styles (flex centering, min-height, canvas size cap).
- [x] **TASK-14** Transaction list styles (max-height scroll, custom scrollbar, `.list-empty`).
- [x] **TASK-15** Transaction item styles (flex row, colour dot badges per category, slideIn animation, delete button hover).
- [ ] **TASK-16** To-Do section styles:
  - Input row (flex, `+` button)
  - Filter tab buttons (active state underline/colour)
  - Todo item row (checkbox, text, `.done` strikethrough, delete button)
  - Footer row (count left-aligned, clear button right-aligned)
- [x] **TASK-17** Responsive breakpoint at 360 px (reduce font sizes).

---

### Phase 4 — JavaScript Logic (`js/app.js`)

- [x] **TASK-18** Define constants: `STORAGE_KEY`, `CATEGORY_COLORS`, `CATEGORY_ICONS`.
- [ ] **TASK-19** Define constant: `TODO_KEY = 'budget_tracker_todos'`.
- [x] **TASK-20** Implement `loadFromStorage(key)` and `saveToStorage(key, data)`.
- [x] **TASK-21** Implement `formatNumber`, `formatRupiah`, `generateId`, `escapeHtml`.
- [x] **TASK-22** Implement `showError` / `clearError` helpers.
- [x] **TASK-23** Initialise `transactions` state from localStorage.
- [ ] **TASK-24** Initialise `todos` state from localStorage; initialise `todoFilter = 'all'`.
- [x] **TASK-25** Initialise Chart.js pie chart instance.
- [x] **TASK-26** Implement `renderBalance()`.
- [x] **TASK-27** Implement `renderList()` + `createTransactionElement()` (with delete button wired).
- [x] **TASK-28** Implement `renderChart()` (group by category, show/hide canvas vs empty state).
- [ ] **TASK-29** Implement `renderTodos()`:
  - Filter `todos` array by `todoFilter`.
  - Build `<li>` per task with checkbox, text, delete button.
  - Show `#todoEmpty` when filtered list is empty.
  - Update `#todoCount` ("X task(s) left" = active count).
  - Show/hide `#todoFooter` based on whether any todos exist.
- [x] **TASK-30** Implement `render()` calling all sub-renders (balance, list, chart, monthly summary).
- [x] **TASK-31** Implement `addTransaction()` and `deleteTransaction(id)`. `addTransaction()` stores `date: new Date().toISOString()`.
- [ ] **TASK-32** Implement `addTodo()`, `toggleTodo(id)`, `deleteTodo(id)`, `clearDoneTodos()`.
- [x] **TASK-33** Wire transaction form `submit` event (validate → add → reset).
- [ ] **TASK-34** Wire todo form `submit` event (validate → add → reset).
- [ ] **TASK-35** Wire filter tab `click` events (update `todoFilter`, toggle `.active` class, re-render).
- [ ] **TASK-36** Wire `#btnClearDone` click to `clearDoneTodos()`.
- [x] **TASK-37** Wire live-clear error events for transaction fields.
- [ ] **TASK-38** Wire live-clear error event for `#todoInput`.
- [x] **TASK-39** Call `initTheme()` → `initSort()` → `render()` on startup to restore saved state.

---

### Phase 5 — Integration & Verification

- [ ] **TASK-40** Open `index.html` in Chrome — verify balance shows `Rp 0` on first load.
- [ ] **TASK-41** Add three transactions (one per category) — verify list, balance, and chart all update.
- [ ] **TASK-42** Delete a transaction — verify balance and chart recalculate.
- [ ] **TASK-43** Refresh page — verify all transactions restored from localStorage.
- [ ] **TASK-44** Submit forms with empty fields — verify error messages appear.
- [ ] **TASK-45** Add to-do tasks, mark some done, verify filter tabs show correct subsets.
- [ ] **TASK-46** Click "Clear Done" — verify completed tasks are removed.
- [ ] **TASK-47** Refresh page — verify todos restored from localStorage.
- [ ] **TASK-48** Test on a 375 px wide viewport (mobile) — verify layout has no overflow or overlap.
- [ ] **TASK-49** Test in Firefox and Edge — verify consistent behaviour.

---

### Phase 6 — New Features

#### Dark / Light Mode Toggle

- [x] **TASK-50** Add `<button class="btn-theme" id="themeToggle">` inside `.header` in `index.html`.
- [x] **TASK-51** Add `.btn-theme` CSS styles (absolute-positioned, circular, top-right of header).
- [x] **TASK-52** Add `[data-theme="dark"]` CSS overrides for all `--color-*` custom properties, form inputs, and transaction items.
- [x] **TASK-53** Define `THEME_KEY = 'budget_tracker_theme'` constant in `js/app.js`.
- [x] **TASK-54** Implement `applyTheme(theme)` — sets `data-theme` on `<html>`, updates button icon (🌙 / ☀️) and `aria-label`.
- [x] **TASK-55** Implement `initTheme()` — reads `THEME_KEY` from localStorage (defaults to `'light'`), calls `applyTheme()`.
- [x] **TASK-56** Wire `#themeToggle` click event — toggles theme, persists to localStorage, calls `applyTheme()`.

#### Monthly Summary View

- [x] **TASK-57** Add `<section class="card summary-section">` with `<div id="monthlySummary">` between the chart and list sections in `index.html`.
- [x] **TASK-58** Add `.summary-*` CSS styles: `.summary-empty`, `.summary-month`, `.summary-month-title`, `.summary-table`, `.summary-income`, `.summary-expense`, `.summary-net-positive`, `.summary-net-negative`.
- [x] **TASK-59** Add `monthlySummaryEl` DOM reference in `js/app.js`.
- [x] **TASK-60** Implement `renderMonthlySummary()` — groups transactions by month label, sorts descending (newest first), renders income / expenses / net per month as a table; handles legacy transactions without `date` as "(Date Unknown)"; shows empty-state message when no transactions exist.
- [x] **TASK-61** Call `renderMonthlySummary()` from `render()`.

#### Sort Transactions

- [x] **TASK-62** Add `.sort-controls` div with `<select id="sortSelect">` above `<ul id="transactionList">` in `index.html`. Options: Most Recent / Amount: Highest First / Amount: Lowest First / Category: A → Z.
- [x] **TASK-63** Add `.sort-controls` and `.sort-label` CSS styles.
- [x] **TASK-64** Define `SORT_KEY = 'budget_tracker_sort'` constant in `js/app.js`.
- [x] **TASK-65** Add `sortSelect` DOM reference in `js/app.js`.
- [x] **TASK-66** Implement `initSort()` — reads `SORT_KEY` from localStorage, sets `sortSelect.value`.
- [x] **TASK-67** Implement `getSortedTransactions()` — returns a sorted copy of `transactions` based on `sortSelect.value` without mutating the original array.
- [x] **TASK-68** Update `renderList()` to use `getSortedTransactions()` instead of reversing the raw array.
- [x] **TASK-69** Wire `#sortSelect` change event — persists chosen sort to localStorage, calls `render()`.

---

## Task Dependency Graph

```
TASK-01
  └── TASK-02
        ├── TASK-03 → TASK-10
        │     └── TASK-50 → TASK-51 → TASK-52 → TASK-53 → TASK-54 → TASK-55 → TASK-56
        ├── TASK-04 → TASK-12
        │     └── TASK-22 → TASK-33 → TASK-37
        ├── TASK-05 → TASK-13 → TASK-25 → TASK-28
        ├── TASK-06 → TASK-14 → TASK-15 → TASK-27 → TASK-31
        │     └── TASK-62 → TASK-63 → TASK-64 → TASK-65 → TASK-66 → TASK-67 → TASK-68 → TASK-69
        ├── TASK-07 → TASK-16
        │     └── TASK-19 → TASK-24 → TASK-29
        │           └── TASK-32 → TASK-34 → TASK-35 → TASK-36 → TASK-38
        └── TASK-57 → TASK-58 → TASK-59 → TASK-60 → TASK-61

Shared utilities (no dependencies):
  TASK-08 → TASK-09 → TASK-11 → TASK-17   (CSS foundations)
  TASK-18 → TASK-20 → TASK-21              (JS constants & helpers)
  TASK-23 → TASK-26 → TASK-30 → TASK-39   (state init & render pipeline)

Phase 5 (TASK-40 – TASK-49): all depend on Phase 1–6 being complete.
```

---

## Notes

- **Remaining open items before app is fully feature-complete:**
  - To-Do section: TASK-07 (HTML), TASK-16 (CSS), TASK-19/24/29/32/34/35/36/38 (JS)
  - Phase 5 manual verification steps (TASK-40 – TASK-49)
- **localStorage keys in use:**
  - `budget_tracker_transactions` — transaction array
  - `budget_tracker_theme` — `'light'` or `'dark'`
  - `budget_tracker_sort` — sort mode (`'default'`, `'amount-desc'`, `'amount-asc'`, `'category-az'`)
  - `budget_tracker_todos` — todos array (to be added when To-Do feature is implemented)
- Chart.js is loaded from CDN before `js/app.js`; no npm install needed.
- `addTransaction()` stores `date: new Date().toISOString()` on every new transaction. Legacy transactions without a `date` field are rendered as "(Date Unknown)" in the monthly summary.
- Sort only affects render order; the `transactions` array in memory and localStorage is never mutated by sorting.
- Dark mode uses `[data-theme="dark"]` on `<html>` and CSS custom property overrides — no inline styles needed.
- All Phase 5 tasks are manual browser verification steps; there is no automated test equivalent.
- The responsive breakpoint targets 360 px (TASK-17); mobile testing uses 375 px (TASK-48).
