// Facebook Mini - Frontend Pentest
// L'URL du backend sera à configurer après déploiement sur Render

let API_BASE_URL = ''; // On configurera après le déploiement

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    // Reset message
    messageDiv.textContent = '';
    messageDiv.className = '';
    
    try {
        console.log('🔐 Tentative de connexion avec:', username);
        
        // Si pas d'URL configurée, on utilise une simulation en attendant
        if (!API_BASE_URL) {
            API_BASE_URL = window.location.origin.replace('github.io', 'render.com');
            console.log('🔄 URL backend estimée:', API_BASE_URL);
        }
        
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.innerHTML = `
                ✅ ${data.message}
                <br><small>Token: ${data.token.substring(0, 20)}...</small>
            `;
            
            // Stockage des données
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            console.log('🔑 Token reçu:', data.token);
            console.log('👤 Utilisateur:', data.user);
            
            // Redirection vers la galerie
            setTimeout(() => {
                window.location.href = 'gallery.html';
            }, 2000);
            
        } else {
            messageDiv.className = 'error';
            messageDiv.innerHTML = `
                ❌ ${data.error}
                <br><small>Essayez une injection SQL: <code>admin' OR '1'='1' --</code></small>
            `;
        }
    } catch (error) {
        console.error('💥 Erreur:', error);
        messageDiv.className = 'error';
        messageDiv.innerHTML = `
            ❌ Impossible de se connecter au backend
            <br><small>Vérifiez que le backend est déployé sur Render</small>
            <br><small>Erreur: ${error.message}</small>
            
            <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px;">
                <strong>🚨 BACKEND NON CONNECTÉ</strong>
                <br>Pour tester les injections SQL, déploie le backend sur Render.com
                <br>Instructions dans le README.md
            </div>
        `;
    }
});

// Fonction pour tester différentes injections
function testInjection(type) {
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    switch(type) {
        case 'sql':
            usernameField.value = "admin' OR '1'='1' --";
            passwordField.value = "anything";
            break;
        case 'xss':
            usernameField.value = "<script>alert('XSS')</script>";
            passwordField.value = "test";
            break;
        case 'normal':
            usernameField.value = "admin";
            passwordField.value = "password123";
            break;
    }
}

// Afficher l'URL actuelle pour debug
console.log('🌐 URL actuelle:', window.location.href);
console.log('🚀 Frontend Facebook Mini Pentest chargé!');
console.log('🎯 Testez: admin\' OR \'1\'=\'1\' --');
