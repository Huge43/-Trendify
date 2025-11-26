const form = document.getElementById('signupForm');
const fullnameInput = document.getElementById('fullname');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const error_message = document.getElementById('error-message');

// Soumission du formulaire
form.addEventListener('submit', (e) => {
    // On bloque TOUJOURS le submit HTML
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
    } else {
        // ✅ AUCUNE ERREUR → REDIRECTION
        window.location.href = "index.html"; // adapte le chemin si besoin
    }
});

// Validation
function validateSignupForm(fullname, username, email, password, password2) {
    let errors = [];

    const fullnameValue = fullname.value.trim();
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    // NOM COMPLET
    if (fullnameValue === "") {
        errors.push("Vous devez entrer votre nom complet.");
        markIncorrect(fullname);
    }

    // USERNAME
    if (usernameValue === "") {
        errors.push(" Vous devez entrer un nom d'utilisateur.");
        markIncorrect(username);
    }

    // EMAIL OBLIGATOIRE
    if (emailValue === "") {
        errors.push(" Vous devez entrer une adresse e-mail.");
        markIncorrect(email);
    }

    // EMAIL DOIT CONTENIR @
    if (emailValue !== "" && !emailValue.includes('@')) {
        errors.push(" L’adresse e-mail doit contenir '@'.");
        markIncorrect(email);
    }

    // MOT DE PASSE OBLIGATOIRE
    if (passwordValue === "") {
        errors.push(" Vous devez entrer un mot de passe.");
        markIncorrect(password);
    }

    // MOT DE PASSE LONGUEUR MINIMUM
    if (passwordValue !== "" && passwordValue.length < 8) {
        errors.push(" Le mot de passe doit avoir au moins 8 caractères.");
        markIncorrect(password);
    }

    // MOT DE PASSE DOIT CONTENIR AU MOINS UN CHIFFRE
    if (passwordValue !== "" && !/\d/.test(passwordValue)) {
        errors.push(" Le mot de passe doit contenir au moins un chiffre.");
        markIncorrect(password);
    }

    // CONFIRMATION
    if (password2Value === "") {
        errors.push(" Vous devez confirmer le mot de passe.");
        markIncorrect(password2);
    }

    // MOTS DE PASSE IDENTIQUES
    if (passwordValue !== "" && password2Value !== "" && passwordValue !== password2Value) {
        errors.push(" Les mots de passe ne sont pas identiques.");
        markIncorrect(password);
        markIncorrect(password2);
    }

    return errors;
}

function markIncorrect(input) {
    input.parentElement.classList.add('incorrect');
}

// enlever les erreurs quand l'utilisateur retape
const allInputs = [fullnameInput, usernameInput, emailInput, passwordInput, password2Input];

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
        error_message.innerText = '';
    });
});

// Nettoyer les erreurs
function clearErrors() {
    document.querySelectorAll('.incorrect').forEach(el => {
        el.classList.remove('incorrect');
    });
    error_message.innerText = '';
}
