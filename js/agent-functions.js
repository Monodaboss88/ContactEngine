/* S.E.F. Contact Engine CRM - Agent Functions */

// Sample consumer data
let consumerData = [
    {
        id: 'CON001',
        name: 'John Doe',
        phone: '(555) 123-4567',
        email: 'john.doe@email.com',
        address: '123 Main St, Anytown, ST 12345',
        ssn: 'XXX-XX-1234',
        accountNumber: 'ACC001',
        balance: 1250.00,
        lastPayment: '2023-12-15',
        status: 'active',
        assignedAgent: 'agent1',
        notes: 'Cooperative debtor, prefers phone contact',
        portfolioId: 'PF001'
    },
    {
        id: 'CON002',
        name: 'Jane Smith',
        phone: '(555) 987-6543',
        email: 'jane.smith@email.com',
        address: '456 Oak Ave, Somewhere, ST 67890',
        ssn: 'XXX-XX-5678',
        accountNumber: 'ACC002',
        balance: 850.75,
        lastPayment: '2024-01-10',
        status: 'active',
        assignedAgent: 'agent2',
        notes: 'Email preferred, payment plan requested',
        portfolioId: 'PF002'
    },
    {
        id: 'CON003',
        name: 'Robert Johnson',
        phone: '(555) 456-7890',
        email: 'robert.johnson@email.com',
        address: '789 Pine Rd, Elsewhere, ST 54321',
        ssn: 'XXX-XX-9012',
        accountNumber: 'ACC003',
        balance: 2100.00,
        lastPayment: '2023-11-30',
        status: 'pending',
        assignedAgent: 'agent1',
        notes: 'Hard to reach, try morning calls',
        portfolioId: 'PF001'
    },
    {
        id: 'CON004',
        name: 'Maria Garcia',
        phone: '(555) 321-0987',
        email: 'maria.garcia@email.com',
        address: '321 Elm St, Anyplace, ST 98765',
        ssn: 'XXX-XX-3456',
        accountNumber: 'ACC004',
        balance: 675.50,
        lastPayment: '2024-01-08',
        status: 'active',
        assignedAgent: 'agent2',
        notes: 'Spanish speaking, very cooperative',
        portfolioId: 'PF002'
    }
];

// Initialize agent dashboard
function initializeAgentDashboard() {
    updateAgentMetrics();
    loadAssignedAccounts();
    loadAgentTasks();
    updatePaymentMetrics();
    
    console.log('✅ Agent dashboard initialized');
}

// Update agent-specific metrics
function updateAgentMetrics() {
    const agentAccounts = getAgentAccounts();
    const metrics = calculateAgentMetrics(agentAccounts);
    
    // Update metric cards
    const metricElements = {
        assignedAccounts: document.getElementById('assignedAccounts'),
        totalBalance: document.getElementById('totalBalance'),
        monthlyRecovered: document.getElementById('monthlyRecovered'),
        contactsToday: document.getElementById('contactsToday'),
        successRate: document.getElementById('successRate'),
        averagePayment: document.getElementById('averagePayment')
    };
    
    Object.keys(metricElements).forEach(key => {
        if (metricElements[key]) {
            switch (key) {
                case 'assignedAccounts':
                    metricElements[key].textContent = metrics.totalAccounts;
                    break;
                case 'totalBalance':
                    metricElements[key].textContent = formatCurrency(metrics.totalBalance);
                    break;
                case 'monthlyRecovered':
                    metricElements[key].textContent = formatCurrency(metrics.monthlyRecovered);
                    break;
                case 'contactsToday':
                    metricElements[key].textContent = metrics.contactsToday;
                    break;
                case 'successRate':
                    metricElements[key].textContent = metrics.successRate + '%';
                    break;
                case 'averagePayment':
                    metricElements[key].textContent = formatCurrency(metrics.averagePayment);
                    break;
            }
        }
    });
}

// Calculate agent-specific metrics
function calculateAgentMetrics(accounts) {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const monthlyRecovered = 2500.00; // Simulated monthly recovery
    const contactsToday = 8; // Simulated daily contacts
    const successRate = 75.5; // Simulated success rate
    const averagePayment = totalBalance > 0 ? totalBalance / totalAccounts : 0;
    
    return {
        totalAccounts,
        totalBalance,
        monthlyRecovered,
        contactsToday,
        successRate,
        averagePayment
    };
}

// Get accounts assigned to current agent
function getAgentAccounts() {
    return consumerData.filter(consumer => consumer.assignedAgent === currentRole);
}

