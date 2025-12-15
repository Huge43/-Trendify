const db = require('../config/db');
const fetch = require('node-fetch');

 
/* FEED LOCAL */
exports.getPhotos = (req, res) => {
    const sql = `
        SELECT p.*, 
            IFNULL(l.likeCount, 0) AS likeCount,
            IFNULL(c.commentCount, 0) AS commentCount
        FROM photos p
        LEFT JOIN (SELECT photoId, COUNT(*) AS likeCount FROM likes GROUP BY photoId) l
            ON p.id = l.photoId
        LEFT JOIN (SELECT photoId, COUNT(*) AS commentCount FROM comments GROUP BY photoId) c
            ON p.id = c.photoId
        ORDER BY createdAt DESC;
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Erreur DB' });
        res.json(rows);
    });
};

/* AJOUT PHOTO */
exports.addPhoto = (req, res) => {
    const { url, description, externalId, authorName } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL obligatoire' });
    }

    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO photos (externalId, url, authorName, description, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [externalId || null, url, authorName || null, description || null, createdAt],
        function (err) {
            if (err) return res.status(500).json({ message: 'Erreur insert photo' });

            res.status(201).json({
                id: this.lastID,
                url,
                description,
                externalId,
                authorName,
                createdAt,
                likeCount: 0,
                commentCount: 0
            });
        }
    );
};

/* UNSPLASH */
exports.getUnsplashPhotos = async (req, res) => {
    const query = req.query.q || 'trending';

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&per_page=10`,
            {
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error('UNSPLASH STATUS:', response.status, text);
            return res.status(500).json({ message: 'Erreur Unsplash API' });
        }

        const data = await response.json();

        const photos = data.results.map(photo => ({
            externalId: photo.id,
            url: photo.urls.regular,
            authorName: photo.user.username,
            description: photo.alt_description
        }));

        res.json(photos);
    } catch (err) {
        console.error('UNSPLASH ERROR', err);
        res.status(500).json({
            message: 'Erreur Unsplash API',
            error: err.message
        });
    }
};
