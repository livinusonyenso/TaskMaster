
document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("registerUsername")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPassword")?.value.trim();
    const confirmPassword = document.getElementById("confirmPassword")?.value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    // Reset error and success messages
    errorMessage.classList.add("hidden");
    successMessage.classList.add("hidden");
    errorMessage.innerText = "";

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        errorMessage.innerText = "Please fill in all fields.";
        errorMessage.classList.remove("hidden");
        console.log("Validation failed: All fields are required.");
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.innerText = "Passwords do not match.";
        errorMessage.classList.remove("hidden");
        console.log("Validation failed: Passwords do not match.");
        return;
    }

    // Prepare user data for API request
    const userData = { username, email, password };

    try {
        // Make an Axios POST request
        const response = await axios.post("https://taskmaster-wg6g.onrender.com/api/auth/register", userData);
        console.log("Response from API:", response.data);

        // Display success message if the request was successful
        successMessage.classList.remove("hidden");
        successMessage.innerText = "Registration successful! Redirecting to login page...";

        // Clear input fields
        document.getElementById("registerUsername").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";
        document.getElementById("confirmPassword").value = "";

        // Redirect to login page after 3 seconds
        setTimeout(() => {
            window.location.href = "./Login.html";
        }, 1000);

    } catch (error) {
        // Handle errors from the API request
        console.error("Error from API:", error.response?.data || error.message);
        errorMessage.innerText = error.response?.data?.message || "Error registering user. Please try again.";
        errorMessage.classList.remove("hidden");
    }
});
