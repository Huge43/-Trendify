require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

// Démarrage
app.listen(process.env.PORT || 5000, () =>
    console.log('Trendify backend démarré sur http://localhost:5000')
);
