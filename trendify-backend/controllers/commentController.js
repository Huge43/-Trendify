const db = require("../config/db");

exports.addComment = (req, res) => {
    const { text } = req.body;
    const externalId = req.params.externalId;
    const userId = req.user.id;

    if (!text || !externalId) {
        return res.status(400).json({ message: "Commentaire invalide" });
    }

    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO comments (userId, externalId, text, createdAt)
         VALUES (?, ?, ?, ?)`,
        [userId, externalId, text, createdAt],
        function (err) {
            if (err) {
                console.error("Erreur ajout commentaire :", err.message);
                return res.status(500).json({ message: "Erreur ajout commentaire" });
            }

            res.status(201).json({ message: "Commentaire posté" });
        }
    );
};

exports.getComments = (req, res) => {
    const externalId = req.params.externalId;

    db.all(
        `
        SELECT comments.text, comments.createdAt, users.username
        FROM comments
        JOIN users ON users.id = comments.userId
        WHERE comments.externalId = ?
        ORDER BY comments.createdAt ASC
        `,
        [externalId],
        (err, rows) => {
            if (err) {
                console.error("Erreur récupération commentaires :", err.message);
                return res.status(500).json({ message: "Erreur récupération commentaires" });
            }

            res.json(rows);
        }
    );
};
