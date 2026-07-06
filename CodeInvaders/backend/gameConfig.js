const gameConfig = {
    title: 'Code Invaders',
    subtitle: 'La invasión de los bugs',
    maxRankingItems: 10,
    difficulty: {
        name: 'Normal',
        description: 'Oleadas progresivas, enemigos cada vez más frecuentes y ranking competitivo.'
    },
    rules: {
        commonBugPoints: 10,
        fastBugPoints: 20,
        tankBugPoints: 40,
        initialLives: 3
    }
};

module.exports = gameConfig;