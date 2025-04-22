document.addEventListener('DOMContentLoaded', function () {
    const orderTableBody = document.getElementById('order-table').querySelector('tbody');
    const totalAmountElement = document.getElementById('total-amount');
    const orderForm = document.getElementById('order-form');
    let order = [];

    // Add event listeners to "Add to Order" buttons
    document.querySelectorAll('.add-to-order').forEach(button => {
        button.addEventListener('click', function () {
            const itemElement = this.closest('.item');
            const itemName = itemElement.getAttribute('data-name');
            const itemOptions = itemElement.querySelector('.item-options');
            const selectedOption = itemOptions.value;
            const itemPrice = JSON.parse(itemElement.getAttribute('data-price'))[selectedOption];

            // Check if item is already in the order
            const existingItem = order.find(item => item.name === itemName && item.option === selectedOption);
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.total = existingItem.quantity * existingItem.price;
            } else {
                order.push({
                    name: itemName,
                    option: selectedOption,
                    price: itemPrice,
                    quantity: 1,
                    total: itemPrice
                });
            }

            updateOrderTable();
        });
    });

    // Update the order table
    function updateOrderTable() {
        orderTableBody.innerHTML = '';
        let totalAmount = 0;

        order.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.option}</td>
                <td>${item.price}</td>
                <td><input type="number" value="${item.quantity}" min="1" class="quantity"></td>
                <td class="total">${item.total}</td>
                <td><button class="remove-item">Remove</button></td>
            `;
            orderTableBody.appendChild(row);

            totalAmount += item.total;

            // Add event listener to quantity input
            row.querySelector('.quantity').addEventListener('change', function () {
                const newQuantity = this.value;
                item.quantity = newQuantity;
                item.total = item.price * newQuantity;
                row.querySelector('.total').textContent = item.total;
                updateTotalAmount();
            });

            // Add event listener to remove button
            row.querySelector('.remove-item').addEventListener('click', function () {
                order = order.filter(orderItem => orderItem !== item);
                updateOrderTable();
            });
        });

        updateTotalAmount();
    }

    // Update the total amount
    function updateTotalAmount() {
        let totalAmount = 0;
        order.forEach(item => {
            totalAmount += item.total;
        });
        totalAmountElement.textContent = totalAmount;
    }

    // Handle form submission
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const orderItems = order.map(item => ({
            name: item.name,
            option: item.option,
            price: item.price,
            quantity: item.quantity,
            total: item.total
        }));

        const totalAmount = totalAmountElement.textContent;

        // Save order data to localStorage
        localStorage.setItem('orderData', JSON.stringify({ customerName, orderItems, totalAmount }));

        // Send order data to the server (e.g., using fetch or XMLHttpRequest)
        fetch('php/submit_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerName, orderItems, totalAmount })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Order placed successfully!');
            } else {
                alert('Failed to place order: ' + data.message);
            }

            // Reset the form and order
            order = [];
            updateOrderTable();
            orderForm.reset();
            totalAmountElement.textContent = '0';
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    });
});