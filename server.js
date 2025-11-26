const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'secret_trop_faible';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// 🚨 CORS mal configuré intentionnellement
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Base de données en mémoire
const db = new sqlite3.Database(':memory:');

// Initialisation
db.serialize(() => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        full_name TEXT
    )`);
    
    db.run(`CREATE TABLE photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        image_url TEXT,
        description TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    
    const hashedPassword = bcrypt.hashSync('password123', 8);
    db.run(`INSERT INTO users (username, password, email, full_name) VALUES ('admin', '${hashedPassword}', 'admin@site.com', 'Administrator')`);
    db.run(`INSERT INTO users (username, password, email, full_name) VALUES ('john', '${hashedPassword}', 'john@site.com', 'John Doe')`);
    
    db.run(`INSERT INTO photos (user_id, image_url, description) VALUES (1, '/images/photo1.jpg', 'Photo privée admin')`);
    db.run(`INSERT INTO photos (user_id, image_url, description) VALUES (2, '/images/photo2.jpg', 'Photo privée John')`);
});

// 🚨 Login VULNÉRABLE
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = '${username}'`;
    
    db.get(sql, (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });
        
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (passwordIsValid) {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
                expiresIn: 86400
            });
            res.json({ message: 'Connexion réussie!', user, token });
        } else {
            res.status(401).json({ error: 'Mot de passe incorrect' });
        }
    });
});

// 🚨 Galerie avec vérification faible
app.get('/api/gallery', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Token manquant' });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        db.all(`SELECT * FROM photos WHERE user_id = ${decoded.id}`, (err, photos) => {
            if (err) return res.status(500).json({ error: 'Erreur DB' });
            res.json({ photos });
        });
    } catch (err) {
        res.status(401).json({ error: 'Token invalide' });
    }
});

// Route racine
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <h1>Facebook Mini Backend</h1>
                <p>Backend fonctionnel - Utilise le frontend GitHub Pages</p>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Backend démarré sur port ${PORT}`);
});
