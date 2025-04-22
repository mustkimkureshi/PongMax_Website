document.addEventListener('DOMContentLoaded', function () {
    const billingForm = document.getElementById('billing-form');
    const customerNameInput = document.getElementById('customer-name');
    const orderItemsTextarea = document.getElementById('order-items');
    const totalAmountInput = document.getElementById('total-amount');
    const transactionsList = document.getElementById('transactions-list');

    // Load order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('orderData'));
    if (orderData) {
        customerNameInput.value = orderData.customerName;
        orderItemsTextarea.value = orderData.orderItems.map(item => `${item.name} (${item.option}) - ${item.quantity} x ${item.price} = ${item.total}`).join('\n');
        totalAmountInput.value = orderData.totalAmount;
    }

    // Handle form submission
    billingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const customerName = customerNameInput.value;
        const orderItems = orderData.orderItems;
        const totalAmount = totalAmountInput.value;

        // Send billing data to the server (e.g., using fetch or XMLHttpRequest)
        fetch('php/generate_invoice.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerName, orderItems, totalAmount })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Invoice generated successfully!');
            
                // Show invoice preview
                document.getElementById('preview-customer').textContent = customerName;
                document.getElementById('preview-total').textContent = totalAmount;
            
                const itemList = document.getElementById('preview-items');
                itemList.innerHTML = '';
                orderItems.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.name} (${item.option}) - ${item.quantity} x ${item.price} = ${item.total}`;
                    itemList.appendChild(li);
                });
            
                document.getElementById('invoice-preview').style.display = 'block';
            } else {
                alert('Failed to generate invoice: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    });

    // Handle show previous transactions
    document.getElementById('show-transactions').addEventListener('click', function () {
        fetch('php/get_transactions.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                transactionsList.innerHTML = data.transactions.map(transaction => `
                    <div class="transaction">
                        <p>Customer: ${transaction.customerName}</p>
                        <p>Items: ${transaction.orderItems.join(', ')}</p>
                        <p>Total Amount: ${transaction.totalAmount}</p>
                        <p>Date: ${transaction.date}</p>
                    </div>
                `).join('');
            } else {
                alert('Failed to load transactions: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    });
});