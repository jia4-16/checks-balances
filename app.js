// ==================== 工具函数 ====================
function generateSalt() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function hashPassword(password, salt) {
    return btoa(salt + password + salt);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function switchModule(moduleName) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.module === moduleName);
    });
    
    document.querySelectorAll('.module-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(moduleName + 'Module').classList.remove('hidden');
    
    if (moduleName === 'stats') {
        StatsModule.renderCharts();
    }
}

// ==================== 数据管理模块 ====================
const DataManager = {
    categories: [
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
    ],
    
    currentUser: null,
    
    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : {};
    },
    
    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },
    
    getCurrentUser() {
        return localStorage.getItem('currentUser');
    },
    
    setCurrentUser(username) {
        localStorage.setItem('currentUser', username);
        this.currentUser = username;
    },
    
    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    },
    
    getUserData(username) {
        const users = this.getUsers();
        if (users[username]) {
            return users[username].data || {
                expenses: [],
                budget: { total: 0 },
                categories: [...this.categories]
            };
        }
        return null;
    },
    
    saveUserData(username, data) {
        const users = this.getUsers();
        if (users[username]) {
            users[username].data = data;
            this.saveUsers(users);
        }
    },
    
    getCurrentUserData() {
        const username = this.getCurrentUser();
        if (username) {
            return this.getUserData(username);
        }
        return null;
    },
    
    saveCurrentUserData(data) {
        const username = this.getCurrentUser();
        if (username) {
            this.saveUserData(username, data);
        }
    },
    
    migrateV1Data() {
        const v1Expenses = localStorage.getItem('expenses');
        const v1Budget = localStorage.getItem('budget');
        
        if (v1Expenses || v1Budget) {
            const v1Backup = {
                expenses: v1Expenses ? JSON.parse(v1Expenses) : [],
                budget: v1Budget ? JSON.parse(v1Budget) : { total: 0 }
            };
            localStorage.setItem('v1_backup', JSON.stringify(v1Backup));
            return v1Backup;
        }
        return null;
    },
    
    importV1DataToUser(username, v1Data) {
        const users = this.getUsers();
        if (users[username]) {
            users[username].data = {
                expenses: v1Data.expenses || [],
                budget: v1Data.budget || { total: 0 },
                categories: [...this.categories]
            };
            this.saveUsers(users);
        }
    }
};

// ==================== 认证模块 ====================
const AuthModule = {
    register() {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (!username) {
            showToast('用户名不能为空', 'error');
            return;
        }
        
        if (!password || password.length < 6) {
            showToast('密码至少需要6位', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('两次输入的密码不一致', 'error');
            return;
        }
        
        const users = DataManager.getUsers();
        if (users[username]) {
            showToast('用户名已存在', 'error');
            return;
        }
        
        const salt = generateSalt();
        const passwordHash = hashPassword(password, salt);
        
        users[username] = {
            passwordHash,
            salt,
            data: {
                expenses: [],
                budget: { total: 0 },
                categories: [...DataManager.categories]
            }
        };
        
        DataManager.saveUsers(users);
        showToast('注册成功，请登录', 'success');
        showLogin();
        
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerConfirmPassword').value = '';
    },
    
    login() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            showToast('请输入用户名和密码', 'error');
            return;
        }
        
        const users = DataManager.getUsers();
        const user = users[username];
        
        if (!user) {
            showToast('用户不存在', 'error');
            return;
        }
        
        const passwordHash = hashPassword(password, user.salt);
        if (passwordHash !== user.passwordHash) {
            showToast('密码错误', 'error');
            return;
        }
        
        DataManager.setCurrentUser(username);
        this.showMainApp();
        showToast('登录成功', 'success');
        
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    },
    
    logout() {
        DataManager.clearCurrentUser();
        this.showAuthPage();
        showToast('已退出登录', 'success');
    },
    
    showAuthPage() {
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    },
    
    showMainApp() {
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        const username = DataManager.getCurrentUser();
        document.getElementById('currentUserDisplay').textContent = username;
        
        App.init();
    },
    
    checkSession() {
        const username = DataManager.getCurrentUser();
        if (username) {
            const users = DataManager.getUsers();
            if (users[username]) {
                this.showMainApp();
                return true;
            }
        }
        this.showAuthPage();
        return false;
    }
};

