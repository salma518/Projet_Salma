// Afficher le formulaire
function showClientForm() {
    document.getElementById('clientForm').style.display = 'block';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';

}

function showRegistrationForm() {
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('clientForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';

}

function showAdminForm() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('clientForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';

}
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block'; 
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('clientForm').style.display = 'none';
}

//Connexion

function validateClientCredentials() {
    const email = document.getElementById('clientEmail').value; 
    const password = document.getElementById('clientPassword').value;
    const errorMessage = document.getElementById('clientErrorMessage');
    const clients = JSON.parse(localStorage.getItem('clients')) || [];

    const client = clients.find(c => c.email === email && c.password === password);

    if (client) {
        localStorage.setItem('userconn',JSON.stringify(client))
        window.location.href = "Untitled-1.html"; 
    } else {
        errorMessage.textContent = "L'adresse email ou le mot de passe ne sont pas corrects.";
    }
}

//Insc
function registerClient() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('regEmail').value; 
    const password = document.getElementById('regPassword').value;
    const errorMessage = document.getElementById('regErrorMessage');
    const clients = JSON.parse(localStorage.getItem('clients')) || [];

    const existingClient = clients.find(c => c.email === email);

    if (existingClient) {
        errorMessage.textContent = "Cet email est déjà utilisé.";
    } else {
        clients.push({ fullName, email, password });
        localStorage.setItem('clients', JSON.stringify(clients));
        alert("Inscription réussie! Vous pouvez maintenant vous connecter.");
        showClientForm();
    }
}



function validateAdminCredentials() {
    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    const correctEmail = "salma.fathi16000@gmail.com";
    const correctPassword = "123";

    if (email === correctEmail && password === correctPassword) {
        window.location.href = "Page admine.html"; 
    } else {
        errorMessage.textContent = "L'adresse email ou le mot de passe ne sont pas corrects.";
    }
}