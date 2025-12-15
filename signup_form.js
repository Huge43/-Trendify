const form = document.getElementById('signupForm');
const fullnameInput = document.getElementById('fullname');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const error_message = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearErrors();

    const errors = validateSignupForm(
        fullnameInput,
        usernameInput,
        emailInput,
        passwordInput,
        password2Input
    );

    if (errors.length > 0) {
        error_message.innerText = errors.join(' ');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullname: fullnameInput.value.trim(),
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            })
        });

        const data = await res.json();

        if (!res.ok) {
            error_message.innerText = data.message || "Erreur lors de l'inscription.";
            return;
        }

        // TOKEN CENTRALISÉ
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Redirection
        window.location.href = "index.html";

    } catch (err) {
        console.error(err);
        error_message.innerText = "Erreur serveur. Réessaie plus tard.";
    }
});

function validateSignupForm(fullname, username, email, password, password2) {
    let errors = [];

    const fullnameValue = fullname.value.trim();
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if (!fullnameValue) {
        errors.push("Vous devez entrer votre nom complet.");
        markIncorrect(fullname);
    }

    if (!usernameValue) {
        errors.push("Vous devez entrer un nom d'utilisateur.");
        markIncorrect(username);
    }

    if (!emailValue) {
        errors.push("Vous devez entrer une adresse e-mail.");
        markIncorrect(email);
    }

    if (emailValue && !emailValue.includes('@')) {
        errors.push("L’adresse e-mail doit contenir '@'.");
        markIncorrect(email);
    }

    if (!passwordValue) {
        errors.push("Vous devez entrer un mot de passe.");
        markIncorrect(password);
    }

    if (passwordValue.length < 8) {
        errors.push("Le mot de passe doit avoir au moins 8 caractères.");
        markIncorrect(password);
    }

    if (!/\d/.test(passwordValue)) {
        errors.push("Le mot de passe doit contenir au moins un chiffre.");
        markIncorrect(password);
    }

    if (!password2Value) {
        errors.push("Vous devez confirmer le mot de passe.");
        markIncorrect(password2);
    }

    if (passwordValue !== password2Value) {
        errors.push("Les mots de passe ne sont pas identiques.");
        markIncorrect(password);
        markIncorrect(password2);
    }

    return errors;
}

function markIncorrect(input) {
    input.parentElement.classList.add('incorrect');
}

const allInputs = [fullnameInput, usernameInput, emailInput, passwordInput, password2Input];

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        input.parentElement.classList.remove('incorrect');
        error_message.innerText = '';
    });
});

function clearErrors() {
    document.querySelectorAll('.incorrect').forEach(el => el.classList.remove('incorrect'));
    error_message.innerText = '';
}

if (!res.ok) {
    alert(result.message || "Erreur création compte");
    return;
}

// 🔐 STOCKER LE TOKEN
localStorage.setItem("token", result.token);
localStorage.setItem("user", JSON.stringify(result.user));

// 🔁 REDIRECTION
window.location.href = "index.html";
