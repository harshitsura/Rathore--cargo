let documentHistory = [];
let currentInvoiceData = null;
let currentReceiptData = null;

// Load history from localStorage
window.addEventListener('load', () => {
    loadHistory();
    setTodayDate();
});

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) input.value = today;
    });
}

function switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    // Remove active from buttons
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    // Show selected section
    document.getElementById(tabName).classList.add('active');
    // Add active to button
    event.target.classList.add('active');
}

function generateInvoice() {
    const invNum = document.getElementById('invNum').value;
    const invDate = document.getElementById('invDate').value;
    const invDueDate = document.getElementById('invDueDate').value;
    const clientName = document.getElementById('invClientName').value;
    const email = document.getElementById('invEmail').value;
    const phone = document.getElementById('invPhone').value;
    const address = document.getElementById('invAddress').value;
    const from = document.getElementById('invFrom').value;
    const to = document.getElementById('invTo').value;
    const service = document.getElementById('invService').value;
    const qty = parseFloat(document.getElementById('invQty').value);
    const price = parseFloat(document.getElementById('invPrice').value);
    const discount = parseFloat(document.getElementById('invDiscount').value) || 0;
    const tax = parseFloat(document.getElementById('invTax').value) || 0;
    const notes = document.getElementById('invNotes').value;

    if (!invNum || !invDate || !clientName || !email || !phone || !address || !from || !to || !service || !price) {
        alert('⚠️ Please fill all required fields!');
        return;
    }

    const subtotal = price * qty;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const total = taxableAmount + taxAmount;

    const invoiceHTML = `
        <div class="doc-header">
            <div class="company-name">🚚 RATHORE CARGO</div>
            <div class="company-details">
                Professional Cargo Services<br>
                Bikaner, Rajasthan, India<br>
                Phone: +91 8764673455 | Email: info@ratherocargo.com<br>
                GST: 18AAFCU1234H1Z5
            </div>
            <div class="doc-title">COMMERCIAL INVOICE</div>
        </div>

        <div class="doc-section">
            <div class="section-label">Invoice Information</div>
            <div class="section-content">
                Invoice #: <strong>${invNum}</strong><br>
                Invoice Date: <strong>${new Date(invDate).toLocaleDateString('en-IN')}</strong><br>
                Due Date: <strong>${new Date(invDueDate).toLocaleDateString('en-IN')}</strong>
            </div>
        </div>

        <div class="doc-section">
            <div class="section-label">Bill To</div>
            <div class="section-content">
                <strong>${clientName}</strong><br>
                ${address}<br>
                Email: ${email}<br>
                Phone: ${phone}
            </div>
        </div>

        <div class="doc-section">
            <div class="section-label">Shipment Details</div>
            <div class="section-content">
                From: <strong>${from}</strong> | To: <strong>${to}</strong><br>
                Service: <strong>${service}</strong>
            </div>
        </div>

        <div class="doc-section">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align: right;">Qty</th>
                        <th style="text-align: right;">Unit Price</th>
                        <th style="text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${service}</td>
                        <td style="text-align: right;">${qty}</td>
                        <td style="text-align: right;">₹ ${price.toFixed(2)}</td>
                        <td style="text-align: right;">₹ ${subtotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="doc-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹ ${subtotal.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `<div class="summary-row">
                <span>Discount (${discount}%):</span>
                <span>- ₹ ${discountAmount.toFixed(2)}</span>
            </div>` : ''}
            <div class="summary-row">
                <span>Tax (${tax}%):</span>
                <span>+ ₹ ${taxAmount.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>TOTAL DUE:</span>
                <span>₹ ${total.toFixed(2)}</span>
            </div>
        </div>

        ${notes ? `<div class="doc-section">
            <div class="section-label">Notes</div>
            <div class="section-content">${notes}</div>
        </div>` : ''}

        <div style="margin-top: 2rem; text-align: center; font-size: 0.85rem; color: #7f8c8d;">
            <p>This is a computer-generated invoice.</p>
            <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
        </div>
    `;

    currentInvoiceData = {
        type: 'Invoice',
        number: invNum,
        clientName: clientName,
        amount: total,
        date: new Date(invDate).toLocaleDateString('en-IN'),
        html: invoiceHTML,
        timestamp: Date.now()
    };

    document.getElementById('invoicePrint').innerHTML = invoiceHTML;
    document.getElementById('invoiceModal').classList.add('show');
    saveToHistory(currentInvoiceData);
}

