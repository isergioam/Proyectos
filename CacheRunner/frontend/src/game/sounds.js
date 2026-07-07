const soundPaths = {
    jump: '/sounds/jump.wav',
    hit: '/sounds/hit.wav',
    gameover: '/sounds/gameover.wav',
    save: '/sounds/save.wav'
};

const soundCache = {};
let muted = false;

export function preloadSounds() {
    Object.entries(soundPaths).forEach(([key, path]) => {
        const audio = new Audio(path);
        audio.volume = 0.35;
        soundCache[key] = audio;
    });
}

export function playSound(name) {
    if (muted) {
        return;
    }

    const originalAudio = soundCache[name];

    if (!originalAudio) {
        return;
    }

    try {
        const audio = originalAudio.cloneNode();
        audio.volume = originalAudio.volume;
        audio.play().catch(() => {
            // El navegador puede bloquear audio. El juego no debe romperse.
        });
    } catch (error) {
        // Si falla el sonido, la partida continúa.
    }
}

export function setMuted(value) {
    muted = value;
}

export function isMuted() {
    return muted;
}