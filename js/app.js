/**
 * Expense & Budget Visualizer
 * Vanilla JS — no frameworks
 * Data persisted via localStorage
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'budget_tracker_transactions';
const THEME_KEY   = 'budget_tracker_theme';
const SORT_KEY    = 'budget_tracker_sort';

const CATEGORY_COLORS = {
  Food:      '#f97316',
  Transport: '#3b82f6',
  Fun:       '#a855f7',
};

const CATEGORY_ICONS = {
  Food:      '🍔',
  Transport: '🚗',
  Fun:       '🎉',
};

// ─── State ────────────────────────────────────────────────────────────────────

/** @type {{ id: string, name: string, amount: number, category: string, date?: string }[]} */
let transactions = loadFromStorage();

// ─── DOM References ───────────────────────────────────────────────────────────

const form           = document.getElementById('transactionForm');
const itemNameInput  = document.getElementById('itemName');
const amountInput    = document.getElementById('amount');
const categorySelect = document.getElementById('category');

const nameError      = document.getElementById('nameError');
const amountError    = document.getElementById('amountError');
const categoryError  = document.getElementById('categoryError');

const totalBalanceEl  = document.getElementById('totalBalance');
const transactionList = document.getElementById('transactionList');
const listEmpty       = document.getElementById('listEmpty');
const chartEmpty      = document.getElementById('chartEmpty');
const chartCanvas     = document.getElementById('spendingChart');
const monthlySummaryEl = document.getElementById('monthlySummary');
const sortSelect      = document.getElementById('sortSelect');

// ─── Chart Setup ──────────────────────────────────────────────────────────────

const chart = new Chart(chartCanvas, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 8,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: { size: 13, family: "'Segoe UI', system-ui, sans-serif" },
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label(ctx) {
            const val = ctx.parsed;
            return ` Rp ${formatNumber(val)}`;
          },
        },
      },
    },
  },
});

// ─── Storage Helpers ──────────────────────────────────────────────────────────

/** Load transactions array from localStorage. Returns empty array if none. */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Persist current transactions array to localStorage. */
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// ─── Formatters ───────────────────────────────────────────────────────────────

/** Format a number as Indonesian Rupiah string (no currency symbol). */
function formatNumber(n) {
  return n.toLocaleString('id-ID');
}

/** Format a number as "Rp X" string. */
function formatRupiah(n) {
  return `Rp ${formatNumber(n)}`;
}

// ─── Unique ID ────────────────────────────────────────────────────────────────

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate the form inputs.
 * Returns true if valid, false otherwise.
 * Toggles error messages and invalid classes in place.
 */
function validateForm() {
  let valid = true;

  // Item Name
  const name = itemNameInput.value.trim();
  if (!name) {
    showError(itemNameInput, nameError);
    valid = false;
  } else {
    clearError(itemNameInput, nameError);
  }

  // Amount
  const amountVal = parseFloat(amountInput.value);
  if (!amountInput.value || isNaN(amountVal) || amountVal <= 0) {
    showError(amountInput, amountError);
    valid = false;
  } else {
    clearError(amountInput, amountError);
  }

  // Category
  if (!categorySelect.value) {
    showError(categorySelect, categoryError);
    valid = false;
  } else {
    clearError(categorySelect, categoryError);
  }

  return valid;
}

function showError(input, errorEl) {
  input.classList.add('invalid');
  errorEl.classList.add('visible');
}

function clearError(input, errorEl) {
  input.classList.remove('invalid');
  errorEl.classList.remove('visible');
}

// ─── Theme ────────────────────────────────────────────────────────────────────

const themeToggleBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(saved);
}

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

// ─── Sort ─────────────────────────────────────────────────────────────────────

function initSort() {
  const saved = localStorage.getItem(SORT_KEY) || 'default';
  sortSelect.value = saved;
}

function getSortedTransactions() {
  const mode = sortSelect ? sortSelect.value : 'default';
  const copy = [...transactions];
  switch (mode) {
    case 'amount-desc':  return copy.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':   return copy.sort((a, b) => a.amount - b.amount);
    case 'category-az':  return copy.sort((a, b) => a.category.localeCompare(b.category));
    default:             return copy.reverse(); // most recent first (original order reversed)
  }
}

sortSelect.addEventListener('change', () => {
  localStorage.setItem(SORT_KEY, sortSelect.value);
  render();
});

// ─── UI Rendering ─────────────────────────────────────────────────────────────

/** Re-render the entire UI (balance, list, chart, monthly summary). */
function render() {
  renderBalance();
  renderList();
  renderChart();
  renderMonthlySummary();
}

/** Update the total balance display. */
function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalBalanceEl.textContent = formatRupiah(total);
}

