let invoiceHistory = JSON.parse(localStorage.getItem('invoiceHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const shippingDateInput = document.getElementById('shippingDate');
    const paymentDateInput = document.getElementById('paymentDate');
    
    if (shippingDateInput) shippingDateInput.value = today;
    if (paymentDateInput) paymentDateInput.value = today;
    
    loadHistory();
});

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function generateInvoice() {
    const clientName = document.getElementById('clientName').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const clientPhone = document.getElementById('clientPhone').value.trim();
    const clientAddress = document.getElementById('clientAddress').value.trim();
    const fromLocation = document.getElementById('fromLocation').value.trim();
    const toLocation = document.getElementById('toLocation').value.trim();
    const serviceType = document.getElementById('serviceType').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value);
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const shippingDate = document.getElementById('shippingDate').value;
    const unitPrice = parseFloat(document.getElementById('unitPrice').value);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const tax = parseFloat(document.getElementById('tax').value) || 0;
    const notes = document.getElementById('notes').value.trim();

    if (!clientName || !clientEmail || !clientPhone || !clientAddress || 
        !fromLocation || !toLocation || !serviceType || !quantity || !unitPrice || !shippingDate) {
        alert('⚠️ Please fill in all required fields!');
        return;
    }

    const subtotal = unitPrice * quantity;
    const discountAmount = (subtotal * discount) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalAfterDiscount * tax) / 100;
    const total = subtotalAfterDiscount + taxAmount;

    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + String(invoiceHistory.length + 1001).slice(-4);

    const invoiceContent = `
        <div class="invoice-header">
            <div class="company-name">🚚 RATHORE CARGO</div>
            <div class="company-details">
                Professional Cargo & Logistics Services<br>
                Bikaner, Rajasthan, India<br>
                Phone: +91 8764673455 | Email: info@ratherocargo.com<br>
                GST: 18AAFCU1234H1Z5
            </div>
            <div class="invoice-title">COMMERCIAL INVOICE</div>
        </div>

        <div class="invoice-section">
            <div class="section-label">Invoice Details</div>
            <div class="section-content">
                Invoice #: <strong>${invoiceNumber}</strong><br>
                Date: <strong>${new Date(shippingDate).toLocaleDateString('en-IN')}</strong><br>
                Due Date: <strong>${new Date(new Date(shippingDate).getTime() + 30*24*60*60*1000).toLocaleDateString('en-IN')}</strong>
            </div>
        </div>

        <div class="invoice-section">
            <div class="section-label">Bill To</div>
            <div class="section-content">
                <strong>${clientName}</strong><br>
                ${clientAddress}<br>
                Email: ${clientEmail}<br>
                Phone: ${clientPhone}
            </div>
        </div>

        <div class="invoice-section">
            <div class="section-label">Shipment Details</div>
            <div class="section-content">
                From: <strong>${fromLocation}</strong><br>
                To: <strong>${toLocation}</strong><br>
                Service: <strong>${serviceType}</strong><br>
                Weight: <strong>${weight} kg</strong>
            </div>
        </div>

        <div class="invoice-section">
            <div class="section-label">Item Details</div>
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align: right;">Qty</th>
                        <th style="text-align: right;">Unit Price (₹)</th>
                        <th style="text-align: right;">Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${serviceType}</td>
                        <td style="text-align: right;">${quantity}</td>
                        <td style="text-align: right;">₹ ${unitPrice.toFixed(2)}</td>
                        <td style="text-align: right;">₹ ${subtotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="invoice-section">
            <div class="section-label">Summary</div>
            <table class="summary-table">
                <tr>
                    <td>Subtotal:</td>
                    <td>₹ ${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Discount (${discount}%):</td>
                    <td>- ₹ ${discountAmount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Subtotal After Discount:</td>
                    <td>₹ ${subtotalAfterDiscount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Tax (${tax}%):</td>
                    <td>+ ₹ ${taxAmount.toFixed(2)}</td>
                </tr>
                <tr class="total">
                    <td>TOTAL AMOUNT DUE:</td>
                    <td>₹ ${total.toFixed(2)}</td>
                </tr>
            </table>
        </div>

        ${notes ? `<div class="invoice-section">
            <div class="section-label">Notes</div>
            <div class="section-content">${notes}</div>
        </div>` : ''}

        <div class="invoice-section">
            <div class="section-label">Payment Terms & Conditions</div>
            <div class="section-content">
                • Payment due within 30 days of invoice date<br>
                • Late payment will incur 2% monthly interest<br>
                • Please quote invoice number with payment<br>
                • Bank details will be provided separately<br>
                • GST at 18% is applicable on all services
            </div>
        </div>

        <div style="margin-top: 3rem; border-top: 1px solid #999; padding-top: 1rem; text-align: center; font-size: 0.9rem; color: #666;">
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p>Invoice Generated on ${new Date().toLocaleString('en-IN')}</p>
        </div>
    `;

    document.getElementById('invoiceContent').innerHTML = invoiceContent;
    document.getElementById('invoicePreview').style.display = 'block';

    const invoiceData = {
        id: invoiceNumber,
        type: 'Invoice',
        clientName: clientName,
        amount: total,
        date: new Date().toLocaleDateString('en-IN'),
        timestamp: new Date().getTime(),
        html: invoiceContent
    };
    invoiceHistory.push(invoiceData);
    localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
    loadHistory();
}

