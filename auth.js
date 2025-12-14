// auth.js

// Récupérer user depuis localStorage
const userRaw = localStorage.getItem("currentUser");

// Pages publiques
const publicPages = ["login.html", "signup.html"];
const currentPage = window.location.pathname.split("/").pop();

// Protection des pages
if (!token || !userRaw) {
    if (!publicPages.includes(currentPage)) {
        window.location.href = "login.html";
    }
} else {
    const user = JSON.parse(userRaw);

    // Afficher le @username dans la topbar
    const topbarUsername = document.getElementById("topbar-username");
    if (topbarUsername && user?.username) {
        topbarUsername.textContent = "@" + user.username;
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }
}
