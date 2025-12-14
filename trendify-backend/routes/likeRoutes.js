const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const likeController = require('../controllers/likeController');

router.post('/:externalId', authMiddleware, likeController.like);
router.delete('/:externalId', authMiddleware, likeController.unlike);

router.get('/:externalId/count', (req, res) => {
    const db = require('../config/db');
    const externalId = req.params.externalId;

    db.get(
        `SELECT COUNT(*) AS likeCount FROM likes WHERE externalId = ?`,
        [externalId],
        (_, row) => {
            res.json({ likeCount: row.likeCount });
        }
    );
});


module.exports = router;
