const db = require('../config/db');

// LIKE
exports.like = (req, res) => {
    const userId = req.user.id;
    const externalId = req.params.externalId;

    db.run(
        `INSERT INTO likes (userId, externalId) VALUES (?, ?)`,
        [userId, externalId],
        function (err) {

            if (err && err.message.includes('UNIQUE')) {
                return getLikeCount(externalId, true, res);
            }

            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erreur like" });
            }

            getLikeCount(externalId, true, res);
        }
    );
};

// UNLIKE
exports.unlike = (req, res) => {
    const userId = req.user.id;
    const externalId = req.params.externalId;

    db.run(
        `DELETE FROM likes WHERE userId = ? AND externalId = ?`,
        [userId, externalId],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erreur unlike" });
            }

            getLikeCount(externalId, false, res);
        }
    );
};

// COMPTEUR
function getLikeCount(externalId, liked, res) {
    db.get(
        `SELECT COUNT(*) AS likeCount FROM likes WHERE externalId = ?`,
        [externalId],
        (_, row) => {
            res.json({
                liked,
                likeCount: row.likeCount
            });
        }
    );
}
