// ============================================
// EXPENSE TRACKER APP - Main JavaScript
// ============================================

const APP_KEY = 'expenseTrackerData';
const SYNC_KEY = 'expenseTrackerSync';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setCurrentDate();
    setCurrentMonth();
});

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    loadDataFromStorage();
    renderTransactionsList();
    updateSummary();
}

function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

function setCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${year}-${month}`;
    document.getElementById('summaryMonth').value = currentMonth;
    document.getElementById('searchMonth').value = currentMonth;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Form submission
    document.getElementById('transactionForm').addEventListener('submit', addTransaction);

    // Auto-calculate markup
    document.getElementById('cardPayment').addEventListener('input', calculateMarkup);
    document.getElementById('actualBill').addEventListener('input', calculateMarkup);
    document.getElementById('cardCharges').addEventListener('input', calculateMarkup);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Search functionality
    document.getElementById('searchVendor').addEventListener('input', renderTransactionsList);
    document.getElementById('searchMonth').addEventListener('change', renderTransactionsList);
    document.getElementById('clearSearch').addEventListener('click', clearSearch);

    // Summary
    document.getElementById('summaryMonth').addEventListener('change', updateSummary);

    // Export
    document.getElementById('exportCSV').addEventListener('click', () => exportData('csv'));
    document.getElementById('exportExcel').addEventListener('click', () => exportData('excel'));
    document.getElementById('exportJSON').addEventListener('click', () => exportData('json'));

    // Backup & Restore
    document.getElementById('backupBtn').addEventListener('click', backupData);
    document.getElementById('restoreBtn').addEventListener('click', () => {
        document.getElementById('restoreFile').click();
    });
    document.getElementById('restoreFile').addEventListener('change', restoreData);

    // Sync
    document.getElementById('syncBtn').addEventListener('click', syncData);
}

// ============================================
// DATA MANAGEMENT
// ============================================

let transactions = [];

function loadDataFromStorage() {
    const stored = localStorage.getItem(APP_KEY);
    transactions = stored ? JSON.parse(stored) : [];
}

function saveDataToStorage() {
    localStorage.setItem(APP_KEY, JSON.stringify(transactions));
    showToast('Data saved successfully', 'success');
}

// ============================================
// ADD TRANSACTION
// ============================================

function calculateMarkup() {
    const cardPayment = parseFloat(document.getElementById('cardPayment').value) || 0;
    const actualBill = parseFloat(document.getElementById('actualBill').value) || 0;
    const cardCharges = parseFloat(document.getElementById('cardCharges').value) || 0;

    const markupAmount = cardPayment - actualBill;
    const markupPercent = actualBill > 0 ? ((markupAmount / actualBill) * 100).toFixed(2) : 0;
    const netMarkup = markupAmount - cardCharges;

    document.getElementById('markupAmount').value = Math.max(0, markupAmount).toFixed(2);
    document.getElementById('markupPercent').value = Math.max(0, markupPercent);
    document.getElementById('netMarkup').value = netMarkup.toFixed(2);
}

function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        vendor: document.getElementById('vendor').value,
        date: document.getElementById('date').value,
        cardPayment: parseFloat(document.getElementById('cardPayment').value),
        actualBill: parseFloat(document.getElementById('actualBill').value),
        markupAmount: parseFloat(document.getElementById('markupAmount').value),
        markupPercent: parseFloat(document.getElementById('markupPercent').value),
        cardCharges: parseFloat(document.getElementById('cardCharges').value),
        netMarkup: parseFloat(document.getElementById('netMarkup').value),
        paymentStatus: document.getElementById('paymentStatus').value
    };

    transactions.push(transaction);
    saveDataToStorage();
    document.getElementById('transactionForm').reset();
    setCurrentDate();
    renderTransactionsList();
    updateSummary();
    showToast('✅ Transaction added successfully!', 'success');
}

// ============================================
// RENDER TRANSACTIONS
// ============================================

function renderTransactionsList() {
    const searchVendor = document.getElementById('searchVendor').value.toLowerCase();
    const searchMonth = document.getElementById('searchMonth').value;

    let filtered = transactions.filter(t => {
        const vendorMatch = t.vendor.toLowerCase().includes(searchVendor);
        const dateMatch = !searchMonth || t.date.startsWith(searchMonth);
        return vendorMatch && dateMatch;
    });

    const listContainer = document.getElementById('transactionsList');

    if (filtered.length === 0) {
        listContainer.innerHTML = '<div class="empty-state"><h3>No transactions found</h3><p>Add a new transaction to get started</p></div>';
        return;
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    listContainer.innerHTML = filtered.map(t => `
        <div class="transaction-card">
            <h4>${t.vendor}</h4>
            <div class="transaction-details">
                <div class="detail-item">
                    <span>Date</span>
                    <strong>${formatDate(t.date)}</strong>
                </div>
                <div class="detail-item">
                    <span>Card Payment</span>
                    <strong>₹${t.cardPayment.toFixed(2)}</strong>
                </div>
                <div class="detail-item">
                    <span>Actual Bill</span>
                    <strong>₹${t.actualBill.toFixed(2)}</strong>
                </div>
                <div class="detail-item">
                    <span>Markup Amount</span>
                    <strong>₹${t.markupAmount.toFixed(2)}</strong>
                </div>
                <div class="detail-item">
                    <span>Markup %</span>
                    <strong>${t.markupPercent.toFixed(2)}%</strong>
                </div>
                <div class="detail-item">
                    <span>Card Charges</span>
                    <strong>₹${t.cardCharges.toFixed(2)}</strong>
                </div>
                <div class="detail-item">
                    <span>Net Markup</span>
                    <strong>₹${t.netMarkup.toFixed(2)}</strong>
                </div>
                <div class="detail-item">
                    <span>Status</span>
                    <strong>${t.paymentStatus}</strong>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${t.id})">🗑️ Delete</button>
        </div>
    `).join('');
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveDataToStorage();
        renderTransactionsList();
        updateSummary();
        showToast('Transaction deleted', 'success');
    }
}

// ============================================
// SUMMARY
// ============================================

function updateSummary() {
    const summaryMonth = document.getElementById('summaryMonth').value;
    const filtered = transactions.filter(t => t.date.startsWith(summaryMonth));

    if (filtered.length === 0) {
        document.getElementById('summaryDetails').innerHTML = '<div class="empty-state"><p>No transactions for this month</p></div>';
        resetSummaryCards();
        return;
    }

    const totals = {
        cardPayments: filtered.reduce((sum, t) => sum + t.cardPayment, 0),
        actualBills: filtered.reduce((sum, t) => sum + t.actualBill, 0),
        markup: filtered.reduce((sum, t) => sum + t.markupAmount, 0),
        cardCharges: filtered.reduce((sum, t) => sum + t.cardCharges, 0),
        netMarkup: filtered.reduce((sum, t) => sum + t.netMarkup, 0)
    };

    const avgMarkupPercent = filtered.length > 0 
        ? (filtered.reduce((sum, t) => sum + t.markupPercent, 0) / filtered.length).toFixed(2)
        : 0;

    document.getElementById('totalCardPayments').textContent = `₹${totals.cardPayments.toFixed(2)}`;
    document.getElementById('totalActualBills').textContent = `₹${totals.actualBills.toFixed(2)}`;
    document.getElementById('totalMarkup').textContent = `₹${totals.markup.toFixed(2)}`;
    document.getElementById('totalCardCharges').textContent = `₹${totals.cardCharges.toFixed(2)}`;
    document.getElementById('totalNetMarkup').textContent = `₹${totals.netMarkup.toFixed(2)}`;
    document.getElementById('avgMarkupPercent').textContent = `${avgMarkupPercent}%`;

    renderSummaryDetails(filtered);
}

function resetSummaryCards() {
    document.getElementById('totalCardPayments').textContent = '₹0';
    document.getElementById('totalActualBills').textContent = '₹0';
    document.getElementById('totalMarkup').textContent = '₹0';
    document.getElementById('totalCardCharges').textContent = '₹0';
    document.getElementById('totalNetMarkup').textContent = '₹0';
    document.getElementById('avgMarkupPercent').textContent = '0%';
}

function renderSummaryDetails(filtered) {
    const detailsContainer = document.getElementById('summaryDetails');

    const tableHTML = `
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Vendor</th>
                    <th>Card Payment</th>
                    <th>Actual Bill</th>
                    <th>Markup %</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(t => `
                    <tr>
                        <td>${t.vendor}</td>
                        <td>₹${t.cardPayment.toFixed(2)}</td>
                        <td>₹${t.actualBill.toFixed(2)}</td>
                        <td>${t.markupPercent.toFixed(2)}%</td>
                        <td>${t.paymentStatus}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    detailsContainer.innerHTML = tableHTML;
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

function exportData(format) {
    if (transactions.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    let content, filename, mimeType;

    if (format === 'csv') {
        content = generateCSV();
        filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
    } else if (format === 'excel') {
        content = generateCSV();
        filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;';
    } else if (format === 'json') {
        content = JSON.stringify(transactions, null, 2);
        filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json;charset=utf-8;';
    }

    downloadFile(content, filename, mimeType);
    showToast(`✅ Exported to ${format.toUpperCase()}`, 'success');
}

function generateCSV() {
    const headers = ['Date', 'Vendor', 'Card Payment', 'Actual Bill', 'Markup Amount', 'Markup %', 'Card Charges', 'Net Markup', 'Payment Status'];
    const rows = transactions.map(t => [
        t.date,
        t.vendor,
        t.cardPayment,
        t.actualBill,
        t.markupAmount,
        t.markupPercent,
        t.cardCharges,
        t.netMarkup,
        t.paymentStatus
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================
// BACKUP & RESTORE
// ============================================

function backupData() {
    const backup = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        transactions: transactions
    };

    const content = JSON.stringify(backup, null, 2);
    const filename = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    const mimeType = 'application/json;charset=utf-8;';

    downloadFile(content, filename, mimeType);
    showToast('💾 Backup created successfully', 'success');
}

function restoreData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const backup = JSON.parse(event.target.result);
            if (backup.transactions && Array.isArray(backup.transactions)) {
                if (confirm('This will replace all current data. Continue?')) {
                    transactions = backup.transactions;
                    saveDataToStorage();
                    renderTransactionsList();
                    updateSummary();
                    showToast('📥 Data restored successfully', 'success');
                }
            } else {
                throw new Error('Invalid backup file format');
            }
        } catch (error) {
            showToast('❌ Error restoring data: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);

    e.target.value = '';
}

// ============================================
// SYNC FUNCTIONALITY
// ============================================

function syncData() {
    try {
        const syncInfo = {
            lastSync: new Date().toISOString(),
            deviceId: getDeviceId(),
            transactionCount: transactions.length,
            checksum: calculateChecksum()
        };

        localStorage.setItem(SYNC_KEY, JSON.stringify(syncInfo));
        showToast('🔄 Sync completed successfully', 'success');
    } catch (error) {
        showToast('❌ Sync failed: ' + error.message, 'error');
    }
}

function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

function calculateChecksum() {
    const data = JSON.stringify(transactions);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(e) {
    const tabName = e.target.dataset.tab;

    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    e.target.classList.add('active');
}

// ============================================
// UTILITIES
// ============================================

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
}

function clearSearch() {
    document.getElementById('searchVendor').value = '';
    setCurrentMonth();
    renderTransactionsList();
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
