// Data structure
let expenses = [];
let budget = { total: 0 };
let categories = [
  { id: 1, name: '餐饮', icon: '🍔' },
  { id: 2, name: '交通', icon: '🚗' },
  { id: 3, name: '住宿', icon: '🏠' },
  { id: 4, name: '娱乐', icon: '🎮' },
  { id: 5, name: '购物', icon: '🛍️' },
  { id: 6, name: '医疗', icon: '💊' },
  { id: 7, name: '教育', icon: '📚' },
  { id: 8, name: '通讯', icon: '📱' },
  { id: 9, name: '人情往来', icon: '🎁' },
  { id: 10, name: '其他', icon: '📦' }
];

// Chart instances
let categoryChart = null;
let dailyChart = null;

// DOM elements
const expenseModal = document.getElementById('expenseModal');
const budgetModal = document.getElementById('budgetModal');
const confirmModal = document.getElementById('confirmModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeBudgetModalBtn = document.getElementById('closeBudgetModalBtn');
const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const expenseForm = document.getElementById('expenseForm');
const budgetForm = document.getElementById('budgetForm');
const cancelBtn = document.getElementById('cancelBtn');
const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');
const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const expensesList = document.getElementById('expensesList');
const filterCategory = document.getElementById('filterCategory');
const filterDate = document.getElementById('filterDate');
const expenseCategory = document.getElementById('expenseCategory');
const expenseDate = document.getElementById('expenseDate');
const modalTitle = document.getElementById('modalTitle');
const expenseId = document.getElementById('expenseId');

let deleteTargetId = null;

// Initialize app
function init() {
  loadFromStorage();
  renderCategories();
  renderExpenses();
  updateBudgetDisplay();
  setupEventListeners();
  setDefaultDate();
  renderCharts();
}

// Setup event listeners
function setupEventListeners() {
  addExpenseBtn.addEventListener('click', () => openExpenseModal());
  closeModalBtn.addEventListener('click', () => closeModal(expenseModal));
  closeBudgetModalBtn.addEventListener('click', () => closeModal(budgetModal));
  closeConfirmModalBtn.addEventListener('click', () => closeModal(confirmModal));
  cancelBtn.addEventListener('click', () => closeModal(expenseModal));
  cancelBudgetBtn.addEventListener('click', () => closeModal(budgetModal));
  cancelConfirmBtn.addEventListener('click', () => closeModal(confirmModal));
  setBudgetBtn.addEventListener('click', () => openBudgetModal());
  expenseForm.addEventListener('submit', handleExpenseSubmit);
  budgetForm.addEventListener('submit', handleBudgetSubmit);
  confirmDeleteBtn.addEventListener('click', confirmDelete);
  filterCategory.addEventListener('change', renderExpenses);
  filterDate.addEventListener('change', renderExpenses);

  // Close modal when clicking outside
  expenseModal.addEventListener('click', (e) => {
    if (e.target === expenseModal) closeModal(expenseModal);
  });
  budgetModal.addEventListener('click', (e) => {
    if (e.target === budgetModal) closeModal(budgetModal);
  });
  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) closeModal(confirmModal);
  });
}

// Local storage
function loadFromStorage() {
  const storedExpenses = localStorage.getItem('expenses');
  const storedBudget = localStorage.getItem('budget');
  const storedCategories = localStorage.getItem('categories');

  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
  }
  if (storedBudget) {
    budget = JSON.parse(storedBudget);
  }
  if (storedCategories) {
    categories = JSON.parse(storedCategories);
  }
}

function saveToStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('budget', JSON.stringify(budget));
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Set default date to today
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  expenseDate.value = today;
}

// Render categories in select elements
function renderCategories() {
  filterCategory.innerHTML = '<option value="">所有类别</option>';
  expenseCategory.innerHTML = '';

  categories.forEach(category => {
    const option1 = document.createElement('option');
    option1.value = category.id;
    option1.textContent = category.name;
    filterCategory.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = category.id;
    option2.textContent = `${category.icon} ${category.name}`;
    expenseCategory.appendChild(option2);
  });
}

