/* S.E.F. Contact Engine CRM - Calendar and Payment Functions */

// Sample payment data
let paymentData = [
    {
        id: 'PAY001',
        consumerId: 'CON001',
        consumerName: 'John Doe',
        amount: 250.00,
        dueDate: '2024-01-15',
        status: 'pending',
        method: 'bank_transfer',
        agentId: 'agent1'
    },
    {
        id: 'PAY002',
        consumerId: 'CON002',
        consumerName: 'Jane Smith',
        amount: 150.75,
        dueDate: '2024-01-18',
        status: 'overdue',
        method: 'credit_card',
        agentId: 'agent2'
    },
    {
        id: 'PAY003',
        consumerId: 'CON003',
        consumerName: 'Robert Johnson',
        amount: 300.00,
        dueDate: '2024-01-22',
        status: 'completed',
        method: 'check',
        agentId: 'agent1'
    },
    {
        id: 'PAY004',
        consumerId: 'CON004',
        consumerName: 'Maria Garcia',
        amount: 125.50,
        dueDate: '2024-01-25',
        status: 'pending',
        method: 'ach',
        agentId: 'agent2'
    }
];

// Calendar state
let currentCalendarDate = new Date();
let calendarContainer = null;

// Initialize calendar
function initializeCalendar(containerId) {
    calendarContainer = document.getElementById(containerId);
    if (calendarContainer) {
        renderCalendar();
    }
}

