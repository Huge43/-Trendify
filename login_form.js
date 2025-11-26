const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");
const loginErrorMsg = document.getElementById("login-error-message");

// Soumission du formulaire
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // on bloque le submit HTML

    clearLoginErrors();

    const errors = validateLoginForm(loginEmail, loginPassword);

    if (errors.length > 0) {
        loginErrorMsg.innerText = errors.join(" ");
    } else {
        // ✅ Tout est bon -> redirection vers l'accueil
        window.location.href = "index.html"; // adapte le chemin si besoin
    }
});

// Validation Login
function validateLoginForm(emailInput, passwordInput) {
    let errors = [];

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Email vide
    if (email === "") {
        errors.push("Vous devez entrer votre email.");
        markLoginIncorrect(emailInput);
    }

    // Email doit contenir @
    if (email !== "" && !email.includes("@")) {
        errors.push(" L'adresse e-mail doit contenir '@'.");
        markLoginIncorrect(emailInput);
    }

    // Password vide
    if (password === "") {
        errors.push(" Vous devez entrer un mot de passe.");
        markLoginIncorrect(passwordInput);
    }

    // Password < 8 caractères
    if (password !== "" && password.length < 8) {
        errors.push(" Le mot de passe doit avoir au moins 8 caractères.");
        markLoginIncorrect(passwordInput);
    }

    // Password doit contenir au moins un chiffre
    if (password !== "" && !/\d/.test(password)) {
        errors.push(" Le mot de passe doit contenir au moins un chiffre.");
        markLoginIncorrect(passwordInput);
    }

    return errors;
}

function markLoginIncorrect(input) {
    // .field-input est le parent direct de l'input
    input.parentElement.classList.add("incorrect");
}

// Efface les erreurs quand on retape
[loginEmail, loginPassword].forEach((input) => {
    input.addEventListener("input", () => {
        input.parentElement.classList.remove("incorrect");
        loginErrorMsg.innerText = "";
    });
});

// Nettoyage global
function clearLoginErrors() {
    document.querySelectorAll(".incorrect").forEach((el) => {
        el.classList.remove("incorrect");
    });
    loginErrorMsg.innerText = "";
}