// Open/close modals
function openExpenseModal(expense = null) {
  if (expense) {
    modalTitle.textContent = '编辑支出';
    expenseId.value = expense.id;
    document.getElementById('expenseAmount').value = expense.amount;
    expenseCategory.value = expense.categoryId;
    expenseDate.value = expense.date;
    document.getElementById('expenseNote').value = expense.note || '';
  } else {
    modalTitle.textContent = '添加支出';
    expenseForm.reset();
    setDefaultDate();
  }
  expenseModal.classList.add('active');
}

function openBudgetModal() {
  document.getElementById('budgetAmount').value = budget.total || '';
  budgetModal.classList.add('active');
}

function openConfirmModal(id) {
  deleteTargetId = id;
  confirmModal.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');
}

// Handle form submissions
function handleExpenseSubmit(e) {
  e.preventDefault();

  const id = expenseId.value ? parseInt(expenseId.value) : Date.now();
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const categoryId = parseInt(expenseCategory.value);
  const date = expenseDate.value;
  const note = document.getElementById('expenseNote').value;

  const expense = { id, amount, categoryId, date, note };

  if (expenseId.value) {
    // Edit existing
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = expense;
    }
  } else {
    // Add new
    expenses.push(expense);
  }

  saveToStorage();
  renderExpenses();
  updateBudgetDisplay();
  renderCharts();
  closeModal(expenseModal);
}

function handleBudgetSubmit(e) {
  e.preventDefault();
  budget.total = parseFloat(document.getElementById('budgetAmount').value) || 0;
  saveToStorage();
  updateBudgetDisplay();
  closeModal(budgetModal);
}

// Delete expense
function confirmDelete() {
  if (deleteTargetId) {
    expenses = expenses.filter(e => e.id !== deleteTargetId);
    saveToStorage();
    renderExpenses();
    updateBudgetDisplay();
    renderCharts();
  }
  closeModal(confirmModal);
}

// Get category by id
function getCategoryById(id) {
  return categories.find(c => c.id === id) || categories[categories.length - 1];
}

// Filter expenses
function getFilteredExpenses() {
  let filtered = [...expenses];

  // Filter by category
  const categoryFilter = filterCategory.value;
  if (categoryFilter) {
    filtered = filtered.filter(e => e.categoryId === parseInt(categoryFilter));
  }

  // Filter by date
  const dateFilter = filterDate.value;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateFilter === 'today') {
    filtered = filtered.filter(e => new Date(e.date) >= today);
  } else if (dateFilter === 'week') {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    filtered = filtered.filter(e => new Date(e.date) >= weekAgo);
  } else if (dateFilter === 'month') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    filtered = filtered.filter(e => new Date(e.date) >= monthStart);
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  return filtered;
}

// Get monthly expenses
function getMonthlyExpenses() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return expenses.filter(e => new Date(e.date) >= monthStart);
}

// Update budget display
function updateBudgetDisplay() {
  const monthlyExpenses = getMonthlyExpenses();
  const spent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.total - spent;
  const usageRate = budget.total > 0 ? (spent / budget.total) * 100 : 0;

  // Calculate remaining days in month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - now.getDate() + 1;
  const dailyBudget = remainingDays > 0 && remaining > 0 ? remaining / remainingDays : 0;

  // Update UI
  document.getElementById('totalBudget').textContent = `¥${budget.total.toFixed(2)}`;
  document.getElementById('spentAmount').textContent = `¥${spent.toFixed(2)}`;
  document.getElementById('remainingBudget').textContent = `¥${remaining.toFixed(2)}`;
  document.getElementById('dailyBudget').textContent = `¥${dailyBudget.toFixed(2)}`;

  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const budgetStatus = document.getElementById('budgetStatus');

  progressFill.style.width = `${Math.min(usageRate, 100)}%`;
  progressText.textContent = `${usageRate.toFixed(1)}%`;

  // Update status and color
  budgetStatus.className = 'budget-status';
  if (usageRate >= 100) {
    progressFill.style.backgroundColor = 'var(--danger)';
    budgetStatus.classList.add('danger');
    budgetStatus.textContent = `⚠️ 预算超支！已超支 ¥${(spent - budget.total).toFixed(2)}`;
  } else if (usageRate >= 80) {
    progressFill.style.backgroundColor = 'var(--warning)';
    budgetStatus.classList.add('warning');
    budgetStatus.textContent = `⚠️ 预算紧张！已使用 ${usageRate.toFixed(0)}%，请注意控制支出`;
  } else {
    progressFill.style.backgroundColor = 'var(--primary)';
    budgetStatus.classList.add('success');
    budgetStatus.textContent = `✅ 预算充足，还剩 ${remainingDays} 天可支配`;
  }
}

