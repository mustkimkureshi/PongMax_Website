// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Signup Form Handling
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            // Create FormData object from the form
            const formData = new FormData(signupForm);

            // Send the form data using fetch (AJAX)
            fetch('php/signup.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json()) // Parse JSON response
                .then(data => {
                    if (data.status === 'success') {
                        alert(data.message);
                        localStorage.setItem("username", data.username); // 🔐 Store for use in profile
                        window.location.href = data.redirect_url;
                    } else if (data.status === 'error' && data.message === 'Username or Email already exists') {
                        // Show error message
                        alert(data.message);

                        // Clear the form
                        signupForm.reset();
                    } else {
                        // Handle other error cases
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Something went wrong, please try again.');
                });
        });
    }

    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(loginForm);

            fetch('php/login.php', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(data.message);
                        localStorage.setItem("username", data.username); // 🔐 Store for use in profile
                        window.location.href = data.redirect_url;
                    }else {
                        alert(data.message);
                        loginForm.reset();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                });
        });
    }

        // Forgot Password Form Handling
        const forgotForm = document.getElementById('forgot-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', function (event) {
                event.preventDefault(); // Prevent default form submission
    
                const formData = new FormData(forgotForm);
    
                fetch('php/forgot.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            alert(data.message);
                            window.location.href = data.redirect_url; // Redirect to dashboard2.html
                        } else {
                            alert(data.message);
                            forgotForm.reset();
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again.');
                    });
            });
        }
    
 
});
