const form = document.getElementById('signupForm');
const fullnameInput = document.getElementById('fullname');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const password2Input = document.getElementById('password2');
const error_message = document.getElementById('error-message');

// Soumission du formulaire
form.addEventListener('submit', (e) => {
    clearErrors();

    const errors = validateSignupForm(
        fullnameInput,
        usernameInput,
        emailInput,
        passwordInput,
        password2Input
    );

    // S'il y a des erreurs → on bloque l'envoi
    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(' ');
    } 
    else {
        //redirection
        window.location.href = "index.html";
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

    if (fullnameValue === "") {
        errors.push("Vous devez entrer votre nom complet.");
        markIncorrect(fullname);
    }

    if (usernameValue === "") {
        errors.push(" Vous devez entrer un nom d'utilisateur.");
        markIncorrect(username);
    }

    if (emailValue === "") {
        errors.push(" Vous devez entrer une adresse e-mail.");
        markIncorrect(email);
    }

    if (emailValue !== "" && !emailValue.includes('@')) {
        errors.push(" L’adresse e-mail doit contenir '@'.");
        markIncorrect(email);
    }

    if (passwordValue === "") {
        errors.push(" Vous devez entrer un mot de passe.");
        markIncorrect(password);
    }

    if (passwordValue !== "" && passwordValue.length < 8) {
        errors.push(" Le mot de passe doit avoir au moins 8 caractères.");
        markIncorrect(password);
    }

    if (passwordValue !== "" && !/\d/.test(passwordValue)) {
        errors.push(" Le mot de passe doit contenir au moins un chiffre.");
        markIncorrect(password);
    }

    if (password2Value === "") {
        errors.push(" Vous devez confirmer le mot de passe.");
        markIncorrect(password2);
    }

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