// ==================== 预算模块 ====================
const BudgetModule = {
    openBudgetModal() {
        const data = DataManager.getCurrentUserData();
        document.getElementById('budgetAmount').value = data.budget.total || '';
        openModal('budgetModal');
    },
    
    handleBudgetSubmit(e) {
        e.preventDefault();
        const data = DataManager.getCurrentUserData();
        data.budget.total = parseFloat(document.getElementById('budgetAmount').value) || 0;
        DataManager.saveCurrentUserData(data);
        this.updateBudgetDisplay();
        closeModal('budgetModal');
        showToast('预算已更新', 'success');
    },
    
    updateBudgetDisplay() {
        const data = DataManager.getCurrentUserData();
        const monthlyExpenses = this.getMonthlyExpenses(data.expenses);
        const spent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
        const remaining = data.budget.total - spent;
        const usageRate = data.budget.total > 0 ? (spent / data.budget.total) * 100 : 0;
        
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const remainingDays = daysInMonth - now.getDate() + 1;
        const dailyBudget = remainingDays > 0 && remaining > 0 ? remaining / remainingDays : 0;
        
        document.getElementById('totalBudget').textContent = `¥${data.budget.total.toFixed(2)}`;
        document.getElementById('spentAmount').textContent = `¥${spent.toFixed(2)}`;
        document.getElementById('remainingBudget').textContent = `¥${remaining.toFixed(2)}`;
        document.getElementById('dailyBudget').textContent = `¥${dailyBudget.toFixed(2)}`;
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const budgetStatus = document.getElementById('budgetStatus');
        
        progressFill.style.width = `${Math.min(usageRate, 100)}%`;
        progressText.textContent = `${usageRate.toFixed(1)}%`;
        
        budgetStatus.className = 'budget-status';
        if (usageRate >= 100) {
            progressFill.style.backgroundColor = 'var(--danger)';
            budgetStatus.classList.add('danger');
            budgetStatus.textContent = `⚠️ 预算超支！已超支 ¥${(spent - data.budget.total).toFixed(2)}`;
        } else if (usageRate >= 80) {
            progressFill.style.backgroundColor = 'var(--warning)';
            budgetStatus.classList.add('warning');
            budgetStatus.textContent = `⚠️ 预算紧张！已使用 ${usageRate.toFixed(0)}%，请注意控制支出`;
        } else {
            progressFill.style.backgroundColor = 'var(--primary)';
            budgetStatus.classList.add('success');
            budgetStatus.textContent = `✅ 预算充足，还剩 ${remainingDays} 天可支配`;
        }
    },
    
    getMonthlyExpenses(expenses) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return expenses.filter(e => new Date(e.date) >= monthStart);
    }
};

// ==================== 统计模块 ====================
const StatsModule = {
    categoryChart: null,
    dailyChart: null,
    
    renderCharts() {
        const data = DataManager.getCurrentUserData();
        const monthlyExpenses = BudgetModule.getMonthlyExpenses(data.expenses);
        
        this.renderCategoryChart(monthlyExpenses, data.categories);
        this.renderDailyChart(monthlyExpenses);
    },
    
    renderCategoryChart(expenses, categories) {
        const categoryTotals = {};
        expenses.forEach(expense => {
            const category = categories.find(c => c.id === expense.categoryId) || categories[categories.length - 1];
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
        
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }
        
        const ctx = document.getElementById('categoryChart').getContext('2d');
        this.categoryChart = new Chart(ctx, {
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
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    },
    
    renderDailyChart(expenses) {
        const dailyTotals = {};
        expenses.forEach(expense => {
            if (!dailyTotals[expense.date]) {
                dailyTotals[expense.date] = 0;
            }
            dailyTotals[expense.date] += expense.amount;
        });
        
        const sortedDates = Object.keys(dailyTotals).sort();
        const dailyLabels = sortedDates;
        const dailyData = sortedDates.map(date => dailyTotals[date]);
        
        if (this.dailyChart) {
            this.dailyChart.destroy();
        }
        
        const ctx = document.getElementById('dailyChart').getContext('2d');
        this.dailyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyLabels.length > 0 ? dailyLabels : ['暂无数据'],
                datasets: [{
                    label: '每日支出',
                    data: dailyData.length > 0 ? dailyData : [0],
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6c5ce7',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value;
                            }
                        }
                    }
                }
            }
        });
    }
};