/** Re-render the transaction list. */
function renderList() {
  // Remove all existing items except the empty-state placeholder
  const items = transactionList.querySelectorAll('.transaction-item');
  items.forEach(el => el.remove());

  if (transactions.length === 0) {
    listEmpty.style.display = 'block';
    return;
  }

  listEmpty.style.display = 'none';

  // Render using selected sort order
  getSortedTransactions().forEach(t => {
    const li = createTransactionElement(t);
    transactionList.insertBefore(li, listEmpty);
  });
}

/**
 * Build a list item DOM element for a transaction.
 * @param {{ id: string, name: string, amount: number, category: string, date?: string }} t
 */
function createTransactionElement(t) {
  const li = document.createElement('li');
  li.className = 'transaction-item';
  li.dataset.id = t.id;

  const badgeClass = t.category.toLowerCase();

  li.innerHTML = `
    <span class="item-badge ${badgeClass}"></span>
    <div class="item-info">
      <div class="item-name">${escapeHtml(t.name)}</div>
      <div class="item-category">${CATEGORY_ICONS[t.category] || ''} ${escapeHtml(t.category)}</div>
    </div>
    <span class="item-amount">${formatRupiah(t.amount)}</span>
    <button class="btn-delete" aria-label="Delete ${escapeHtml(t.name)}">✕</button>
  `;

  li.querySelector('.btn-delete').addEventListener('click', () => deleteTransaction(t.id));

  return li;
}

/** Update the Chart.js pie chart based on current transactions. */
function renderChart() {
  const totals = {};

  transactions.forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const categories = Object.keys(totals);

  if (categories.length === 0) {
    chartCanvas.style.display = 'none';
    chartEmpty.classList.add('visible');
    return;
  }

  chartCanvas.style.display = 'block';
  chartEmpty.classList.remove('visible');

  chart.data.labels = categories;
  chart.data.datasets[0].data = categories.map(c => totals[c]);
  chart.data.datasets[0].backgroundColor = categories.map(c => CATEGORY_COLORS[c] || '#94a3b8');
  chart.update();
}

/** Re-render the monthly summary section. */
function renderMonthlySummary() {
  monthlySummaryEl.innerHTML = '';

  if (transactions.length === 0) {
    monthlySummaryEl.innerHTML = '<p class="summary-empty">No transactions yet.</p>';
    return;
  }

  // Group by month label
  const groups = {};
  transactions.forEach(t => {
    let label;
    if (t.date) {
      const d = new Date(t.date);
      label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    } else {
      label = '(Date Unknown)';
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });

  // Sort month labels descending (most recent first); unknown goes last
  const sortedLabels = Object.keys(groups).sort((a, b) => {
    if (a === '(Date Unknown)') return 1;
    if (b === '(Date Unknown)') return -1;
    return new Date(b) - new Date(a);
  });

  sortedLabels.forEach(label => {
    const items = groups[label];
    const income   = items.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = items.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);
    const net      = income + expenses;

    const div = document.createElement('div');
    div.className = 'summary-month';
    div.innerHTML = `
      <div class="summary-month-title">${escapeHtml(label)}</div>
      <table class="summary-table">
        <tr>
          <td>Income</td>
          <td class="summary-income">+ ${formatRupiah(income)}</td>
        </tr>
        <tr>
          <td>Expenses</td>
          <td class="summary-expense">- ${formatRupiah(Math.abs(expenses))}</td>
        </tr>
        <tr>
          <td>Net</td>
          <td class="${net >= 0 ? 'summary-net-positive' : 'summary-net-negative'}">${net >= 0 ? '+' : ''} ${formatRupiah(net)}</td>
        </tr>
      </table>
    `;
    monthlySummaryEl.appendChild(div);
  });
}

// ─── Transaction CRUD ─────────────────────────────────────────────────────────

/** Add a new transaction from the form values. */
function addTransaction() {
  const name     = itemNameInput.value.trim();
  const amount   = parseFloat(amountInput.value);
  const category = categorySelect.value;

  const transaction = {
    id: generateId(),
    name,
    amount,
    category,
    date: new Date().toISOString(),
  };

  transactions.push(transaction);
  saveToStorage();
  render();
}

/** Delete a transaction by its id. */
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToStorage();
  render();
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  addTransaction();

  // Reset form fields
  form.reset();

  // Clear any lingering validation states
  clearError(itemNameInput, nameError);
  clearError(amountInput, amountError);
  clearError(categorySelect, categoryError);
});

// Clear error on input change (live feedback)
itemNameInput.addEventListener('input', () => clearError(itemNameInput, nameError));
amountInput.addEventListener('input', () => clearError(amountInput, amountError));
categorySelect.addEventListener('change', () => clearError(categorySelect, categoryError));

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Escape HTML special characters to prevent XSS from user input. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Initial Render ───────────────────────────────────────────────────────────

initTheme();
initSort();
render();