// Load assigned accounts for agent
function loadAssignedAccounts() {
    const container = document.getElementById('assignedAccountsList');
    if (!container) return;
    
    showLoading('assignedAccountsList', 'Loading assigned accounts...');
    
    setTimeout(() => {
        const agentAccounts = getAgentAccounts();
        
        if (agentAccounts.length === 0) {
            hideLoading('assignedAccountsList', '<p style="text-align: center; color: #cccccc;">No accounts assigned yet.</p>');
            return;
        }
        
        const accountsHTML = agentAccounts.map(account => `
            <tr class="searchable" data-account-id="${account.id}">
                <td>${account.name}</td>
                <td>${account.phone}</td>
                <td>${formatCurrency(account.balance)}</td>
                <td><span class="status status-${account.status}">${account.status}</span></td>
                <td>${formatDate(account.lastPayment)}</td>
                <td>
                    <button class="btn btn-sm" onclick="openConsumerProfile('${account.id}')">View Profile</button>
                    <button class="btn btn-secondary btn-sm" onclick="addPayment('${account.id}')">Add Payment</button>
                    <button class="btn btn-outline btn-sm" onclick="addNote('${account.id}')">Add Note</button>
                </td>
            </tr>
        `).join('');
        
        const tableHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Consumer Name</th>
                            <th>Phone</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Last Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${accountsHTML}
                    </tbody>
                </table>
            </div>
        `;
        
        hideLoading('assignedAccountsList', tableHTML);
    }, 500);
}

// Consumer profile management
function openConsumerProfile(consumerId) {
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    // Check if agent has access to this consumer
    if (currentRole !== 'admin' && consumer.assignedAgent !== currentRole) {
        showNotification('Access denied: Consumer not assigned to you', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Consumer Profile - ${consumer.name}</h2>
            <span class="close" onclick="closeModal('consumerProfileModal')">&times;</span>
        </div>
        <div class="modal-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <h3 style="color: #1ECBE1; margin-bottom: 15px;">Contact Information</h3>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="form-control" value="${consumer.name}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="text" class="form-control" value="${consumer.phone}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="text" class="form-control" value="${consumer.email}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea class="form-control" rows="2" readonly>${consumer.address}</textarea>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #1ECBE1; margin-bottom: 15px;">Account Information</h3>
                    <div class="form-group">
                        <label>Account Number</label>
                        <input type="text" class="form-control" value="${consumer.accountNumber}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Outstanding Balance</label>
                        <input type="text" class="form-control" value="${formatCurrency(consumer.balance)}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Last Payment Date</label>
                        <input type="text" class="form-control" value="${formatDate(consumer.lastPayment)}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Account Status</label>
                        <input type="text" class="form-control" value="${consumer.status}" readonly>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <h3 style="color: #1ECBE1; margin-bottom: 15px;">Notes</h3>
                <textarea class="form-control" rows="3" readonly>${consumer.notes}</textarea>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn" onclick="addPayment('${consumer.id}')">Record Payment</button>
                <button class="btn btn-secondary" onclick="addNote('${consumer.id}')">Add Note</button>
                <button class="btn btn-outline" onclick="updateStatus('${consumer.id}')">Update Status</button>
                <button class="btn btn-outline" onclick="printProfile('${consumer.id}')">Print Profile</button>
                <button class="btn btn-outline" onclick="closeModal('consumerProfileModal')">Close</button>
            </div>
        </div>
    `;
    
    showModal('consumerProfileModal', modalContent);
}

// Consumer quick access (Alt+C shortcut)
function openConsumerQuickAccess() {
    const modalContent = `
        <div class="modal-header">
            <h2>Consumer Quick Access</h2>
            <span class="close" onclick="closeModal('quickAccessModal')">&times;</span>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Search Consumer</label>
                <input type="text" id="quickAccessSearch" class="form-control" placeholder="Enter name, phone, or account number" autofocus>
            </div>
            <div id="quickAccessResults" style="margin-top: 15px;">
                <p style="color: #cccccc; text-align: center;">Start typing to search consumers...</p>
            </div>
        </div>
    `;
    
    showModal('quickAccessModal', modalContent);
    
    // Setup search functionality
    const searchInput = document.getElementById('quickAccessSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            performQuickSearch(e.target.value);
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const results = document.querySelectorAll('.quick-access-result');
                if (results.length === 1) {
                    results[0].click();
                }
            }
        });
    }
}

