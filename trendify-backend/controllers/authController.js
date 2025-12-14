const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

exports.signup = (req, res) => {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    db.get(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        async (err, row) => {
            if (row) {
                if (row.email === email)
                    return res.status(400).json({ message: 'Email déjà utilisé.' });
                if (row.username === username)
                    return res.status(400).json({ message: "Nom d'utilisateur déjà pris." });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const createdAt = new Date().toISOString();

            db.run(
                `INSERT INTO users (fullname, username, email, passwordHash, createdAt)
                 VALUES (?, ?, ?, ?, ?)`,
                [fullname, username, email, passwordHash, createdAt],
                function (err) {
                    const user = { id: this.lastID, fullname, username, email };
                    const token = generateToken(user);
                    return res.status(201).json({ user, token });
                }
            );
        }
    );
};

exports.login = (req, res) => {
    const { emailOrUsername, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE email = ? OR username = ?`,
        [emailOrUsername, emailOrUsername],
        async (err, user) => {
            if (!user) return res.status(400).json({ message: 'Utilisateur introuvable.' });

            const match = await bcrypt.compare(password, user.passwordHash);
            if (!match) return res.status(400).json({ message: 'Mot de passe incorrect.' });

            const safeUser = {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email
            };

            const token = generateToken(safeUser);
            res.json({ user: safeUser, token });
        }
    );
};

exports.me = (req, res) => {
    db.get(
        `SELECT id, fullname, username, email, createdAt FROM users WHERE id = ?`,
        [req.user.id],
        (err, user) => {
            if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
            res.json(user);
        }
    );
};
