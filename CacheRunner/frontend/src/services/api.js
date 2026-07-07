const API_BASE_URL = 'http://localhost:3000/api';

export async function getGameConfig() {
    const response = await fetch(`${API_BASE_URL}/config`);

    if (!response.ok) {
        throw new Error('No se pudo cargar la configuración del juego');
    }

    return response.json();
}

export async function getScores() {
    const response = await fetch(`${API_BASE_URL}/scores`);

    if (!response.ok) {
        throw new Error('No se pudo cargar el ranking');
    }

    return response.json();
}

export async function saveScore(scoreData) {
    const response = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar la puntuación');
    }

    return data;
}