// Render expenses list
function renderExpenses() {
  const filtered = getFilteredExpenses();
  expensesList.innerHTML = '';

  if (filtered.length === 0) {
    expensesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">暂无支出记录</p>';
    return;
  }

  filtered.forEach(expense => {
    const category = getCategoryById(expense.categoryId);
    const item = document.createElement('div');
    item.className = 'expense-item';
    item.innerHTML = `
      <div class="expense-info">
        <div class="expense-icon">${category.icon}</div>
        <div class="expense-details">
          <h4>${category.name}</h4>
          <p>${expense.date}${expense.note ? ' · ' + expense.note : ''}</p>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="expense-amount">-¥${expense.amount.toFixed(2)}</div>
        <div class="expense-actions">
          <button class="edit" onclick='openExpenseModal(${JSON.stringify(expense).replace(/'/g, "\\'")})'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete" onclick="openConfirmModal(${expense.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    expensesList.appendChild(item);
  });
}

// Render charts
function renderCharts() {
  const monthlyExpenses = getMonthlyExpenses();

  // Category pie chart
  const categoryTotals = {};
  monthlyExpenses.forEach(expense => {
    const category = getCategoryById(expense.categoryId);
    if (!categoryTotals[category.name]) {
      categoryTotals[category.name] = 0;
    }
    categoryTotals[category.name] += expense.amount;
  });

  const categoryLabels = Object.keys(categoryTotals);
  const categoryData = Object.values(categoryTotals);
  const categoryColors = [
    '#6c5ce7', '#a29bfe', '#00cec9', '#0984e3', '#74b9ff',
    '#fdcb6e', '#e17055', '#d63031', '#00b894', '#636e72'
  ];

  // Destroy previous chart if exists
  if (categoryChart) {
    categoryChart.destroy();
  }

  const categoryCtx = document.getElementById('categoryChart').getContext('2d');
  categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: categoryLabels.length > 0 ? categoryLabels : ['暂无数据'],
      datasets: [{
        data: categoryData.length > 0 ? categoryData : [1],
        backgroundColor: categoryLabels.length > 0 ? categoryColors.slice(0, categoryLabels.length) : ['#dfe6e9'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Daily trend chart
  const dailyTotals = {};
  monthlyExpenses.forEach(expense => {
    if (!dailyTotals[expense.date]) {
      dailyTotals[expense.date] = 0;
    }
    dailyTotals[expense.date] += expense.amount;
  });

  const sortedDates = Object.keys(dailyTotals).sort();
  const dailyLabels = sortedDates;
  const dailyData = sortedDates.map(date => dailyTotals[date]);

  // Destroy previous chart if exists
  if (dailyChart) {
    dailyChart.destroy();
  }

  const dailyCtx = document.getElementById('dailyChart').getContext('2d');
  dailyChart = new Chart(dailyCtx, {
    type: 'line',
    data: {
      labels: dailyLabels.length > 0 ? dailyLabels : ['暂无数据'],
      datasets: [{
        label: '每日支出',
        data: dailyData.length > 0 ? dailyData : [0],
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Make functions globally available
window.openExpenseModal = openExpenseModal;
window.openConfirmModal = openConfirmModal;

// Initialize the app
init();