function generateReceipt() {
    const rcptNum = document.getElementById('rcptNum').value;
    const rcptDate = document.getElementById('rcptDate').value;
    const rcptTime = document.getElementById('rcptTime').value || '00:00';
    const name = document.getElementById('rcptName').value;
    const email = document.getElementById('rcptEmail').value;
    const phone = document.getElementById('rcptPhone').value;
    const amount = parseFloat(document.getElementById('rcptAmount').value);
    const method = document.getElementById('rcptMethod').value;
    const refNo = document.getElementById('rcptRefNo').value;
    const invRef = document.getElementById('rcptInvRef').value;
    const desc = document.getElementById('rcptDesc').value;

    if (!rcptNum || !rcptDate || !name || !amount || !method || !desc) {
        alert('⚠️ Please fill all required fields!');
        return;
    }

    const receiptHTML = `
        <div class="doc-header">
            <div class="company-name">🚚 RATHORE CARGO</div>
            <div class="company-details">
                Professional Cargo Services<br>
                Bikaner, Rajasthan, India<br>
                Phone: +91 8764673455 | Email: info@ratherocargo.com
            </div>
            <div class="doc-title">PAYMENT RECEIPT</div>
        </div>

        <div class="doc-section">
            <div class="section-label">Receipt Information</div>
            <div class="section-content">
                Receipt #: <strong>${rcptNum}</strong><br>
                Date: <strong>${new Date(rcptDate).toLocaleDateString('en-IN')}</strong> at <strong>${rcptTime}</strong><br>
                ${invRef ? `Invoice Ref: <strong>${invRef}</strong><br>` : ''}
            </div>
        </div>

        <div class="doc-section">
            <div class="section-label">Received From</div>
            <div class="section-content">
                <strong>${name}</strong><br>
                ${email ? `Email: ${email}<br>` : ''}
                ${phone ? `Phone: ${phone}<br>` : ''}
            </div>
        </div>

        <div class="doc-section">
            <div class="section-label">Payment Details</div>
            <table class="doc-table">
                <tr>
                    <td style="border: none; padding: 0.8rem 0;"><strong>Description:</strong></td>
                    <td style="border: none; padding: 0.8rem 0;">${desc}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 0.8rem 0;"><strong>Payment Method:</strong></td>
                    <td style="border: none; padding: 0.8rem 0;">${method}</td>
                </tr>
                ${refNo ? `<tr>
                    <td style="border: none; padding: 0.8rem 0;"><strong>Reference No:</strong></td>
                    <td style="border: none; padding: 0.8rem 0;">${refNo}</td>
                </tr>` : ''}
            </table>
        </div>

        <div class="doc-summary">
            <div class="summary-row total">
                <span>AMOUNT RECEIVED:</span>
                <span>₹ ${amount.toFixed(2)}</span>
            </div>
        </div>

        <div class="doc-section">
            <div class="section-label">Confirmation</div>
            <div class="section-content">
                ✓ Payment received and confirmed<br>
                ✓ Amount: ₹ ${amount.toFixed(2)}<br>
                ✓ Method: ${method}<br>
                ✓ Date: ${new Date(rcptDate).toLocaleDateString('en-IN')}
            </div>
        </div>

        <div style="margin-top: 2rem; text-align: center; font-size: 0.85rem; color: #7f8c8d;">
            <p>Thank you for your payment!</p>
            <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
        </div>
    `;

    currentReceiptData = {
        type: 'Receipt',
        number: rcptNum,
        clientName: name,
        amount: amount,
        date: new Date(rcptDate).toLocaleDateString('en-IN'),
        html: receiptHTML,
        timestamp: Date.now()
    };

    document.getElementById('receiptPrint').innerHTML = receiptHTML;
    document.getElementById('receiptModal').classList.add('show');
    saveToHistory(currentReceiptData);
}

function printInvoice() {
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(document.getElementById('invoicePrint').innerHTML);
    printWindow.document.close();
    printWindow.print();
}

function printReceipt() {
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(document.getElementById('receiptPrint').innerHTML);
    printWindow.document.close();
    printWindow.print();
}

function downloadPDF(type) {
    if (type === 'invoice') {
        const content = document.getElementById('invoicePrint').innerText;
        downloadAsFile(content, `Invoice-${currentInvoiceData.number}.txt`);
    } else {
        const content = document.getElementById('receiptPrint').innerText;
        downloadAsFile(content, `Receipt-${currentReceiptData.number}.txt`);
    }
}

function downloadAsFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert('✓ Downloaded: ' + filename);
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.remove('show');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.remove('show');
}

function saveToHistory(data) {
    documentHistory.unshift(data);
    localStorage.setItem('docHistory', JSON.stringify(documentHistory));
    loadHistory();
}

function loadHistory() {
    const saved = localStorage.getItem('docHistory');
    documentHistory = saved ? JSON.parse(saved) : [];
    displayHistory();
}

function displayHistory() {
    const list = document.getElementById('historyList');
    if (documentHistory.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 2rem;">No documents created yet</p>';
        return;
    }
    list.innerHTML = documentHistory.map((doc, idx) => `
        <div class="history-item">
            <div class="history-info">
                <h3>${doc.type}: ${doc.number}</h3>
                <p>Client: ${doc.clientName}</p>
                <p>Amount: ₹ ${doc.amount.toFixed(2)}</p>
                <p>Date: ${doc.date}</p>
            </div>
            <div class="history-actions">
                <button class="btn-primary" onclick="viewDocument(${idx})">View</button>
                <button class="btn-success" onclick="downloadHistory(${idx})">Download</button>
                <button class="btn-danger" onclick="deleteDocument(${idx})">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewDocument(idx) {
    const doc = documentHistory[idx];
    if (doc.type === 'Invoice') {
        document.getElementById('invoicePrint').innerHTML = doc.html;
        document.getElementById('invoiceModal').classList.add('show');
    } else {
        document.getElementById('receiptPrint').innerHTML = doc.html;
        document.getElementById('receiptModal').classList.add('show');
    }
}

function downloadHistory(idx) {
    const doc = documentHistory[idx];
    const content = doc.html.replace(/<[^>]*>/g, '');
    downloadAsFile(content, `${doc.type}-${doc.number}.txt`);
}

function deleteDocument(idx) {
    if (confirm('Delete this document?')) {
        documentHistory.splice(idx, 1);
        localStorage.setItem('docHistory', JSON.stringify(documentHistory));
        displayHistory();
    }
}

function searchHistory() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const items = document.querySelectorAll('.history-item');
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'flex' : 'none';
    });
}

function confirmClearHistory() {
    if (confirm('Clear ALL documents? Cannot be undone!')) {
        documentHistory = [];
        localStorage.removeItem('docHistory');
        displayHistory();
        alert('✓ History cleared');
    }
}