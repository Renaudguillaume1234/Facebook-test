// Gallery functionality
const API_BASE_URL = ''; // Même URL que app.js

async function loadGallery() {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    // Afficher les infos utilisateur
    document.getElementById('userInfo').innerHTML = `
        <p>Connecté en tant que: <strong>${userData.username}</strong></p>
        <p>ID: ${userData.id} | Email: ${userData.email}</p>
    `;
    
    // Afficher le token (pour le pentesting)
    document.getElementById('tokenInfo').innerHTML = `
        <p><strong>Token JWT:</strong> ${token.substring(0, 50)}...</p>
        <p><strong>Full Token:</strong> <small>${token}</small></p>
    `;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        document.getElementById('apiResponse').innerHTML = `
            <p><strong>Réponse API:</strong> ${JSON.stringify(data, null, 2)}</p>
        `;
        
        if (response.ok) {
            displayPhotos(data.photos);
        } else {
            document.getElementById('photosList').innerHTML = `
                <div class="error">
                    ❌ Erreur: ${data.error}
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('photosList').innerHTML = `
            <div class="error">
                ❌ Erreur de connexion: ${error.message}
                <br><small>Backend probablement non déployé</small>
            </div>
        `;
    }
    
    document.getElementById('loading').style.display = 'none';
}

function displayPhotos(photos) {
    const photosList = document.getElementById('photosList');
    
    if (!photos || photos.length === 0) {
        photosList.innerHTML = '<p>Aucune photo trouvée.</p>';
        return;
    }
    
    photosList.innerHTML = photos.map(photo => `
        <div class="photo-card">
            <div class="photo-placeholder">🖼️</div>
            <h4>${photo.description}</h4>
            <p>ID: ${photo.id} | User ID: ${photo.user_id}</p>
            <small>${photo.image_url}</small>
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

// CSS pour la galerie
const style = document.createElement('style');
style.textContent = `
    .photos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        margin: 20px 0;
    }
    .photo-card {
        border: 1px solid #ddd;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
    }
    .photo-placeholder {
        font-size: 3em;
        margin-bottom: 10px;
    }
    .debug-info {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
        font-family: monospace;
        font-size: 0.9em;
    }
`;
document.head.appendChild(style);

// Charger la galerie au démarrage
document.addEventListener('DOMContentLoaded', loadGallery);