function printInvoice() {
    window.print();
}

function downloadInvoicePDF() {
    const invoiceHTML = document.getElementById('invoiceContent').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body { font-family: 'Courier New', monospace; margin: 20px; line-height: 1.8; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th { background: #1e3c72; color: white; padding: 8px; text-align: left; }
                td { padding: 8px; border-bottom: 1px solid #bdc3c7; }
            </style>
        </head>
        <body>
            ${invoiceHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
}

function emailInvoice() {
    const clientEmail = document.getElementById('clientEmail').value;
    window.open(`https://wa.me/918764673455?text=Invoice%20sent%20to%20${clientEmail}`, '_blank');
    alert(`📧 Invoice will be sent to ${clientEmail}`);
}

function hideInvoicePreview() {
    document.getElementById('invoicePreview').style.display = 'none';
}

function clearInvoiceForm() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientAddress').value = '';
    document.getElementById('fromLocation').value = '';
    document.getElementById('toLocation').value = '';
    document.getElementById('serviceType').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('unitPrice').value = '';
    document.getElementById('discount').value = '0';
    document.getElementById('tax').value = '18';
    document.getElementById('notes').value = '';
    document.getElementById('invoicePreview').style.display = 'none';
}

function generateReceipt() {
    const receiptNumber = document.getElementById('receiptNumber').value.trim();
    const clientName = document.getElementById('rclientName').value.trim();
    const amountPaid = parseFloat(document.getElementById('amountPaid').value);
    const paymentMethod = document.getElementById('paymentMethod').value.trim();
    const paymentDate = document.getElementById('paymentDate').value;
    const invoiceReference = document.getElementById('invoiceReference').value.trim();
    const description = document.getElementById('receiptDescription').value.trim();
    const remarks = document.getElementById('receiptRemarks').value.trim();

    if (!receiptNumber || !clientName || !amountPaid || !paymentMethod || !paymentDate || !description) {
        alert('⚠️ Please fill in all required fields!');
        return;
    }

    const receiptContent = `
        <div class="receipt-header">
            <div class="company-name">🚚 RATHORE CARGO</div>
            <div class="company-details">
                Professional Cargo & Logistics Services<br>
                Bikaner, Rajasthan, India<br>
                Phone: +91 8764673455 | Email: info@ratherocargo.com
            </div>
            <div class="receipt-title">PAYMENT RECEIPT</div>
        </div>

        <div class="invoice-section">
            <div class="section-label">Receipt Details</div>
            <div class="section-content">
                Receipt #: <strong>${receiptNumber}</strong><br>
                Date: <strong>${new Date(paymentDate).toLocaleDateString('en-IN')}</strong><br>
                Time: <strong>${new Date().toLocaleTimeString('en-IN')}</strong>
            </div>
        </div>

        <div class="invoice-section">
            <div class="section-label">Payer Information</div>
            <div class="section-content">
                Name: <strong>${clientName}</strong><br>
                ${invoiceReference ? `Invoice Ref: <strong>${invoiceReference}</strong><br>` : ''}
            </div>
        </div>

        <div class="invoice-section">
            <div class="section-label">Payment Details</div>
            <table class="summary-table">
                <tr><td>Description:</td><td>${description}</td></tr>
                <tr><td>Payment Method:</td><td><strong>${paymentMethod}</strong></td></tr>
                <tr class="total"><td>Amount Received:</td><td>₹ ${amountPaid.toFixed(2)}</td></tr>
            </table>
        </div>

        ${remarks ? `<div class="invoice-section"><div class="section-label">Remarks</div><div class="section-content">${remarks}</div></div>` : ''}

        <div style="margin-top: 3rem; text-align: center; font-size: 0.9rem;">
            <p>✓ Payment Received and Confirmed</p>
            <p>Thank you for your payment!</p>
        </div>
    `;

    document.getElementById('receiptContent').innerHTML = receiptContent;
    document.getElementById('receiptPreview').style.display = 'block';

    const receiptData = {
        id: receiptNumber,
        type: 'Receipt',
        clientName: clientName,
        amount: amountPaid,
        date: new Date().toLocaleDateString('en-IN'),
        timestamp: new Date().getTime(),
        html: receiptContent
    };
    invoiceHistory.push(receiptData);
    localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
    loadHistory();
}

function printReceipt() {
    window.print();
}

function downloadReceiptPDF() {
    const receiptHTML = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body { font-family: 'Courier New', monospace; margin: 20px; line-height: 1.8; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th { background: #1e3c72; color: white; padding: 8px; }
                td { padding: 8px; border-bottom: 1px solid #bdc3c7; }
            </style>
        </head>
        <body>
            ${receiptHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
}

function hideReceiptPreview() {
    document.getElementById('receiptPreview').style.display = 'none';
}

function clearReceiptForm() {
    document.getElementById('receiptNumber').value = '';
    document.getElementById('rclientName').value = '';
    document.getElementById('amountPaid').value = '';
    document.getElementById('paymentMethod').value = '';
    document.getElementById('invoiceReference').value = '';
    document.getElementById('receiptDescription').value = '';
    document.getElementById('receiptRemarks').value = '';
    document.getElementById('receiptPreview').style.display = 'none';
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    if (invoiceHistory.length === 0) {
        historyList.innerHTML = '<p>No invoices or receipts created yet.</p>';
        return;
    }
    const sorted = invoiceHistory.slice().reverse();
    historyList.innerHTML = sorted.map((item, index) => `
        <div class="history-item">
            <div class="history-details">
                <h3>${item.type}: ${item.id}</h3>
                <p>Client: ${item.clientName}</p>
                <p>Amount: ₹ ${item.amount.toFixed(2)}</p>
                <p>Date: ${item.date}</p>
            </div>
            <div class="history-actions">
                <button class="history-btn" style="background: #3498db; color: white;" onclick="viewHistoryItem(${invoiceHistory.length - index - 1})">View</button>
                <button class="history-btn" style="background: #27ae60; color: white;" onclick="downloadHistoryItem(${invoiceHistory.length - index - 1})">Download</button>
                <button class="history-btn" style="background: #e74c3c; color: white;" onclick="deleteHistoryItem(${invoiceHistory.length - index - 1})">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewHistoryItem(index) {
    const item = invoiceHistory[index];
    if (item.type === 'Invoice') {
        document.getElementById('invoiceContent').innerHTML = item.html;
        document.getElementById('invoicePreview').style.display = 'block';
    } else {
        document.getElementById('receiptContent').innerHTML = item.html;
        document.getElementById('receiptPreview').style.display = 'block';
    }
}

function deleteHistoryItem(index) {
    if (confirm('⚠️ Delete this record?')) {
        invoiceHistory.splice(index, 1);
        localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
        loadHistory();
    }
}

function downloadHistoryItem(index) {
    const item = invoiceHistory[index];
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`<!DOCTYPE html><html><head><style>body { font-family: 'Courier New'; margin: 20px; }</style></head><body>${item.html}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
}

function clearHistory() {
    if (confirm('⚠️ Clear ALL records? Cannot be undone!')) {
        invoiceHistory = [];
        localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
        loadHistory();
        alert('✓ All history cleared!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('searchHistory');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.history-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }
});