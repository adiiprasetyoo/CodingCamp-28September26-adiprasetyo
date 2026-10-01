# Requirements — Expense & Budget Visualizer

## Introduction

The Expense & Budget Visualizer is a mobile-friendly, single-page web application that helps users track their daily spending. It runs entirely in the browser with no backend server. All data is persisted in the browser's LocalStorage so it survives page refreshes.

---

## Requirements

### REQ-1 — Input Form

**User Story:** As a user, I want to add a new spending transaction so I can keep an accurate record of what I have spent.

#### Acceptance Criteria

- AC-1.1: The form MUST contain three fields: **Item Name** (text), **Amount** (positive number), and **Category** (dropdown: Food, Transport, Fun).
- AC-1.2: The form MUST prevent submission when any field is empty or invalid, and display an inline error message next to each offending field.
- AC-1.3: On successful submission the new transaction MUST be appended to the transaction list and the form fields MUST be reset to their default state.
- AC-1.4: Error messages MUST disappear as soon as the user corrects the corresponding field (live feedback on `input`/`change` events).

---

### REQ-2 — Transaction List

**User Story:** As a user, I want to see all my transactions in a scrollable list so I can review my spending history.

#### Acceptance Criteria

- AC-2.1: Every transaction MUST display its **name**, **amount** (formatted as Rp), and **category** (with emoji icon and colour-coded badge).
- AC-2.2: Transactions MUST be shown newest-first.
- AC-2.3: Each transaction MUST have a **Delete** button; clicking it MUST remove that transaction from both the UI and LocalStorage.
- AC-2.4: When the list is empty, a friendly empty-state message MUST be shown.
- AC-2.5: The list MUST be scrollable when it contains many items, with a maximum visible height before scrolling activates.

---

### REQ-3 — Total Balance

**User Story:** As a user, I want to see my total amount spent at a glance so I always know how much I have used.

#### Acceptance Criteria

- AC-3.1: The total balance MUST be prominently displayed at the top of the page inside a styled balance card.
- AC-3.2: The total MUST be the sum of all transaction amounts formatted as Rp.
- AC-3.3: The total MUST update automatically whenever a transaction is added or deleted — no manual refresh required.

---

### REQ-4 — Visual Chart

**User Story:** As a user, I want to see a pie chart of my spending per category so I can quickly understand where my money goes.

#### Acceptance Criteria

- AC-4.1: A **pie chart** MUST display one slice per category that has at least one transaction.
- AC-4.2: Each category slice MUST use a consistent, distinct colour: Food = orange (`#f97316`), Transport = blue (`#3b82f6`), Fun = purple (`#a855f7`).
- AC-4.3: The chart MUST update automatically whenever transactions change.
- AC-4.4: When there are no transactions the chart canvas MUST be hidden and an empty-state message MUST be shown instead.
- AC-4.5: Hovering a slice MUST show a tooltip with the category name and total amount in Rp.

---

### REQ-5 — Data Persistence

**User Story:** As a user, I want my transactions to be saved so they are still there after I close or refresh the page.

#### Acceptance Criteria

- AC-5.1: All transactions MUST be saved to `localStorage` under the key `budget_tracker_transactions` as a JSON array.
- AC-5.2: On page load the app MUST read from `localStorage` and restore all previously saved transactions.
- AC-5.3: Adding or deleting a transaction MUST immediately update `localStorage`.

---

### REQ-6 — To-Do List

**User Story:** As a user, I want a simple to-do list alongside my budget tracker so I can note down spending-related tasks.

#### Acceptance Criteria

- AC-6.1: The to-do section MUST include a text input and an **Add** button.
- AC-6.2: Submitting an empty task MUST show a validation error and prevent the item from being added.
- AC-6.3: Each task MUST display its text and provide a **Delete** button.
- AC-6.4: Each task MUST have a **checkbox** to toggle its done/active state; done tasks MUST be visually distinguished (strikethrough + muted colour).
- AC-6.5: **Filter tabs** (All / Active / Done) MUST filter the visible task list without deleting any items.
- AC-6.6: A **Clear Done** button MUST delete all completed tasks at once.
- AC-6.7: A live task count (e.g. "2 tasks left") MUST update as tasks are added, completed, or deleted.
- AC-6.8: All to-do data MUST be persisted in `localStorage` under the key `budget_tracker_todos`.

---

## Technical Constraints

| ID   | Constraint |
|------|-----------|
| TC-1 | Technology stack: HTML, CSS, Vanilla JavaScript only. No frameworks (React, Vue, etc.). |
| TC-2 | Data storage: browser `localStorage` API only. No backend server. |
| TC-3 | Browser compatibility: Chrome, Firefox, Edge, Safari (modern versions). |
| TC-4 | Chart library: Chart.js loaded from CDN (`chart.umd.min.js`). |
| TC-5 | Folder rules: exactly one CSS file in `css/`, exactly one JS file in `js/`. |

---

## Non-Functional Requirements

| ID    | Requirement |
|-------|------------|
| NFR-1 | **Simplicity** — Clean, minimal interface. No complex setup. No test framework required. |
| NFR-2 | **Performance** — Fast load time. No noticeable lag when adding/deleting items or updating the chart. |
| NFR-3 | **Visual Design** — User-friendly aesthetic with clear visual hierarchy and readable typography. Mobile-first, works on screens as narrow as 360 px. |
| NFR-4 | **Security** — All user input rendered to the DOM MUST be HTML-escaped to prevent XSS. |
| NFR-5 | **Accessibility** — Interactive elements MUST have meaningful `aria-label` attributes where visible text is absent. |

---

## File Structure

```
project-root/
├── index.html          # Single HTML entry point
├── css/
│   └── style.css       # All styles (one file only)
├── js/
│   └── app.js          # All JavaScript logic (one file only)
└── README.md
```

---

## Out of Scope

- User authentication / accounts
- Cloud or server-side data storage
- Multiple currencies
- Date/time filtering of transactions
- Editing existing transactions (only add & delete)
