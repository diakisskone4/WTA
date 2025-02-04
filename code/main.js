// Identifier la page actuelle
const pageTitle = document.title;

// Fonction : Inscription
function handleRegister() {
    const registerForm = document.getElementById('register-form');
    const message = document.getElementById('message');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const photoInput = document.getElementById('register-photo');
        const photoFile = photoInput.files[0];

        // Vérifie si l'utilisateur existe déjà
        if (localStorage.getItem(username)) {
            message.textContent = "Nom d'utilisateur déjà pris.";
            message.style.color = "red";
            return;
        }

        // Convertit la photo en Base64
        const reader = new FileReader();
        reader.onload = function () {
            const photoBase64 = reader.result;

            // Enregistre l'utilisateur dans localStorage
            const user = { email, password, photo: photoBase64 };
            localStorage.setItem(username, JSON.stringify(user));

            message.textContent = "Inscription réussie ! Vous pouvez vous connecter.";
            message.style.color = "green";
            registerForm.reset();
        };
        reader.readAsDataURL(photoFile);
    });
}

// Fonction : Connexion
function handleLogin() {
    const loginForm = document.getElementById('login-form');
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = JSON.parse(localStorage.getItem(username));

        if (!user || user.password !== password) {
            message.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
            message.style.color = "red";
            return;
        }

        // Stocke l'utilisateur connecté dans sessionStorage
        sessionStorage.setItem('loggedInUser', username);

        // Redirige vers le tableau de bord
        window.location.href = "dashboard.html";
    });
}


// Fonction : Affichage du tableau de bord
function handleDashboard() {
    const username = sessionStorage.getItem('loggedInUser');

    if (!username) {
        // Redirige vers la page de connexion si aucun utilisateur n'est connecté
        window.location.href = "login.html";
    } else {
        // Affiche le nom de l'utilisateur connecté
        document.getElementById('dashboard-username').textContent = username;
    }
}

// Fonction : Déconnexion
function handleLogout() {
    // Supprime l'utilisateur connecté
    sessionStorage.removeItem('loggedInUser');
    // Redirige vers la page de connexion
    window.location.href = "login.html";
}

// Appel des fonctions en fonction de la page
if (pageTitle === "Inscription") {
    handleRegister();
} else if (pageTitle === "Connexion") {
    handleLogin();
} else if (pageTitle === "Tableau de bord") {
    handleDashboard();
} else if (pageTitle === "Déconnexion") {
    handleLogout();
}
// Fonction : Affichage du profil
function handleProfile() {
    const profileInfo = document.getElementById('profile-info');

    // Récupère l'utilisateur connecté depuis sessionStorage
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        // Si aucun utilisateur n'est connecté, redirige vers la page de connexion
        window.location.href = "login.html";
        return;
    }

    // Récupère les données de l'utilisateur depuis localStorage
    const user = JSON.parse(localStorage.getItem(loggedInUser));

    if (user) {
        // Affiche les informations et la photo
        profileInfo.innerHTML = `
            <div class="card shadow mx-auto" style="max-width: 400px;">
                <img src="${user.photo}" alt="Photo de profil" class="card-img-top" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">Nom d'utilisateur : ${loggedInUser}</h5>
                    <h5 class="card-title">Email : ${user.email}</h5>
                </div>
            </div>
        `;
    } else {
        profileInfo.innerHTML = `<p class="text-danger">Erreur : Impossible de récupérer les données de l'utilisateur.</p>`;
    }
}

// Appel de la fonction si on est sur la page "Profil utilisateur"
if (document.title === "Profil utilisateur") {
    handleProfile();
}
