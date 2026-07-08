const soundPaths = {
    jump: 'sounds/jump.wav',
    hit: 'sounds/hit.wav',
    gameover: 'sounds/gameover.wav',
    save: 'sounds/save.wav',
    collect: 'sounds/collect.wav',
    shield: 'sounds/shield.wav',
    doublejump: 'sounds/doublejump.wav'
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

export function playFartSound() {
    if (muted) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // Oscillator 1 (low buzz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.35);

        // Oscillator 2 for buzzy harmonics (sawtooth)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(120, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.35);

        // Lowpass filter to muffle it slightly
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.35);

        // Volume envelopes
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc.connect(gain);
        osc2.connect(gain2);
        gain.connect(filter);
        gain2.connect(filter);
        filter.connect(ctx.destination);

        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {
        // block errors
    }
}

let musicAudio = null;

export function startBackgroundMusic() {
    if (muted) return;
    if (musicAudio) {
        musicAudio.currentTime = 0;
        musicAudio.play().catch(() => {});
        return;
    }
    musicAudio = new Audio('sounds/music.wav');
    musicAudio.loop = true;
    musicAudio.volume = 0.22;
    musicAudio.play().catch(() => {});
}

export function stopBackgroundMusic() {
    if (musicAudio) {
        musicAudio.pause();
        musicAudio.currentTime = 0;
        musicAudio.playbackRate = 1.0;
    }
}

export function pauseBackgroundMusic() {
    if (musicAudio) {
        musicAudio.pause();
    }
}

export function resumeBackgroundMusic() {
    if (muted) return;
    if (musicAudio) {
        musicAudio.play().catch(() => {});
    }
}

export function setMusicPlaybackRate(rate) {
    if (musicAudio) {
        musicAudio.playbackRate = rate;
    }
}