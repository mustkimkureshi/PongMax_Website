document.addEventListener('DOMContentLoaded', function () {
    const addItemForm = document.getElementById('add-item-form');
    const showInventoryBtn = document.getElementById('show-inventory-btn');

    addItemForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        // Create FormData object from the form
        const formData = new FormData(addItemForm);

        // Send the form data using fetch (AJAX)
        fetch('php/add_inventory.php', {
            method: 'POST',
            body: formData
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
    });

    showInventoryBtn.addEventListener('click', function () {
        window.location.href = 'show_inventory.html';
    });

    // Add event listeners for update and delete buttons
    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.inventory-card');
            const itemId = card.getAttribute('data-id');
            alert(`Update item with ID: ${itemId}`);
            // Here you can add code to handle updating the item
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.inventory-card');
            const itemId = card.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this item?')) {
                // Send delete request using fetch (AJAX)
                fetch(`php/delete_inventory.php?id=${itemId}`, {
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

    // Check stock levels and display reminders
    document.querySelectorAll('.inventory-card').forEach(card => {
        const quantity = parseInt(card.querySelector('p:nth-child(3)').textContent.split(': ')[1]);
        const minQuantity = parseInt(card.querySelector('p:nth-child(4)').textContent.split(': ')[1]);

        if (quantity < minQuantity) {
            card.querySelector('.status').classList.add('status-low');
            alert(`Stock for ${card.querySelector('h3').textContent} is below the minimum quantity. Please restock.`);
        }
    });
});