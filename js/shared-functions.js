/* S.E.F. Contact Engine CRM - Shared Functions */

// Global variables
let currentRole = 'admin';
let currentModal = null;
let searchTimeout = null;

// Emergency reset functionality
function emergencyReset() {
    console.log('🚨 Emergency Reset Triggered');
    
    // Close all modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Remove all loading states
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.classList.remove('loading'));
    
    // Clear any stuck states
    document.body.style.overflow = 'auto';
    
    // Reset form states
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    // Clear search
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.value = '';
        if (input.dispatchEvent) {
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    
    // Reset current modal reference
    currentModal = null;
    
    // Show success notification
    showNotification('System reset successfully!', 'success');
    
    console.log('✅ Emergency Reset Complete');
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        currentModal = modal;
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstInput = modal.querySelector('input, select, textarea, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = modalId ? document.getElementById(modalId) : currentModal;
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (currentModal === modal) {
            currentModal = null;
        }
    }
}

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    showNotification('An error occurred. Use Emergency Reset if needed.', 'error');
});

// Notification system
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Search functionality with highlighting
function performSearch(searchTerm, targetElements) {
    if (!searchTerm.trim()) {
        // Clear all highlights
        clearHighlights(targetElements);
        return;
    }
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        clearHighlights(targetElements);
        
        const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
        let matchCount = 0;
        
        targetElements.forEach(element => {
            const content = element.textContent;
            if (regex.test(content)) {
                matchCount++;
                element.style.display = '';
                
                // Highlight matches
                const highlightedContent = content.replace(regex, '<span class="highlight">$&</span>');
                // Store original content if not already stored
                if (!element.dataset.originalContent) {
                    element.dataset.originalContent = element.innerHTML;
                }
                element.innerHTML = highlightedContent;
            } else {
                element.style.display = 'none';
            }
        });
        
        showNotification(`Found ${matchCount} matches`, 'success', 2000);
    }, 300);
}

function clearHighlights(elements) {
    elements.forEach(element => {
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
        }
        element.style.display = '';
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Smart search implementation
function initializeSmartSearch(inputElement, targetSelector) {
    inputElement.addEventListener('input', function(e) {
        const searchTerm = e.target.value;
        const targetElements = document.querySelectorAll(targetSelector);
        performSearch(searchTerm, Array.from(targetElements));
    });
    
    // Clear search on escape
    inputElement.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            e.target.value = '';
            const targetElements = document.querySelectorAll(targetSelector);
            clearHighlights(Array.from(targetElements));
        }
    });
}

// Role management
function switchRole(newRole) {
    currentRole = newRole;
    localStorage.setItem('currentRole', newRole);
    
    // Update UI based on role
    updateUIForRole(newRole);
    
    showNotification(`Switched to ${newRole} role`, 'success');
}

function updateUIForRole(role) {
    const roleSelector = document.getElementById('roleSelector');
    if (roleSelector) {
        roleSelector.textContent = role === 'admin' ? 'Admin Portal' : 
                                  role === 'agent1' ? 'Agent: John Smith' :
                                  role === 'agent2' ? 'Agent: Sarah Jones' : 'Agent Portal';
    }
    
    // Show/hide role-specific elements
    const adminElements = document.querySelectorAll('.admin-only');
    const agentElements = document.querySelectorAll('.agent-only');
    
    adminElements.forEach(el => {
        el.style.display = role === 'admin' ? '' : 'none';
    });
    
    agentElements.forEach(el => {
        el.style.display = role !== 'admin' ? '' : 'none';
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Data validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
}

function validateSSN(ssn) {
    const cleaned = ssn.replace(/\D/g, '');
    return cleaned.length === 9;
}

// Export/Download functionality
function downloadData(data, filename, type = 'json') {
    let content;
    let mimeType;
    
    switch (type) {
        case 'csv':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            break;
        case 'excel':
            // For demo purposes, we'll use CSV format
            content = convertToCSV(data);
            mimeType = 'application/vnd.ms-excel';
            filename = filename.replace('.csv', '.xls');
            break;
        default:
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification(`Downloaded ${filename}`, 'success');
}

function convertToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return '';
    }
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            // Handle special characters in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
}

// Data masking for privacy
function maskSensitiveData(data, maskFields = ['ssn', 'account']) {
    return data.map(item => {
        const maskedItem = { ...item };
        maskFields.forEach(field => {
            if (maskedItem[field]) {
                maskedItem[field] = maskField(maskedItem[field], field);
            }
        });
        return maskedItem;
    });
}

function maskField(value, fieldType) {
    switch (fieldType) {
        case 'ssn':
            return value.replace(/\d(?=\d{4})/g, 'X');
        case 'account':
            return value.replace(/\d(?=\d{4})/g, 'X');
        case 'phone':
            return value.replace(/\d(?=\d{4})/g, 'X');
        default:
            return value.replace(/./g, 'X');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt+C for consumer profile quick access
    if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        openConsumerQuickAccess();
    }
    
    // Escape to close modals
    if (e.key === 'Escape' && currentModal) {
        closeModal();
    }
    
    // Ctrl+Shift+R for emergency reset
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        emergencyReset();
    }
});

function openConsumerQuickAccess() {
    // This will be implemented in portal-specific files
    console.log('Consumer quick access triggered (Alt+C)');
    showNotification('Consumer Quick Access (Alt+C)', 'info', 2000);
}

// Loading state management
function showLoading(elementId, message = 'Loading...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-spinner"></div>
            <p style="text-align: center; margin-top: 10px; color: #1ECBE1;">${message}</p>
        `;
        element.classList.add('loading');
    }
}

function hideLoading(elementId, content = '') {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('loading');
        element.innerHTML = content;
    }
}

// Initialize shared functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize role from localStorage
    const savedRole = localStorage.getItem('currentRole') || 'admin';
    currentRole = savedRole;
    updateUIForRole(currentRole);
    
    // Setup emergency reset button
    const emergencyBtn = document.getElementById('emergencyReset');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', emergencyReset);
    }
    
    // Setup role selector
    const roleSelector = document.getElementById('roleSelector');
    if (roleSelector) {
        roleSelector.addEventListener('click', function() {
            // Toggle between admin and agent roles
            const newRole = currentRole === 'admin' ? 'agent1' : 
                           currentRole === 'agent1' ? 'agent2' : 'admin';
            switchRole(newRole);
        });
    }
    
    // Setup modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close')) {
            closeModal();
        }
        
        // Close modal when clicking outside
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Initialize search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        const targetSelector = input.dataset.target || '.searchable';
        initializeSmartSearch(input, targetSelector);
    });
    
    console.log('✅ Shared functionality initialized');
});

// Make functions available globally
window.S3FContactEngine = {
    emergencyReset,
    openModal,
    closeModal,
    showNotification,
    performSearch,
    switchRole,
    updateUIForRole,
    formatCurrency,
    formatDate,
    formatPhoneNumber,
    validateEmail,
    validatePhone,
    validateSSN,
    downloadData,
    maskSensitiveData,
    showLoading,
    hideLoading,
    openConsumerQuickAccess
};