document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Retrieve form input values
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const loginErrorMessage = document.getElementById("loginErrorMessage");

    // Check if loginErrorMessage exists to avoid errors
    if (loginErrorMessage) {
        // Hide any previous error message
        loginErrorMessage.classList.add("hidden");
        loginErrorMessage.innerText = "";
    }

    try {
        // Send POST request to the login API endpoint
        const response = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password
        });

        // If login is successful, handle the response (e.g., token storage)
        console.log("Login successful:", response.data);

        // You might want to store the token for authenticated requests
        localStorage.setItem("authToken", response.data.token);

        // Redirect to index.html or any other page after login
        window.location.href = "./index.html";  // Adjust the path if necessary

    } catch (error) {
        // Show error message if login fails and loginErrorMessage exists
        if (loginErrorMessage) {
            loginErrorMessage.innerText =  "Invalid email or password.";
            loginErrorMessage.classList.remove("hidden");  // Display the error message
        }
        console.error("Login error:", error.response?.data || error.message);
    }
});
