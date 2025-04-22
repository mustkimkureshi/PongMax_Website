document.addEventListener('DOMContentLoaded', function () {
    const reviewForm = document.getElementById('review-form');

    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        // Create FormData object from the form
        const formData = new FormData(reviewForm);

        // Send the form data using fetch (AJAX)
        fetch('php/submit_review.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json()) // Parse JSON response
            .then(data => {
                if (data.status === 'success') {
                    // Display the success message and clear the form
                    alert(data.message);
                    reviewForm.reset();
                } else {
                    // Handle error cases
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Something went wrong, please try again.');
            });
    });
});