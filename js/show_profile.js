document.addEventListener("DOMContentLoaded", function () {
    const storedUsername = localStorage.getItem("username");
    const profileBox = document.getElementById("profileBox");
    const userActions = document.getElementById("user-actions");

    if (storedUsername) {
        fetch(`php/get_profile.php?username=${storedUsername}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById("username").textContent = "Username: " + data.user.username;
                    document.getElementById("email").textContent = "Email: " + data.user.email;

                    profileBox.style.display = "flex"; // show profile
                    userActions.style.display = "none"; // hide login/signup
                } else {
                    profileBox.innerHTML = data.message;
                    profileBox.style.display = "block";
                    userActions.style.display = "none";
                }
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
                profileBox.innerHTML = "Error loading profile.";
                profileBox.style.display = "block";
                userActions.style.display = "none";
            });

        // Logout
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("username");
                window.location.href = "login.html";
            });
        }

    } else {
        profileBox.style.display = "none"; // hide profile
        userActions.style.display = "flex"; // show login/signup
    }
});
