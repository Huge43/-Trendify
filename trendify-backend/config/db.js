const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'trendify.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(' Erreur SQLite :', err.message);
    } else {
        console.log(' SQLite connecté sur', dbPath);
    }
});

db.serialize(() => {

    // USERS
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            passwordHash TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )
    `);

    // LIKES (Unsplash externalId)
    db.run(`
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            externalId TEXT NOT NULL,
            UNIQUE (userId, externalId)
        )
    `);

    // COMMENTS (Unsplash externalId)
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    externalId TEXT NOT NULL,
    text TEXT NOT NULL,
    createdAt TEXT NOT NULL
);


    `);
});

module.exports = db;
