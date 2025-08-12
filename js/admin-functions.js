/* S.E.F. Contact Engine CRM - Admin Functions */

// Sample portfolio data
let portfolioData = [
    {
        id: 'PF001',
        name: 'Medical Collections Q1 2024',
        accounts: 150,
        totalValue: 45000.00,
        status: 'active',
        assignedAgent: 'agent1',
        createdDate: '2024-01-01',
        recoveredAmount: 15000.00
    },
    {
        id: 'PF002',
        name: 'Credit Card Defaults Q4 2023',
        accounts: 200,
        totalValue: 75000.00,
        status: 'active',
        assignedAgent: 'agent2',
        createdDate: '2023-12-01',
        recoveredAmount: 25000.00
    },
    {
        id: 'PF003',
        name: 'Auto Loan Recoveries',
        accounts: 75,
        totalValue: 120000.00,
        status: 'pending',
        assignedAgent: null,
        createdDate: '2024-01-10',
        recoveredAmount: 0.00
    }
];

// Sample user data
let userData = [
    {
        id: 'agent1',
        name: 'John Smith',
        email: 'john.smith@sefcontact.com',
        role: 'agent',
        active: true,
        assignedPortfolios: ['PF001'],
        performanceScore: 85.5,
        lastLogin: '2024-01-15'
    },
    {
        id: 'agent2',
        name: 'Sarah Jones',
        email: 'sarah.jones@sefcontact.com',
        role: 'agent',
        active: true,
        assignedPortfolios: ['PF002'],
        performanceScore: 92.3,
        lastLogin: '2024-01-15'
    },
    {
        id: 'admin1',
        name: 'Michael Admin',
        email: 'admin@sefcontact.com',
        role: 'admin',
        active: true,
        assignedPortfolios: [],
        performanceScore: null,
        lastLogin: '2024-01-15'
    }
];

// Initialize admin dashboard
function initializeAdminDashboard() {
    updateDashboardMetrics();
    loadRecentActivity();
    loadPortfolioInsights();
    updatePerformanceCharts();
    
    console.log('✅ Admin dashboard initialized');
}

// Update dashboard metrics
function updateDashboardMetrics() {
    const metrics = calculateMetrics();
    
    // Update metric cards
    const metricElements = {
        totalPortfolios: document.getElementById('totalPortfolios'),
        totalAccounts: document.getElementById('totalAccounts'),
        totalValue: document.getElementById('totalValue'),
        recoveredValue: document.getElementById('recoveredValue'),
        activeAgents: document.getElementById('activeAgents'),
        recoveryRate: document.getElementById('recoveryRate')
    };
    
    Object.keys(metricElements).forEach(key => {
        if (metricElements[key]) {
            switch (key) {
                case 'totalPortfolios':
                    metricElements[key].textContent = metrics.totalPortfolios;
                    break;
                case 'totalAccounts':
                    metricElements[key].textContent = metrics.totalAccounts.toLocaleString();
                    break;
                case 'totalValue':
                    metricElements[key].textContent = formatCurrency(metrics.totalValue);
                    break;
                case 'recoveredValue':
                    metricElements[key].textContent = formatCurrency(metrics.recoveredValue);
                    break;
                case 'activeAgents':
                    metricElements[key].textContent = metrics.activeAgents;
                    break;
                case 'recoveryRate':
                    metricElements[key].textContent = metrics.recoveryRate + '%';
                    break;
            }
        }
    });
}

// Calculate dashboard metrics
function calculateMetrics() {
    const totalPortfolios = portfolioData.length;
    const totalAccounts = portfolioData.reduce((sum, p) => sum + p.accounts, 0);
    const totalValue = portfolioData.reduce((sum, p) => sum + p.totalValue, 0);
    const recoveredValue = portfolioData.reduce((sum, p) => sum + p.recoveredAmount, 0);
    const activeAgents = userData.filter(u => u.role === 'agent' && u.active).length;
    const recoveryRate = totalValue > 0 ? ((recoveredValue / totalValue) * 100).toFixed(1) : 0;
    
    return {
        totalPortfolios,
        totalAccounts,
        totalValue,
        recoveredValue,
        activeAgents,
        recoveryRate
    };
}