// ==================== 支出模块 ====================
const ExpensesModule = {
    deleteTargetId: null,
    
    renderCategories() {
        const data = DataManager.getCurrentUserData();
        const filterCategory = document.getElementById('filterCategory');
        const expenseCategory = document.getElementById('expenseCategory');
        
        filterCategory.innerHTML = '<option value="">所有类别</option>';
        expenseCategory.innerHTML = '';
        
        data.categories.forEach(category => {
            const option1 = document.createElement('option');
            option1.value = category.id;
            option1.textContent = category.name;
            filterCategory.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = category.id;
            option2.textContent = `${category.icon} ${category.name}`;
            expenseCategory.appendChild(option2);
        });
    },
    
    openExpenseModal(expense = null) {
        const modalTitle = document.getElementById('modalTitle');
        const expenseForm = document.getElementById('expenseForm');
        
        if (expense) {
            modalTitle.textContent = '编辑支出';
            document.getElementById('expenseId').value = expense.id;
            document.getElementById('expenseAmount').value = expense.amount;
            document.getElementById('expenseCategory').value = expense.categoryId;
            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseNote').value = expense.note || '';
        } else {
            modalTitle.textContent = '添加支出';
            expenseForm.reset();
            this.setDefaultDate();
        }
        openModal('expenseModal');
    },
    
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
    },
    
    handleExpenseSubmit(e) {
        e.preventDefault();
        const data = DataManager.getCurrentUserData();
        
        const id = document.getElementById('expenseId').value ? parseInt(document.getElementById('expenseId').value) : Date.now();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const categoryId = parseInt(document.getElementById('expenseCategory').value);
        const date = document.getElementById('expenseDate').value;
        const note = document.getElementById('expenseNote').value;
        
        const expense = { id, amount, categoryId, date, note };
        
        if (document.getElementById('expenseId').value) {
            const index = data.expenses.findIndex(e => e.id === id);
            if (index !== -1) {
                data.expenses[index] = expense;
            }
            showToast('支出已更新', 'success');
        } else {
            data.expenses.push(expense);
            showToast('支出已添加', 'success');
        }
        
        DataManager.saveCurrentUserData(data);
        this.renderExpenses();
        BudgetModule.updateBudgetDisplay();
        closeModal('expenseModal');
    },
    
    openConfirmModal(id) {
        this.deleteTargetId = id;
        openModal('confirmModal');
    },
    
    confirmDelete() {
        if (this.deleteTargetId) {
            const data = DataManager.getCurrentUserData();
            data.expenses = data.expenses.filter(e => e.id !== this.deleteTargetId);
            DataManager.saveCurrentUserData(data);
            this.renderExpenses();
            BudgetModule.updateBudgetDisplay();
            showToast('支出已删除', 'success');
        }
        closeModal('confirmModal');
        this.deleteTargetId = null;
    },
    
    getFilteredExpenses() {
        const data = DataManager.getCurrentUserData();
        let filtered = [...data.expenses];
        
        const categoryFilter = document.getElementById('filterCategory').value;
        if (categoryFilter) {
            filtered = filtered.filter(e => e.categoryId === parseInt(categoryFilter));
        }
        
        const dateFilter = document.getElementById('filterDate').value;
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
        
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        return filtered;
    },
    
    renderExpenses() {
        const data = DataManager.getCurrentUserData();
        const filtered = this.getFilteredExpenses();
        const expensesList = document.getElementById('expensesList');
        
        expensesList.innerHTML = '';
        
        if (filtered.length === 0) {
            expensesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">暂无支出记录</p>';
            return;
        }
        
        filtered.forEach(expense => {
            const category = data.categories.find(c => c.id === expense.categoryId) || data.categories[data.categories.length - 1];
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
                        <button class="edit" onclick='ExpensesModule.openExpenseModal(${JSON.stringify(expense).replace(/'/g, "\\'")})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete" onclick="ExpensesModule.openConfirmModal(${expense.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            expensesList.appendChild(item);
        });
    }
};

// ==================== 备份模块 ====================
const BackupModule = {
    showBackupModal() {
        openModal('backupModal');
    },
    
    exportData() {
        const data = DataManager.getCurrentUserData();
        const username = DataManager.getCurrentUser();
        
        const exportData = {
            username,
            exportDate: new Date().toISOString(),
            version: '2.0',
            data: data
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `accounting_backup_${username}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('数据导出成功', 'success');
    },
    
    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                
                if (!imported.data || !imported.data.expenses || !imported.data.budget || !imported.data.categories) {
                    showToast('无效的备份文件格式', 'error');
                    return;
                }
                
                if (confirm('确定要恢复数据吗？这将覆盖当前所有数据！')) {
                    DataManager.saveCurrentUserData(imported.data);
                    App.init();
                    showToast('数据恢复成功', 'success');
                }
            } catch (error) {
                showToast('备份文件解析失败', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }
};

// ==================== 应用初始化 ====================
const App = {
    init() {
        ExpensesModule.renderCategories();
        ExpensesModule.renderExpenses();
        BudgetModule.updateBudgetDisplay();
    },
    
    migrateAndInit() {
        const v1Data = DataManager.migrateV1Data();
        if (v1Data) {
            showToast('检测到v1.0数据，已自动备份', 'warning');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.migrateAndInit();
    AuthModule.checkSession();
});