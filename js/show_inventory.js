document.addEventListener('DOMContentLoaded', function () {
    const inventoryGrid = document.getElementById('inventory-grid');

    // Fetch inventory data from the server
    fetch('php/get_inventory.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                data.inventory.forEach(item => {
                    const inventoryCard = document.createElement('div');
                    inventoryCard.classList.add('inventory-card');
                    inventoryCard.setAttribute('data-name', item.item_name);

                    inventoryCard.innerHTML = `
                        <img src="${item.item_image}" alt="${item.item_name}" class="item-image">
                        <h3>${item.item_name}</h3>
                        <p>Category: ${item.category}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p class="${item.quantity < item.min_quantity ? 'status-low' : 'status-good'}">Status: ${item.quantity < item.min_quantity ? 'Low Stock' : 'In Stock'}</p>
                        <button class="delete-btn">Delete</button>
                    `;

                    inventoryGrid.appendChild(inventoryCard);
                });

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const card = this.closest('.inventory-card');
                        const itemName = card.getAttribute('data-name');
                        if (confirm('Are you sure you want to delete this item?')) {
                            // Send delete request using fetch (AJAX)
                            fetch(`php/delete_inventory.php?itemName=${encodeURIComponent(itemName)}`, {
                                method: 'DELETE'
                            })
                                .then(response => response.text()) // Get response as text
                                .then(text => {
                                    try {
                                        const data = JSON.parse(text); // Parse JSON response
                                        if (data.status === 'success') {
                                            // Display the success message and reload the page
                                            alert(data.message);
                                            window.location.reload();
                                        } else {
                                            // Handle error cases
                                            alert(data.message);
                                        }
                                    } catch (error) {
                                        console.error('Error parsing JSON:', error);
                                        console.error('Response text:', text);
                                        alert('Something went wrong, please try again.');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    alert('Something went wrong, please try again.');
                                });
                        }
                    });
                });
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong, please try again.');
        });
});