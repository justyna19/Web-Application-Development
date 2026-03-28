import express from 'express';
import ViteExpress from 'vite-express';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('wadsongs.db');

app.use(express.json());

db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        song_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (song_id) REFERENCES wadsongs(id)
    )
`);

app.get('/songs', (req, res) => {
    const stmt = db.prepare('SELECT * FROM wadsongs ORDER BY id');
    const rows = stmt.all();
    res.json(rows);
});

app.get('/songs/artist/:artist', (req, res) => {
    const stmt = db.prepare('SELECT * FROM wadsongs WHERE artist = ?');
    const rows = stmt.all(req.params.artist);
    res.json(rows);
});

app.post('/songs', (req, res) => {
    let { title, artist, year = null, downloads = 0, price, quantity } = req.body;

    title = title?.trim();
    artist = artist?.trim();

    if (!title || !artist || price === undefined || quantity === undefined) {
        return res.status(400).json({
            error: 'title, artist, price, and quantity are required',
        });
    }

    try {
        const stmt = db.prepare(
            'INSERT INTO wadsongs (title, artist, year, downloads, price, quantity) VALUES (?, ?, ?, ?, ?, ?)'
        );
        const info = stmt.run(title, artist, year, downloads, price, quantity);
        res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/songs/:id/buy', (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'id must be an integer' });
    }

    try {
        const transaction = db.transaction((songId) => {
            const selectStmt = db.prepare('SELECT * FROM wadsongs WHERE id = ?');
            const updateStmt = db.prepare('UPDATE wadsongs SET quantity = quantity - 1 WHERE id = ?');
            const orderStmt = db.prepare('INSERT INTO orders (song_id, quantity) VALUES (?, ?)');
            const song = selectStmt.get(songId);

            if (!song) {
                return { error: 'song not found', status: 404 };
            }

            if (song.quantity < 1) {
                return { error: 'song is out of stock', status: 400 };
            }

            updateStmt.run(songId);
            const orderInfo = orderStmt.run(songId, 1);

            return {
                status: 201,
                orderId: orderInfo.lastInsertRowid,
                song: selectStmt.get(songId),
            };
        });

        const result = transaction(id);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        res.status(201).json({
            message: 'song purchased',
            order: {
                id: result.orderId,
                song_id: id,
                quantity: 1,
            },
            song: result.song,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

ViteExpress.listen(app, 3000, () =>
    console.log('Server with Vite running on http://localhost:3000')
);