// Perform quick consumer search
function performQuickSearch(searchTerm) {
    const resultsContainer = document.getElementById('quickAccessResults');
    if (!resultsContainer) return;
    
    if (!searchTerm.trim()) {
        resultsContainer.innerHTML = '<p style="color: #cccccc; text-align: center;">Start typing to search consumers...</p>';
        return;
    }
    
    const agentAccounts = getAgentAccounts();
    const searchTermLower = searchTerm.toLowerCase();
    
    const matches = agentAccounts.filter(consumer => 
        consumer.name.toLowerCase().includes(searchTermLower) ||
        consumer.phone.includes(searchTerm) ||
        consumer.accountNumber.toLowerCase().includes(searchTermLower) ||
        consumer.email.toLowerCase().includes(searchTermLower)
    );
    
    if (matches.length === 0) {
        resultsContainer.innerHTML = '<p style="color: #FF9533; text-align: center;">No matching consumers found</p>';
        return;
    }
    
    const resultsHTML = matches.map(consumer => `
        <div class="quick-access-result" style="padding: 10px; border: 1px solid #1ECBE1; border-radius: 5px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s ease;" onclick="selectQuickAccessConsumer('${consumer.id}')">
            <div style="font-weight: bold; color: #1ECBE1;">${consumer.name}</div>
            <div style="color: #cccccc; font-size: 0.9rem;">${consumer.phone} • ${consumer.accountNumber}</div>
            <div style="color: #3AFCA0; font-size: 0.9rem;">Balance: ${formatCurrency(consumer.balance)}</div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
    
    // Add hover effects
    const resultElements = resultsContainer.querySelectorAll('.quick-access-result');
    resultElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(30, 203, 225, 0.1)';
        });
        element.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
}

// Select consumer from quick access
function selectQuickAccessConsumer(consumerId) {
    closeModal('quickAccessModal');
    openConsumerProfile(consumerId);
}

// Add payment functionality
function addPayment(consumerId) {
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Record Payment - ${consumer.name}</h2>
            <span class="close" onclick="closeModal('addPaymentModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="addPaymentForm" onsubmit="recordPayment(event, '${consumerId}')">
                <div class="form-group">
                    <label>Current Balance</label>
                    <input type="text" class="form-control" value="${formatCurrency(consumer.balance)}" readonly>
                </div>
                <div class="form-group">
                    <label>Payment Amount</label>
                    <input type="number" class="form-control" placeholder="0.00" step="0.01" max="${consumer.balance}" required>
                </div>
                <div class="form-group">
                    <label>Payment Method</label>
                    <select class="form-control" required>
                        <option value="">Select payment method</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="ach">ACH</option>
                        <option value="check">Check</option>
                        <option value="cash">Cash</option>
                        <option value="money_order">Money Order</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Transaction Reference</label>
                    <input type="text" class="form-control" placeholder="Enter transaction reference (optional)">
                </div>
                <div class="form-group">
                    <label>Payment Notes</label>
                    <textarea class="form-control" rows="3" placeholder="Payment notes (optional)"></textarea>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Record Payment</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('addPaymentModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('addPaymentModal', modalContent);
}

// Record payment
function recordPayment(event, consumerId) {
    event.preventDefault();
    
    const form = event.target;
    const paymentAmount = parseFloat(form.elements[1].value);
    const paymentMethod = form.elements[2].value;
    const reference = form.elements[3].value;
    const notes = form.elements[4].value;
    
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    if (paymentAmount <= 0 || paymentAmount > consumer.balance) {
        showNotification('Invalid payment amount', 'error');
        return;
    }
    
    // Update consumer balance
    consumer.balance -= paymentAmount;
    consumer.lastPayment = new Date().toISOString().split('T')[0];
    
    // Add to payment data (from calendar-functions.js)
    const newPayment = {
        id: 'PAY' + (paymentData.length + 1).toString().padStart(3, '0'),
        consumerId: consumer.id,
        consumerName: consumer.name,
        amount: paymentAmount,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        method: paymentMethod,
        agentId: currentRole,
        reference: reference,
        notes: notes
    };
    
    if (typeof paymentData !== 'undefined') {
        paymentData.push(newPayment);
    }
    
    showNotification(`Payment of ${formatCurrency(paymentAmount)} recorded successfully!`, 'success');
    closeModal('addPaymentModal');
    
    // Refresh assigned accounts list
    if (document.getElementById('assignedAccountsList')) {
        loadAssignedAccounts();
    }
    
    // Update metrics
    updateAgentMetrics();
    updatePaymentMetrics();
}

// Add note functionality
function addNote(consumerId) {
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Add Note - ${consumer.name}</h2>
            <span class="close" onclick="closeModal('addNoteModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="addNoteForm" onsubmit="saveNote(event, '${consumerId}')">
                <div class="form-group">
                    <label>Current Notes</label>
                    <textarea class="form-control" rows="3" readonly>${consumer.notes}</textarea>
                </div>
                <div class="form-group">
                    <label>New Note</label>
                    <textarea class="form-control" rows="4" placeholder="Enter new note..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Note Type</label>
                    <select class="form-control" required>
                        <option value="">Select note type</option>
                        <option value="contact">Contact Attempt</option>
                        <option value="payment">Payment Discussion</option>
                        <option value="arrangement">Payment Arrangement</option>
                        <option value="dispute">Dispute Information</option>
                        <option value="general">General Note</option>
                        <option value="callback">Callback Scheduled</option>
                    </select>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Save Note</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('addNoteModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('addNoteModal', modalContent);
}

// Save note
function saveNote(event, consumerId) {
    event.preventDefault();
    
    const form = event.target;
    const newNote = form.elements[1].value;
    const noteType = form.elements[2].value;
    
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    // Add note with timestamp
    const timestamp = new Date().toLocaleString();
    const formattedNote = `[${timestamp} - ${noteType.toUpperCase()}] ${newNote}`;
    
    consumer.notes = consumer.notes ? consumer.notes + '\n\n' + formattedNote : formattedNote;
    
    showNotification('Note added successfully!', 'success');
    closeModal('addNoteModal');
}

// Update consumer status
function updateStatus(consumerId) {
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Update Status - ${consumer.name}</h2>
            <span class="close" onclick="closeModal('updateStatusModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="updateStatusForm" onsubmit="saveStatus(event, '${consumerId}')">
                <div class="form-group">
                    <label>Current Status</label>
                    <input type="text" class="form-control" value="${consumer.status}" readonly>
                </div>
                <div class="form-group">
                    <label>New Status</label>
                    <select class="form-control" required>
                        <option value="">Select new status</option>
                        <option value="active" ${consumer.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="pending" ${consumer.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="settled" ${consumer.status === 'settled' ? 'selected' : ''}>Settled</option>
                        <option value="disputed" ${consumer.status === 'disputed' ? 'selected' : ''}>Disputed</option>
                        <option value="closed" ${consumer.status === 'closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status Change Reason</label>
                    <textarea class="form-control" rows="3" placeholder="Reason for status change..." required></textarea>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Update Status</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('updateStatusModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('updateStatusModal', modalContent);
}

// Save status update
function saveStatus(event, consumerId) {
    event.preventDefault();
    
    const form = event.target;
    const newStatus = form.elements[1].value;
    const reason = form.elements[2].value;
    
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    const oldStatus = consumer.status;
    consumer.status = newStatus;
    
    // Add status change note
    const timestamp = new Date().toLocaleString();
    const statusNote = `[${timestamp} - STATUS CHANGE] Status changed from ${oldStatus} to ${newStatus}. Reason: ${reason}`;
    consumer.notes = consumer.notes ? consumer.notes + '\n\n' + statusNote : statusNote;
    
    showNotification(`Status updated to ${newStatus}`, 'success');
    closeModal('updateStatusModal');
    
    // Refresh assigned accounts list
    if (document.getElementById('assignedAccountsList')) {
        loadAssignedAccounts();
    }
}

// Load agent tasks
function loadAgentTasks() {
    const tasks = [
        { type: 'callback', description: 'Call John Doe - payment arrangement', priority: 'high', due: '2024-01-16 10:00 AM' },
        { type: 'follow-up', description: 'Follow up on Jane Smith payment plan', priority: 'medium', due: '2024-01-16 2:00 PM' },
        { type: 'contact', description: 'Initial contact attempt - Robert Johnson', priority: 'high', due: '2024-01-16 9:00 AM' },
        { type: 'review', description: 'Review Maria Garcia account notes', priority: 'low', due: '2024-01-17 11:00 AM' }
    ];
    
    const container = document.getElementById('agentTasks');
    if (container) {
        const tasksHTML = tasks.map(task => `
            <div class="task-item" style="padding: 12px; border-left: 4px solid ${task.priority === 'high' ? '#ff4757' : task.priority === 'medium' ? '#FF9533' : '#3AFCA0'}; background: rgba(30, 203, 225, 0.05); margin-bottom: 10px; border-radius: 4px;">
                <div style="font-weight: 600; color: #1ECBE1; margin-bottom: 5px;">${task.description}</div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #cccccc; font-size: 0.9rem;">${task.due}</span>
                    <span class="priority priority-${task.priority}" style="padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; color: #101419; background: ${task.priority === 'high' ? '#ff4757' : task.priority === 'medium' ? '#FF9533' : '#3AFCA0'};">${task.priority.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = tasksHTML;
    }
}

// Agent reporting (limited scope)
function loadAgentReports() {
    const agentAccounts = getAgentAccounts();
    const reportData = {
        totalAssigned: agentAccounts.length,
        totalBalance: agentAccounts.reduce((sum, acc) => sum + acc.balance, 0),
        activeAccounts: agentAccounts.filter(acc => acc.status === 'active').length,
        settledAccounts: agentAccounts.filter(acc => acc.status === 'settled').length,
        averageBalance: agentAccounts.length > 0 ? agentAccounts.reduce((sum, acc) => sum + acc.balance, 0) / agentAccounts.length : 0
    };
    
    const container = document.getElementById('agentReports');
    if (container) {
        const reportsHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${reportData.totalAssigned}</div>
                    <div class="stat-label">Total Assigned</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${formatCurrency(reportData.totalBalance)}</div>
                    <div class="stat-label">Total Balance</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.activeAccounts}</div>
                    <div class="stat-label">Active Accounts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${reportData.settledAccounts}</div>
                    <div class="stat-label">Settled Accounts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${formatCurrency(reportData.averageBalance)}</div>
                    <div class="stat-label">Average Balance</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${((reportData.settledAccounts / reportData.totalAssigned) * 100).toFixed(1)}%</div>
                    <div class="stat-label">Settlement Rate</div>
                </div>
            </div>
        `;
        
        container.innerHTML = reportsHTML;
    }
}

// Print consumer profile
function printProfile(consumerId) {
    const consumer = consumerData.find(c => c.id === consumerId);
    if (!consumer) {
        showNotification('Consumer not found', 'error');
        return;
    }
    
    const printContent = `
        <html>
        <head>
            <title>Consumer Profile - ${consumer.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1ECBE1; padding-bottom: 10px; }
                .section { margin-bottom: 20px; }
                .section h3 { color: #1ECBE1; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; width: 150px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>S.E.F. Contact Engine CRM</h1>
                <h2>Consumer Profile</h2>
            </div>
            
            <div class="section">
                <h3>Contact Information</h3>
                <div class="field"><span class="label">Name:</span> ${consumer.name}</div>
                <div class="field"><span class="label">Phone:</span> ${consumer.phone}</div>
                <div class="field"><span class="label">Email:</span> ${consumer.email}</div>
                <div class="field"><span class="label">Address:</span> ${consumer.address}</div>
            </div>
            
            <div class="section">
                <h3>Account Information</h3>
                <div class="field"><span class="label">Account Number:</span> ${consumer.accountNumber}</div>
                <div class="field"><span class="label">Balance:</span> ${formatCurrency(consumer.balance)}</div>
                <div class="field"><span class="label">Last Payment:</span> ${formatDate(consumer.lastPayment)}</div>
                <div class="field"><span class="label">Status:</span> ${consumer.status}</div>
            </div>
            
            <div class="section">
                <h3>Notes</h3>
                <p style="white-space: pre-wrap;">${consumer.notes}</p>
            </div>
            
            <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
                Generated on ${new Date().toLocaleString()} by ${getCurrentAgentName()}
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    showNotification('Profile prepared for printing', 'success');
}

// Utility functions
function getCurrentAgentName() {
    switch (currentRole) {
        case 'agent1': return 'John Smith';
        case 'agent2': return 'Sarah Jones';
        default: return 'Agent';
    }
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

// Initialize agent functions
document.addEventListener('DOMContentLoaded', function() {
    if (currentRole !== 'admin') {
        console.log('✅ Agent functions initialized');
    }
});

// Make functions available globally
window.AgentFunctions = {
    initializeAgentDashboard,
    updateAgentMetrics,
    loadAssignedAccounts,
    openConsumerProfile,
    openConsumerQuickAccess,
    addPayment,
    addNote,
    updateStatus,
    loadAgentTasks,
    loadAgentReports,
    printProfile
};