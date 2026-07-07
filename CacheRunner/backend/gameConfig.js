const gameConfig = {
    title: 'Cache Runner',
    subtitle: 'Corre antes de que expire el token',
    maxRankingItems: 10,
    visualStyle: {
        theme: 'Pixel art tecnológico',
        requiresSprites: true,
        requiresSound: true
    },
    difficulty: {
        name: 'Normal',
        description: 'Velocidad progresiva, obstáculos frecuentes, sprites animados y audio arcade.'
    },
    requiredAssets: {
        images: [
            'runner_run_1.png',
            'runner_run_2.png',
            'runner_run_3.png',
            'runner_run_4.png',
            'runner_jump.png',
            'runner_hit.png',
            'error_404.png',
            'error_500.png'
        ],
        sounds: [
            'jump.wav',
            'hit.wav',
            'gameover.wav',
            'save.wav'
        ]
    }
};

module.exports = gameConfig;