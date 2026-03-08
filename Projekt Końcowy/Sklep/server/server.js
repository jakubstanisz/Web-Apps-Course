const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = './db.json';
const SECRET_KEY = 'moj_tajny_klucz_jwt';
const REFRESH_SECRET = 'moj_tajny_klucz_refresh';

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        const initData = { users: [], opinions: [], orders: [], refreshTokens: [] };
        writeDB(initData);
        return initData;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/login', (req, res) => {
    const { name, haslo } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.name === name && u.haslo === haslo);

    if (user) {
        const accessToken = jwt.sign({ name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ name: user.name, role: user.role }, REFRESH_SECRET);

        db.refreshTokens.push(refreshToken);
        writeDB(db);

        res.json({ accessToken, refreshToken, role: user.role });
    } else {
        res.status(401).send('Nieprawidłowy login lub hasło');
    }
});

app.post('/refresh', (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    const db = readDB();
    if (!db.refreshTokens.includes(token)) return res.sendStatus(403);

    jwt.verify(token, REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
        res.json({ accessToken });
    });
});

app.post('/register', (req, res) => {
    const { name, haslo } = req.body;
    const db = readDB();

    if (db.users.find(u => u.name === name)) {
        return res.status(400).send('Użytkownik istnieje');
    }

    const newUser = { name, haslo, role: 'user' };
    db.users.push(newUser);
    writeDB(db);
    res.status(201).send('Zarejestrowano');
});

app.get('/data', (req, res) => {
    const db = readDB();
    res.json({ opinions: db.opinions, orders: db.orders });
});

app.post('/opinions', authenticateToken, (req, res) => {
    const newOpinion = req.body;
    newOpinion.user = req.user.name;

    const db = readDB();
    db.opinions.push(newOpinion);
    writeDB(db);
    res.json(newOpinion);
});

app.put('/opinions/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const { text, stars } = req.body;
    const db = readDB();

    const index = db.opinions.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).send('Brak opinii');

    if (db.opinions[index].user !== req.user.name) {
        return res.status(403).send('Nie możesz edytować cudzej opinii');
    }

    db.opinions[index].text = text;
    db.opinions[index].stars = stars;

    writeDB(db);
    res.json(db.opinions[index]);
});

app.delete('/opinions/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDB();

    const opinia = db.opinions.find(o => o.id === id);
    if (!opinia) return res.status(404).send('Brak opinii');

    if (req.user.role === 'admin' || req.user.name === opinia.user) {
        db.opinions = db.opinions.filter(o => o.id !== id);
        writeDB(db);
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
});

app.post('/orders', authenticateToken, (req, res) => {
    const newOrder = req.body;
    newOrder.uzytkownik = req.user.name;

    const db = readDB();
    db.orders.push(newOrder);
    writeDB(db);
    res.json(newOrder);
});

app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});