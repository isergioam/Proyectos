const gameConfig = {
    title: 'Code Invaders',
    subtitle: 'La invasión de los bugs',
    maxRankingItems: 10,
    difficulties: {
        easy: {
            label: 'Fácil',
            enemySpeedMultiplier: 0.8,
            spawnMultiplier: 1.2
        },
        normal: {
            label: 'Normal',
            enemySpeedMultiplier: 1,
            spawnMultiplier: 1
        },
        hard: {
            label: 'Difícil',
            enemySpeedMultiplier: 1.3,
            spawnMultiplier: 0.75
        }
    }
};

module.exports = gameConfig;