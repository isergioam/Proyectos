const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const gameConfig = require('./gameConfig');

const app = express();
const PORT = 3000;
const SCORES_FILE = path.join(__dirname, 'data', 'scores.json');

app.use(cors());
app.use(express.json());

ensureScoresFileExists();

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        message: 'Backend de Cache Runner funcionando correctamente'
    });
});

app.get('/api/config', (req, res) => {
    res.json(gameConfig);
});

app.get('/api/scores', (req, res) => {
    const scores = readScores();
    const sortedScores = sortScores(scores).slice(0, gameConfig.maxRankingItems);

    res.json(sortedScores);
});

app.post('/api/scores', (req, res) => {
    const { playerName, score, distance, speed } = req.body;

    const validationError = validateScorePayload({ playerName, score, distance, speed });

    if (validationError) {
        return res.status(400).json({
            ok: false,
            message: validationError
        });
    }

    const scores = readScores();

    const newScore = {
        id: createId(),
        playerName: playerName.trim().slice(0, 24),
        score: Number(score),
        distance: Math.floor(Number(distance)),
        speed: Number(Number(speed).toFixed(2)),
        createdAt: new Date().toISOString()
    };

    scores.push(newScore);

    const sortedScores = sortScores(scores).slice(0, gameConfig.maxRankingItems);
    writeScores(sortedScores);

    res.status(201).json({
        ok: true,
        message: 'Puntuación guardada correctamente',
        score: newScore,
        ranking: sortedScores
    });
});

app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: 'Ruta no encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`Backend Cache Runner escuchando en http://localhost:${PORT}`);
});

function ensureScoresFileExists() {
    const dataDirectory = path.dirname(SCORES_FILE);

    if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory, { recursive: true });
    }

    if (!fs.existsSync(SCORES_FILE)) {
        fs.writeFileSync(SCORES_FILE, '[]', 'utf-8');
    }
}

function readScores() {
    try {
        const fileContent = fs.readFileSync(SCORES_FILE, 'utf-8');
        const scores = JSON.parse(fileContent);

        if (!Array.isArray(scores)) {
            return [];
        }

        return scores;
    } catch (error) {
        console.error('Error leyendo puntuaciones:', error.message);
        return [];
    }
}

function writeScores(scores) {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf-8');
}

function sortScores(scores) {
    return [...scores].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }

        return b.distance - a.distance;
    });
}

function validateScorePayload({ playerName, score, distance, speed }) {
    if (typeof playerName !== 'string' || playerName.trim().length < 2) {
        return 'El nombre del equipo debe tener al menos 2 caracteres';
    }

    if (playerName.trim().length > 24) {
        return 'El nombre del equipo no puede superar los 24 caracteres';
    }

    if (!Number.isFinite(Number(score)) || Number(score) < 0) {
        return 'La puntuación debe ser un número mayor o igual que 0';
    }

    if (!Number.isInteger(Number(score))) {
        return 'La puntuación debe ser un número entero';
    }

    if (!Number.isFinite(Number(distance)) || Number(distance) < 0) {
        return 'La distancia debe ser un número mayor o igual que 0';
    }

    if (!Number.isFinite(Number(speed)) || Number(speed) < 1) {
        return 'La velocidad debe ser un número mayor o igual que 1';
    }

    return null;
}

function createId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}