// Portfolio management functions
function loadPortfolioList() {
    const container = document.getElementById('portfolioList');
    if (!container) return;
    
    showLoading('portfolioList', 'Loading portfolios...');
    
    setTimeout(() => {
        const portfolioHTML = portfolioData.map(portfolio => `
            <tr class="searchable" data-portfolio-id="${portfolio.id}">
                <td>${portfolio.name}</td>
                <td>${portfolio.accounts}</td>
                <td>${formatCurrency(portfolio.totalValue)}</td>
                <td>${formatCurrency(portfolio.recoveredAmount)}</td>
                <td><span class="status status-${portfolio.status}">${portfolio.status}</span></td>
                <td>${portfolio.assignedAgent ? getUserName(portfolio.assignedAgent) : 'Unassigned'}</td>
                <td>
                    <button class="btn btn-sm" onclick="editPortfolio('${portfolio.id}')">Edit</button>
                    <button class="btn btn-secondary btn-sm" onclick="assignPortfolio('${portfolio.id}')">Assign</button>
                    <button class="btn btn-outline btn-sm" onclick="viewPortfolioDetails('${portfolio.id}')">Details</button>
                </td>
            </tr>
        `).join('');
        
        const tableHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Portfolio Name</th>
                            <th>Accounts</th>
                            <th>Total Value</th>
                            <th>Recovered</th>
                            <th>Status</th>
                            <th>Assigned Agent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${portfolioHTML}
                    </tbody>
                </table>
            </div>
        `;
        
        hideLoading('portfolioList', tableHTML);
    }, 500);
}

// Upload portfolio functionality
function uploadPortfolio() {
    const modalContent = `
        <div class="modal-header">
            <h2>Upload Portfolio</h2>
            <span class="close" onclick="closeModal('uploadPortfolioModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="uploadPortfolioForm" onsubmit="processPortfolioUpload(event)">
                <div class="form-group">
                    <label>Portfolio Name</label>
                    <input type="text" class="form-control" placeholder="Enter portfolio name" required>
                </div>
                <div class="form-group">
                    <label>Portfolio File (CSV)</label>
                    <input type="file" class="form-control" accept=".csv,.xlsx,.xls" required>
                    <small style="color: #1ECBE1;">Supported formats: CSV, Excel (.xlsx, .xls)</small>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control" rows="3" placeholder="Portfolio description (optional)"></textarea>
                </div>
                <div class="form-group">
                    <label>Auto-assign to Agent</label>
                    <select class="form-control">
                        <option value="">Select agent (optional)</option>
                        ${userData.filter(u => u.role === 'agent' && u.active).map(agent => 
                            `<option value="${agent.id}">${agent.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Upload Portfolio</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('uploadPortfolioModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('uploadPortfolioModal', modalContent);
}

// Process portfolio upload
function processPortfolioUpload(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const file = form.querySelector('input[type="file"]').files[0];
    
    if (!file) {
        showNotification('Please select a file to upload', 'error');
        return;
    }
    
    showLoading('uploadPortfolioForm', 'Processing upload...');
    
    // Simulate file processing
    setTimeout(() => {
        const newPortfolio = {
            id: 'PF' + (portfolioData.length + 1).toString().padStart(3, '0'),
            name: form.elements[0].value,
            accounts: Math.floor(Math.random() * 200) + 50, // Simulated
            totalValue: Math.floor(Math.random() * 100000) + 20000, // Simulated
            status: 'active',
            assignedAgent: form.elements[3].value || null,
            createdDate: new Date().toISOString().split('T')[0],
            recoveredAmount: 0.00
        };
        
        portfolioData.push(newPortfolio);
        
        showNotification(`Portfolio "${newPortfolio.name}" uploaded successfully!`, 'success');
        closeModal('uploadPortfolioModal');
        
        // Refresh portfolio list if visible
        if (document.getElementById('portfolioList')) {
            loadPortfolioList();
        }
        
        // Update dashboard metrics
        updateDashboardMetrics();
    }, 2000);
}

// Agent assignment functionality
function assignPortfolio(portfolioId) {
    const portfolio = portfolioData.find(p => p.id === portfolioId);
    if (!portfolio) {
        showNotification('Portfolio not found', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Assign Portfolio - ${portfolio.name}</h2>
            <span class="close" onclick="closeModal('assignPortfolioModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="assignPortfolioForm" onsubmit="processPortfolioAssignment(event, '${portfolioId}')">
                <div class="form-group">
                    <label>Current Assignment</label>
                    <input type="text" class="form-control" value="${portfolio.assignedAgent ? getUserName(portfolio.assignedAgent) : 'Unassigned'}" readonly>
                </div>
                <div class="form-group">
                    <label>Select Agent</label>
                    <select class="form-control" required>
                        <option value="">Select an agent</option>
                        ${userData.filter(u => u.role === 'agent' && u.active).map(agent => 
                            `<option value="${agent.id}" ${portfolio.assignedAgent === agent.id ? 'selected' : ''}>${agent.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Assignment Notes</label>
                    <textarea class="form-control" rows="3" placeholder="Assignment notes (optional)"></textarea>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Assign Portfolio</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('assignPortfolioModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('assignPortfolioModal', modalContent);
}

// Process portfolio assignment
function processPortfolioAssignment(event, portfolioId) {
    event.preventDefault();
    
    const form = event.target;
    const selectedAgent = form.elements[1].value;
    const notes = form.elements[2].value;
    
    const portfolio = portfolioData.find(p => p.id === portfolioId);
    if (!portfolio) {
        showNotification('Portfolio not found', 'error');
        return;
    }
    
    // Update portfolio assignment
    portfolio.assignedAgent = selectedAgent;
    
    // Update agent's assigned portfolios
    const agent = userData.find(u => u.id === selectedAgent);
    if (agent) {
        if (!agent.assignedPortfolios.includes(portfolioId)) {
            agent.assignedPortfolios.push(portfolioId);
        }
    }
    
    showNotification(`Portfolio assigned to ${getUserName(selectedAgent)} successfully!`, 'success');
    closeModal('assignPortfolioModal');
    
    // Refresh portfolio list if visible
    if (document.getElementById('portfolioList')) {
        loadPortfolioList();
    }
}

// User management functions
function loadUserList() {
    const container = document.getElementById('userList');
    if (!container) return;
    
    showLoading('userList', 'Loading users...');
    
    setTimeout(() => {
        const userHTML = userData.map(user => `
            <tr class="searchable" data-user-id="${user.id}">
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status status-${user.role}">${user.role}</span></td>
                <td><span class="status status-${user.active ? 'active' : 'inactive'}">${user.active ? 'Active' : 'Inactive'}</span></td>
                <td>${user.performanceScore ? user.performanceScore + '%' : 'N/A'}</td>
                <td>${formatDate(user.lastLogin)}</td>
                <td>
                    <button class="btn btn-sm" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn btn-outline btn-sm" onclick="viewUserDetails('${user.id}')">Details</button>
                    <button class="btn ${user.active ? 'btn-danger' : 'btn-secondary'} btn-sm" onclick="toggleUserStatus('${user.id}')">${user.active ? 'Deactivate' : 'Activate'}</button>
                </td>
            </tr>
        `).join('');
        
        const tableHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Performance</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userHTML}
                    </tbody>
                </table>
            </div>
        `;
        
        hideLoading('userList', tableHTML);
    }, 500);
}

// Add new user
function addNewUser() {
    const modalContent = `
        <div class="modal-header">
            <h2>Add New User</h2>
            <span class="close" onclick="closeModal('addUserModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="addUserForm" onsubmit="createUser(event)">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="form-control" placeholder="Enter full name" required>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" class="form-control" placeholder="Enter email address" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select class="form-control" required>
                        <option value="">Select role</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Administrator</option>
                        <option value="supervisor">Supervisor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Temporary Password</label>
                    <input type="password" class="form-control" placeholder="Temporary password" required>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Create User</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('addUserModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('addUserModal', modalContent);
}

// Create new user
function createUser(event) {
    event.preventDefault();
    
    const form = event.target;
    const newUser = {
        id: 'user' + (userData.length + 1).toString().padStart(3, '0'),
        name: form.elements[0].value,
        email: form.elements[1].value,
        role: form.elements[2].value,
        active: true,
        assignedPortfolios: [],
        performanceScore: form.elements[2].value === 'agent' ? 0 : null,
        lastLogin: null
    };
    
    userData.push(newUser);
    
    showNotification(`User "${newUser.name}" created successfully!`, 'success');
    closeModal('addUserModal');
    
    // Refresh user list if visible
    if (document.getElementById('userList')) {
        loadUserList();
    }
    
    // Update dashboard metrics
    updateDashboardMetrics();
}

// Download/Export functionality
function showDownloadOptions() {
    const modalContent = `
        <div class="modal-header">
            <h2>Download & Export Options</h2>
            <span class="close" onclick="closeModal('downloadModal')">&times;</span>
        </div>
        <div class="modal-body">
            <div class="download-section">
                <h3>Portfolio Data</h3>
                <div style="margin-bottom: 20px;">
                    <button class="btn" onclick="exportData('portfolios', 'csv', false)">Download CSV</button>
                    <button class="btn" onclick="exportData('portfolios', 'excel', false)">Download Excel</button>
                    <button class="btn btn-secondary" onclick="exportData('portfolios', 'csv', true)">Download CSV (Masked)</button>
                </div>
            </div>
            
            <div class="download-section">
                <h3>Payment Data</h3>
                <div style="margin-bottom: 20px;">
                    <button class="btn" onclick="exportPayments('csv', false)">Download CSV</button>
                    <button class="btn" onclick="exportPayments('excel', false)">Download Excel</button>
                    <button class="btn btn-secondary" onclick="exportPayments('csv', true)">Download CSV (Masked)</button>
                </div>
            </div>
            
            <div class="download-section">
                <h3>User Data</h3>
                <div style="margin-bottom: 20px;">
                    <button class="btn" onclick="exportData('users', 'csv', false)">Download CSV</button>
                    <button class="btn" onclick="exportData('users', 'excel', false)">Download Excel</button>
                </div>
            </div>
            
            <div class="download-section">
                <h3>Reports</h3>
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-outline" onclick="generateReport('performance')">Performance Report</button>
                    <button class="btn btn-outline" onclick="generateReport('portfolio')">Portfolio Summary</button>
                    <button class="btn btn-outline" onclick="generateReport('recovery')">Recovery Report</button>
                </div>
            </div>
        </div>
    `;
    
    showModal('downloadModal', modalContent);
}

// Export data functions
function exportData(dataType, format, masked = false) {
    let data;
    let filename;
    
    switch (dataType) {
        case 'portfolios':
            data = [...portfolioData];
            filename = `portfolios_${new Date().toISOString().split('T')[0]}.${format}`;
            break;
        case 'users':
            data = userData.filter(u => u.role !== 'admin'); // Don't export admin users
            filename = `users_${new Date().toISOString().split('T')[0]}.${format}`;
            break;
        default:
            showNotification('Invalid data type', 'error');
            return;
    }
    
    if (masked && dataType === 'portfolios') {
        data = maskSensitiveData(data, ['id']);
    }
    
    downloadData(data, filename, format);
    closeModal('downloadModal');
}

// Generate reports
function generateReport(reportType) {
    showLoading('downloadModal', `Generating ${reportType} report...`);
    
    setTimeout(() => {
        let reportData;
        let filename;
        
        switch (reportType) {
            case 'performance':
                reportData = generatePerformanceReport();
                filename = `performance_report_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'portfolio':
                reportData = generatePortfolioReport();
                filename = `portfolio_summary_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'recovery':
                reportData = generateRecoveryReport();
                filename = `recovery_report_${new Date().toISOString().split('T')[0]}.csv`;
                break;
        }
        
        downloadData(reportData, filename, 'csv');
        closeModal('downloadModal');
        showNotification(`${reportType} report generated successfully!`, 'success');
    }, 1500);
}

// Report generation functions
function generatePerformanceReport() {
    return userData.filter(u => u.role === 'agent').map(agent => ({
        agentName: agent.name,
        agentId: agent.id,
        performanceScore: agent.performanceScore,
        assignedPortfolios: agent.assignedPortfolios.length,
        lastLogin: agent.lastLogin,
        status: agent.active ? 'Active' : 'Inactive'
    }));
}

function generatePortfolioReport() {
    return portfolioData.map(portfolio => ({
        portfolioId: portfolio.id,
        portfolioName: portfolio.name,
        totalAccounts: portfolio.accounts,
        totalValue: portfolio.totalValue,
        recoveredAmount: portfolio.recoveredAmount,
        recoveryRate: ((portfolio.recoveredAmount / portfolio.totalValue) * 100).toFixed(2) + '%',
        status: portfolio.status,
        assignedAgent: portfolio.assignedAgent ? getUserName(portfolio.assignedAgent) : 'Unassigned',
        createdDate: portfolio.createdDate
    }));
}

function generateRecoveryReport() {
    // Combine portfolio and payment data for recovery insights
    const recoveryData = [];
    
    portfolioData.forEach(portfolio => {
        recoveryData.push({
            type: 'Portfolio',
            id: portfolio.id,
            name: portfolio.name,
            totalValue: portfolio.totalValue,
            recoveredAmount: portfolio.recoveredAmount,
            recoveryRate: ((portfolio.recoveredAmount / portfolio.totalValue) * 100).toFixed(2) + '%',
            date: portfolio.createdDate
        });
    });
    
    return recoveryData;
}

// Utility functions
function getUserName(userId) {
    const user = userData.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
}

function showModal(modalId, content) {
    let modal = document.getElementById(modalId);
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        modal.innerHTML = '<div class="modal-content" id="' + modalId + 'Content"></div>';
        document.body.appendChild(modal);
    }
    
    document.getElementById(modalId + 'Content').innerHTML = content;
    openModal(modalId);
}

// Load recent activity
function loadRecentActivity() {
    const activities = [
        { type: 'portfolio', message: 'New portfolio "Medical Collections Q1 2024" uploaded', time: '2 hours ago' },
        { type: 'payment', message: 'Payment of $250.00 processed by John Smith', time: '3 hours ago' },
        { type: 'user', message: 'Sarah Jones logged in', time: '4 hours ago' },
        { type: 'assignment', message: 'Portfolio assigned to John Smith', time: '5 hours ago' }
    ];
    
    const container = document.getElementById('recentActivity');
    if (container) {
        const activityHTML = activities.map(activity => `
            <div class="activity-item" style="padding: 10px; border-bottom: 1px solid #1ECBE1; margin-bottom: 10px;">
                <div style="color: #3AFCA0; font-weight: 600;">${activity.message}</div>
                <div style="color: #cccccc; font-size: 0.9rem;">${activity.time}</div>
            </div>
        `).join('');
        
        container.innerHTML = activityHTML;
    }
}

// Load portfolio insights
function loadPortfolioInsights() {
    const insights = calculatePortfolioInsights();
    const container = document.getElementById('portfolioInsights');
    
    if (container) {
        const insightsHTML = `
            <div class="insight-item">
                <h4 style="color: #1ECBE1;">Top Performing Portfolio</h4>
                <p>${insights.topPerforming.name}</p>
                <p style="color: #3AFCA0;">Recovery Rate: ${insights.topPerforming.rate}%</p>
            </div>
            <div class="insight-item">
                <h4 style="color: #1ECBE1;">Total Recovery This Month</h4>
                <p style="color: #3AFCA0; font-size: 1.5rem; font-weight: bold;">${formatCurrency(insights.monthlyRecovery)}</p>
            </div>
            <div class="insight-item">
                <h4 style="color: #1ECBE1;">Portfolios Pending Assignment</h4>
                <p style="color: #FF9533; font-size: 1.2rem; font-weight: bold;">${insights.pendingAssignment}</p>
            </div>
        `;
        
        container.innerHTML = insightsHTML;
    }
}

function calculatePortfolioInsights() {
    const topPerforming = portfolioData.reduce((best, current) => {
        const currentRate = (current.recoveredAmount / current.totalValue) * 100;
        const bestRate = best ? (best.recoveredAmount / best.totalValue) * 100 : 0;
        return currentRate > bestRate ? current : best;
    }, null);
    
    return {
        topPerforming: {
            name: topPerforming ? topPerforming.name : 'N/A',
            rate: topPerforming ? ((topPerforming.recoveredAmount / topPerforming.totalValue) * 100).toFixed(1) : 0
        },
        monthlyRecovery: portfolioData.reduce((sum, p) => sum + p.recoveredAmount, 0),
        pendingAssignment: portfolioData.filter(p => !p.assignedAgent).length
    };
}

// Update performance charts (placeholder for chart library integration)
function updatePerformanceCharts() {
    console.log('📊 Performance charts updated (placeholder for chart integration)');
}

// Initialize admin functions
document.addEventListener('DOMContentLoaded', function() {
    if (currentRole === 'admin') {
        console.log('✅ Admin functions initialized');
    }
});

// Make functions available globally
window.AdminFunctions = {
    initializeAdminDashboard,
    updateDashboardMetrics,
    loadPortfolioList,
    uploadPortfolio,
    assignPortfolio,
    loadUserList,
    addNewUser,
    showDownloadOptions,
    exportData,
    generateReport
};