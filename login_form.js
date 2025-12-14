const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");
const loginErrorMsg = document.getElementById("login-error-message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearLoginErrors();

    const errors = validateLoginForm(loginEmail, loginPassword);

    if (errors.length > 0) {
        loginErrorMsg.innerText = errors.join(" ");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailOrUsername: loginEmail.value.trim(),
                password: loginPassword.value.trim()
            })
        });

        const data = await res.json();

        if (!res.ok) {
            loginErrorMsg.innerText = data.message || "Erreur de connexion.";
            markLoginIncorrect(loginEmail);
            markLoginIncorrect(loginPassword);
            return;
        }

        // STOCKAGE
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Redirection
        window.location.href = "index.html";

    } catch (err) {
        console.error(err);
        loginErrorMsg.innerText = "Erreur serveur. Réessaie plus tard.";
    }
});

// Validation LOGIN (email OU username)
function validateLoginForm(emailInput, passwordInput) {
    let errors = [];

    const loginValue = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (loginValue === "") {
        errors.push("Vous devez entrer votre email ou votre nom d'utilisateur.");
        markLoginIncorrect(emailInput);
    }

    if (password === "") {
        errors.push("Vous devez entrer un mot de passe.");
        markLoginIncorrect(passwordInput);
    }

    return errors;
}

function markLoginIncorrect(input) {
    input.parentElement.classList.add("incorrect");
}

[loginEmail, loginPassword].forEach((input) => {
    input.addEventListener("input", () => {
        input.parentElement.classList.remove("incorrect");
        loginErrorMsg.innerText = "";
    });
});

function clearLoginErrors() {
    document.querySelectorAll(".incorrect").forEach((el) => {
        el.classList.remove("incorrect");
    });
    loginErrorMsg.innerText = "";
}
