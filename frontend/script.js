// =============================
// AI CA Assistant Authentication
// =============================

const API_BASE_URL = "http://127.0.0.1:8000";

// Show Signup
function showSignup() {
  document.getElementById("loginCard").classList.add("hidden");
  document.getElementById("signupCard").classList.remove("hidden");
}

// Show Login
function showLogin() {
  document.getElementById("signupCard").classList.add("hidden");
  document.getElementById("loginCard").classList.remove("hidden");
}

// Open Forgot Password
function openForgotPassword() {
  document.getElementById("forgotModal").classList.remove("hidden");
}

// Close Forgot Password
function closeForgotPassword() {
  document.getElementById("forgotModal").classList.add("hidden");
}

// =============================
// LOGIN
// =============================

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  try {
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Login failed.");
      return;
    }

    localStorage.setItem("token", data.access_token);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the server.");
  }
}

// =============================
// SIGNUP
// =============================

async function signup() {
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirm = document.getElementById("confirmPassword").value.trim();

  if (!name || !email || !username || !password) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name: name,
        email,
        username,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Signup failed.");
      return;
    }

    alert("Account created successfully! Please log in.");
    showLogin();
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the server.");
  }
}

// =============================
// RESET PASSWORD
// =============================

function resetPassword() {

  const email = document.getElementById("resetEmail").value.trim();

  if (email === "") {

    alert("Enter your email.");

    return;

  }

  alert("Password reset link sent to\n" + email);

  closeForgotPassword();

}

// =============================
// ENTER KEY SUPPORT
// =============================

document.addEventListener("keydown", function (e) {

  if (e.key === "Enter") {

    if (!document.getElementById("loginCard").classList.contains("hidden")) {

      login();

    }

  }

});

// =============================
// Close Modal when clicking outside
// =============================

window.onclick = function (e) {

  const modal = document.getElementById("forgotModal");

  if (e.target === modal) {

    closeForgotPassword();

  }

}