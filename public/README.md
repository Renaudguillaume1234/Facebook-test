# 🚀 Facebook Mini - Lab de Pentesting

## 📖 Description
Site web avec failles de sécurité intentionnelles pour l'apprentissage du hacking éthique.

## 🎯 Failles Intentionnelles
- ✅ Injection SQL dans le système de login
- ✅ JWT avec secret faible
- ✅ CORS mal configuré
- ✅ Sessions non sécurisées

## 🛠️ Installation

### Backend (Render.com)
1. Forkez ce repository
2. Allez sur [Render.com](https://render.com)
3. Créez un nouveau "Web Service"
4. Liez votre repository GitHub
5. Déployez !

### Frontend (GitHub Pages)
1. Allez dans Settings → Pages
2. Sélectionnez "Deploy from branch"
3. Choisissez la branch "main" et le dossier "/ (root)"
4. Votre site sera sur : `https://username.github.io/facebook-mini-pentest`

## 🔓 Tests de Sécurité

### Injection SQL
**Identifiant :** `admin' OR '1'='1' --`  
**Mot de passe :** n'importe quoi

### Comptes de Test
- **admin** / password123
- **john** / password123

## ⚠️ Attention
Ce site contient des failles intentionnelles. Ne pas utiliser avec des données réelles !