// Render calendar with payment indicators
function renderCalendar() {
    if (!calendarContainer) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Create calendar header
    const header = document.createElement('div');
    header.className = 'calendar-controls';
    header.innerHTML = `
        <button class="btn btn-outline" onclick="previousMonth()">‹ Previous</button>
        <h3 style="color: #1ECBE1; margin: 0 20px;">
            ${new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button class="btn btn-outline" onclick="nextMonth()">Next ›</button>
    `;
    
    // Create calendar grid
    const calendar = document.createElement('div');
    calendar.className = 'calendar';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = new Date(year, month, day);
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Check for payments on this date
        const paymentsOnDate = getPaymentsForDate(dateString);
        
        if (paymentsOnDate.length > 0) {
            const hasOverdue = paymentsOnDate.some(p => p.status === 'overdue');
            const hasCompleted = paymentsOnDate.some(p => p.status === 'completed');
            
            if (hasOverdue) {
                dayElement.classList.add('overdue');
                dayElement.title = `${paymentsOnDate.length} payment(s) - Overdue`;
            } else if (hasCompleted) {
                dayElement.classList.add('has-payment');
                dayElement.title = `${paymentsOnDate.length} payment(s) - Completed`;
            } else {
                dayElement.classList.add('has-payment');
                dayElement.title = `${paymentsOnDate.length} payment(s) - Pending`;
            }
            
            // Add payment indicator
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${hasOverdue ? '#ff4757' : hasCompleted ? '#3AFCA0' : '#FF9533'};
            `;
            dayElement.style.position = 'relative';
            dayElement.appendChild(indicator);
        }
        
        // Add click handler
        dayElement.addEventListener('click', () => showPaymentsForDate(dateString));
        
        calendar.appendChild(dayElement);
    }
    
    // Clear container and add new content
    calendarContainer.innerHTML = '';
    calendarContainer.appendChild(header);
    calendarContainer.appendChild(calendar);
}

// Navigate calendar
function previousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
}

// Get payments for specific date
function getPaymentsForDate(dateString) {
    return paymentData.filter(payment => payment.dueDate === dateString);
}

// Show payments for selected date
function showPaymentsForDate(dateString) {
    const payments = getPaymentsForDate(dateString);
    
    if (payments.length === 0) {
        showNotification('No payments scheduled for this date', 'info');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Payments for ${formatDate(dateString)}</h2>
            <span class="close" onclick="closeModal('paymentDetailsModal')">&times;</span>
        </div>
        <div class="modal-body">
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Consumer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Method</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payments.map(payment => `
                            <tr>
                                <td>${payment.consumerName}</td>
                                <td>${formatCurrency(payment.amount)}</td>
                                <td><span class="status status-${payment.status}">${payment.status}</span></td>
                                <td>${payment.method.replace('_', ' ')}</td>
                                <td>
                                    <button class="btn btn-sm" onclick="processPayment('${payment.id}')">Process</button>
                                    <button class="btn btn-outline btn-sm" onclick="editPayment('${payment.id}')">Edit</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Create or update modal
    let modal = document.getElementById('paymentDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'paymentDetailsModal';
        modal.className = 'modal';
        modal.innerHTML = '<div class="modal-content" id="paymentDetailsContent"></div>';
        document.body.appendChild(modal);
    }
    
    document.getElementById('paymentDetailsContent').innerHTML = modalContent;
    openModal('paymentDetailsModal');
}

// Payment processing
function processPayment(paymentId) {
    const payment = paymentData.find(p => p.id === paymentId);
    if (!payment) {
        showNotification('Payment not found', 'error');
        return;
    }
    
    if (payment.status === 'completed') {
        showNotification('Payment already completed', 'warning');
        return;
    }
    
    // Show payment processing modal
    const modalContent = `
        <div class="modal-header">
            <h2>Process Payment - ${payment.consumerName}</h2>
            <span class="close" onclick="closeModal('processPaymentModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="paymentForm" onsubmit="submitPayment(event, '${paymentId}')">
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" class="form-control" value="${payment.amount}" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Payment Method</label>
                    <select class="form-control" required>
                        <option value="bank_transfer" ${payment.method === 'bank_transfer' ? 'selected' : ''}>Bank Transfer</option>
                        <option value="credit_card" ${payment.method === 'credit_card' ? 'selected' : ''}>Credit Card</option>
                        <option value="debit_card" ${payment.method === 'debit_card' ? 'selected' : ''}>Debit Card</option>
                        <option value="ach" ${payment.method === 'ach' ? 'selected' : ''}>ACH</option>
                        <option value="check" ${payment.method === 'check' ? 'selected' : ''}>Check</option>
                        <option value="cash" ${payment.method === 'cash' ? 'selected' : ''}>Cash</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Transaction Reference</label>
                    <input type="text" class="form-control" placeholder="Enter transaction reference" required>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea class="form-control" rows="3" placeholder="Payment notes (optional)"></textarea>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Process Payment</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('processPaymentModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    // Create or update modal
    let modal = document.getElementById('processPaymentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'processPaymentModal';
        modal.className = 'modal';
        modal.innerHTML = '<div class="modal-content" id="processPaymentContent"></div>';
        document.body.appendChild(modal);
    }
    
    document.getElementById('processPaymentContent').innerHTML = modalContent;
    openModal('processPaymentModal');
}

// Submit payment
function submitPayment(event, paymentId) {
    event.preventDefault();
    
    const payment = paymentData.find(p => p.id === paymentId);
    if (!payment) {
        showNotification('Payment not found', 'error');
        return;
    }
    
    // Update payment status
    payment.status = 'completed';
    payment.processedDate = new Date().toISOString().split('T')[0];
    
    showNotification(`Payment of ${formatCurrency(payment.amount)} processed successfully!`, 'success');
    closeModal('processPaymentModal');
    closeModal('paymentDetailsModal');
    
    // Refresh calendar
    renderCalendar();
    
    // Update any dashboard metrics
    updatePaymentMetrics();
}

// Edit payment
function editPayment(paymentId) {
    const payment = paymentData.find(p => p.id === paymentId);
    if (!payment) {
        showNotification('Payment not found', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h2>Edit Payment - ${payment.consumerName}</h2>
            <span class="close" onclick="closeModal('editPaymentModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="editPaymentForm" onsubmit="updatePayment(event, '${paymentId}')">
                <div class="form-group">
                    <label>Consumer Name</label>
                    <input type="text" class="form-control" value="${payment.consumerName}" required>
                </div>
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" class="form-control" value="${payment.amount}" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" class="form-control" value="${payment.dueDate}" required>
                </div>
                <div class="form-group">
                    <label>Payment Method</label>
                    <select class="form-control" required>
                        <option value="bank_transfer" ${payment.method === 'bank_transfer' ? 'selected' : ''}>Bank Transfer</option>
                        <option value="credit_card" ${payment.method === 'credit_card' ? 'selected' : ''}>Credit Card</option>
                        <option value="debit_card" ${payment.method === 'debit_card' ? 'selected' : ''}>Debit Card</option>
                        <option value="ach" ${payment.method === 'ach' ? 'selected' : ''}>ACH</option>
                        <option value="check" ${payment.method === 'check' ? 'selected' : ''}>Check</option>
                        <option value="cash" ${payment.method === 'cash' ? 'selected' : ''}>Cash</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select class="form-control" required>
                        <option value="pending" ${payment.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="completed" ${payment.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="overdue" ${payment.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                        <option value="cancelled" ${payment.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Update Payment</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('editPaymentModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    // Create or update modal
    let modal = document.getElementById('editPaymentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editPaymentModal';
        modal.className = 'modal';
        modal.innerHTML = '<div class="modal-content" id="editPaymentContent"></div>';
        document.body.appendChild(modal);
    }
    
    document.getElementById('editPaymentContent').innerHTML = modalContent;
    openModal('editPaymentModal');
}

// Update payment
function updatePayment(event, paymentId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const payment = paymentData.find(p => p.id === paymentId);
    
    if (!payment) {
        showNotification('Payment not found', 'error');
        return;
    }
    
    // Update payment data (in a real app, this would be an API call)
    const form = event.target;
    payment.consumerName = form.querySelector('input[type="text"]').value;
    payment.amount = parseFloat(form.querySelector('input[type="number"]').value);
    payment.dueDate = form.querySelector('input[type="date"]').value;
    payment.method = form.querySelector('select').value;
    payment.status = form.querySelectorAll('select')[1].value;
    
    showNotification('Payment updated successfully!', 'success');
    closeModal('editPaymentModal');
    closeModal('paymentDetailsModal');
    
    // Refresh calendar
    renderCalendar();
    
    // Update metrics
    updatePaymentMetrics();
}

// Add new payment
function addNewPayment() {
    const modalContent = `
        <div class="modal-header">
            <h2>Add New Payment</h2>
            <span class="close" onclick="closeModal('addPaymentModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="addPaymentForm" onsubmit="createPayment(event)">
                <div class="form-group">
                    <label>Consumer Name</label>
                    <input type="text" class="form-control" placeholder="Enter consumer name" required>
                </div>
                <div class="form-group">
                    <label>Consumer ID</label>
                    <input type="text" class="form-control" placeholder="Enter consumer ID" required>
                </div>
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" class="form-control" placeholder="0.00" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" class="form-control" required>
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
                    </select>
                </div>
                <div class="form-group">
                    <label>Assigned Agent</label>
                    <select class="form-control" required>
                        <option value="">Select agent</option>
                        <option value="agent1">John Smith</option>
                        <option value="agent2">Sarah Jones</option>
                    </select>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="btn">Add Payment</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('addPaymentModal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    // Create or update modal
    let modal = document.getElementById('addPaymentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'addPaymentModal';
        modal.className = 'modal';
        modal.innerHTML = '<div class="modal-content" id="addPaymentContent"></div>';
        document.body.appendChild(modal);
    }
    
    document.getElementById('addPaymentContent').innerHTML = modalContent;
    openModal('addPaymentModal');
}

// Create new payment
function createPayment(event) {
    event.preventDefault();
    
    const form = event.target;
    const formElements = form.elements;
    
    const newPayment = {
        id: 'PAY' + (paymentData.length + 1).toString().padStart(3, '0'),
        consumerName: formElements[0].value,
        consumerId: formElements[1].value,
        amount: parseFloat(formElements[2].value),
        dueDate: formElements[3].value,
        method: formElements[4].value,
        agentId: formElements[5].value,
        status: 'pending'
    };
    
    paymentData.push(newPayment);
    
    showNotification('Payment added successfully!', 'success');
    closeModal('addPaymentModal');
    
    // Refresh calendar
    renderCalendar();
    
    // Update metrics
    updatePaymentMetrics();
}

// Update payment metrics
function updatePaymentMetrics() {
    const totalPayments = paymentData.length;
    const completedPayments = paymentData.filter(p => p.status === 'completed').length;
    const overduePayments = paymentData.filter(p => p.status === 'overdue').length;
    const pendingPayments = paymentData.filter(p => p.status === 'pending').length;
    
    const totalAmount = paymentData.reduce((sum, p) => sum + p.amount, 0);
    const completedAmount = paymentData.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    
    // Update dashboard metrics if elements exist
    const elements = {
        totalPayments: document.getElementById('totalPayments'),
        completedPayments: document.getElementById('completedPayments'),
        overduePayments: document.getElementById('overduePayments'),
        pendingPayments: document.getElementById('pendingPayments'),
        totalAmount: document.getElementById('totalAmount'),
        completedAmount: document.getElementById('completedAmount'),
        collectionRate: document.getElementById('collectionRate')
    };
    
    if (elements.totalPayments) elements.totalPayments.textContent = totalPayments;
    if (elements.completedPayments) elements.completedPayments.textContent = completedPayments;
    if (elements.overduePayments) elements.overduePayments.textContent = overduePayments;
    if (elements.pendingPayments) elements.pendingPayments.textContent = pendingPayments;
    if (elements.totalAmount) elements.totalAmount.textContent = formatCurrency(totalAmount);
    if (elements.completedAmount) elements.completedAmount.textContent = formatCurrency(completedAmount);
    if (elements.collectionRate) {
        const rate = totalAmount > 0 ? ((completedAmount / totalAmount) * 100).toFixed(1) : 0;
        elements.collectionRate.textContent = rate + '%';
    }
}

// Export payment data
function exportPayments(format = 'csv', masked = false) {
    let dataToExport = [...paymentData];
    
    if (masked) {
        dataToExport = maskSensitiveData(dataToExport, ['consumerId']);
    }
    
    const filename = `payments_${new Date().toISOString().split('T')[0]}.${format}`;
    downloadData(dataToExport, filename, format);
}

// Filter payments by agent
function getPaymentsByAgent(agentId) {
    return paymentData.filter(payment => payment.agentId === agentId);
}

// Filter payments by date range
function getPaymentsByDateRange(startDate, endDate) {
    return paymentData.filter(payment => {
        const paymentDate = new Date(payment.dueDate);
        return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
    });
}

// Initialize calendar functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Calendar and payment functions initialized');
});

// Make functions available globally
window.CalendarFunctions = {
    initializeCalendar,
    renderCalendar,
    previousMonth,
    nextMonth,
    showPaymentsForDate,
    processPayment,
    editPayment,
    addNewPayment,
    updatePaymentMetrics,
    exportPayments,
    getPaymentsByAgent,
    getPaymentsByDateRange
};