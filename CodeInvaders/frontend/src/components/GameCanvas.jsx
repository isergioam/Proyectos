import { useEffect, useRef } from 'react';
import {
    BULLET_COOLDOWN,
    BULLET_HEIGHT,
    BULLET_SPEED,
    BULLET_WIDTH,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    ENEMY_BASE_SPEED,
    ENEMY_HEIGHT,
    ENEMY_SPAWN_INTERVAL,
    ENEMY_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_INITIAL_LIVES,
    PLAYER_INVULNERABLE_TIME,
    PLAYER_SPEED,
    PLAYER_WIDTH,
    WAVE_SCORE_STEP,
    POWERUP_DURATION,
    POWERUP_HEIGHT,
    POWERUP_SPAWN_INTERVAL,
    POWERUP_WIDTH,
    ENEMY_BULLET_HEIGHT,
    ENEMY_BULLET_SPEED,
    ENEMY_BULLET_WIDTH,
    BOSS_HEIGHT,
    BOSS_WIDTH
} from '../game/constants';
import { isColliding } from '../game/collisions';
import {
    playShootSound,
    playExplosionSound,
    playHitSound,
    playPowerupSound
} from '../game/audio';

const CODE_SNIPPETS = [
    'const', 'let', 'function', '=>', '&&', '||', 'return', 'null', 'true', 'false',
    'import', 'export', 'await', 'async', 'class', 'super', 'new', 'try', 'catch',
    'throw', 'if', 'else', 'map', 'filter', 'reduce', 'const [state, setState]',
    'useEffect', 'useRef', 'fetch', 'res.json()', 'app.listen()', 'CORS', 'NaN'
];

function GameCanvas({ difficultyConfig, onStatsChange, onGameOver, onPauseChange }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const keysRef = useRef({});
    const gameRef = useRef(null);
    const lastStatsRef = useRef({ score: -1, lives: -1, wave: -1, paused: false });
    const enemySpeedMultiplier = difficultyConfig?.enemySpeedMultiplier || 1;
    const spawnMultiplier = difficultyConfig?.spawnMultiplier || 1;


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        gameRef.current = createInitialGameState();

        function handleKeyDown(event) {
            const key = event.key.toLowerCase();

            if (key === ' ' || key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright') {
                event.preventDefault();
            }

            if (key === 'p') {
                gameRef.current.paused = !gameRef.current.paused;
                onPauseChange(gameRef.current.paused);
                return;
            }

            keysRef.current[key] = true;
        }

        function handleKeyUp(event) {
            keysRef.current[event.key.toLowerCase()] = false;
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let previousTime = performance.now();

        function gameLoop(currentTime) {
            const deltaTime = Math.min((currentTime - previousTime) / 16.67, 2);
            previousTime = currentTime;

            const game = gameRef.current;

            if (!game.gameOver) {
                if (!game.paused) {
                    updateGame(game, keysRef.current, deltaTime, currentTime);
                }

                drawGame(ctx, game);
                syncStats(game);

                animationRef.current = requestAnimationFrame(gameLoop);
            }
        }

        function syncStats(game) {
            const lastStats = lastStatsRef.current;

            if (
                lastStats.score !== game.score ||
                lastStats.lives !== game.lives ||
                lastStats.wave !== game.wave ||
                lastStats.paused !== game.paused
            ) {
                lastStatsRef.current = {
                    score: game.score,
                    lives: game.lives,
                    wave: game.wave,
                    paused: game.paused
                };

                onStatsChange({
                    score: game.score,
                    lives: game.lives,
                    wave: game.wave,
                    paused: game.paused
                });
            }
        }

        animationRef.current = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [onStatsChange, onGameOver, onPauseChange]);

    function createInitialGameState() {
        return {
            score: 0,
            lives: PLAYER_INITIAL_LIVES,
            wave: 1,
            paused: false,
            gameOver: false,
            lastShotAt: 0,
            lastEnemySpawnAt: 0,
            playerInvulnerableUntil: 0,
            player: {
                x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
                y: CANVAS_HEIGHT - PLAYER_HEIGHT - 36,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
                speed: PLAYER_SPEED
            },
            bullets: [],
            enemyBullets: [],
            enemies: [],
            particles: [],
            lastPowerUpSpawnAt: 0,
            powerUps: [],
            screenShakeTime: 0,
            boss: null,
            bossActive: false,
            comboCount: 1,
            lastEnemyKilledAt: 0,
            floatingTexts: [],
            damageFlashTime: 0,
            waveBannerText: 'OLEADA 1',
            waveBannerTime: 120,
            backgroundCode: Array.from({ length: 18 }, () => ({
                text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                speed: Math.random() * 0.6 + 0.3,
                opacity: Math.random() * 0.09 + 0.03,
                fontSize: Math.floor(Math.random() * 6) + 11
            })),
            activePowerUps: {
                speedUntil: 0,
                shieldUntil: 0,
                tripleShotUntil: 0
            }
        };
    }

    function updateGame(game, keys, deltaTime, currentTime) {
        updateWave(game);
        updatePlayer(game, keys, deltaTime);
        updateShooting(game, keys, currentTime);
        updateBullets(game, deltaTime);
        spawnEnemies(game, currentTime);
        updateEnemyShooting(game, currentTime);
        updateEnemyBullets(game, deltaTime);
        updateEnemies(game, deltaTime);
        updateParticles(game, deltaTime);
        checkBulletEnemyCollisions(game);
        checkEnemyPlayerCollisions(game, currentTime);
        checkEnemyBulletPlayerCollisions(game, currentTime);
        checkEnemiesThatPassThePlayer(game);
        checkGameOver(game);
        spawnPowerUps(game, currentTime);
        updatePowerUps(game, deltaTime);
        checkPlayerPowerUpCollisions(game, currentTime);
        updateBackgroundCode(game, deltaTime);
        updateFloatingTexts(game, deltaTime);

        if (game.waveBannerTime > 0) {
            game.waveBannerTime -= deltaTime;
        }

        if (game.damageFlashTime > 0) {
            game.damageFlashTime -= deltaTime * 0.6;
        }

        if (game.screenShakeTime > 0) {
            game.screenShakeTime -= deltaTime;
        }
    }

    function spawnPowerUps(game, currentTime) {
        if (currentTime - game.lastPowerUpSpawnAt < POWERUP_SPAWN_INTERVAL) {
            return;
        }

        game.lastPowerUpSpawnAt = currentTime;

        const types = ['heart', 'speed', 'triple', 'shield'];
        const type = types[Math.floor(Math.random() * types.length)];

        game.powerUps.push({
            type,
            x: Math.random() * (CANVAS_WIDTH - POWERUP_WIDTH),
            y: -POWERUP_HEIGHT,
            width: POWERUP_WIDTH,
            height: POWERUP_HEIGHT,
            speed: 2
        });
    }

    function updatePowerUps(game, deltaTime) {
        game.powerUps = game.powerUps
            .map((powerUp) => ({
                ...powerUp,
                y: powerUp.y + powerUp.speed * deltaTime
            }))
            .filter((powerUp) => powerUp.y < CANVAS_HEIGHT + POWERUP_HEIGHT);
    }

    function checkPlayerPowerUpCollisions(game, currentTime) {
        const collectedIndexes = new Set();

        game.powerUps.forEach((powerUp, index) => {
            if (isColliding(powerUp, game.player)) {
                applyPowerUp(game, powerUp, currentTime);
                collectedIndexes.add(index);
            }
        });

        game.powerUps = game.powerUps.filter((_, index) => !collectedIndexes.has(index));
    }

    function applyPowerUp(game, powerUp, currentTime) {
        playPowerupSound();
        if (powerUp.type === 'heart') {
            game.lives = Math.min(game.lives + 1, 5);
        }

        if (powerUp.type === 'speed') {
            game.activePowerUps.speedUntil = currentTime + POWERUP_DURATION;
        }

        if (powerUp.type === 'triple') {
            game.activePowerUps.tripleShotUntil = currentTime + POWERUP_DURATION;
        }

        if (powerUp.type === 'shield') {
            game.activePowerUps.shieldUntil = currentTime + POWERUP_DURATION;
        }
    }

    function updateWave(game) {
        const newWave = Math.floor(game.score / WAVE_SCORE_STEP) + 1;

        if (newWave > game.wave) {
            game.wave = newWave;
            game.waveBannerText = newWave % 5 === 0 ? `¡ALERTA: OLEADA ${newWave} (JEFE)!` : `INICIANDO OLEADA ${newWave}`;
            game.waveBannerTime = 120;
        }
    }

    function updatePlayer(game, keys, deltaTime) {
        const player = game.player;
        let moveX = 0;
        let moveY = 0;

        if (keys.a || keys.arrowleft) moveX -= 1;
        if (keys.d || keys.arrowright) moveX += 1;
        if (keys.w || keys.arrowup) moveY -= 1;
        if (keys.s || keys.arrowdown) moveY += 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }

        const currentSpeed = performance.now() < game.activePowerUps.speedUntil
            ? player.speed * 1.6
            : player.speed;

        player.x += moveX * currentSpeed * deltaTime;
        player.y += moveY * currentSpeed * deltaTime;

        player.x = clamp(player.x, 0, CANVAS_WIDTH - player.width);
        player.y = clamp(player.y, 0, CANVAS_HEIGHT - player.height);

        // Engine particles (engine trail)
        if (Math.random() < 0.35) {
            game.particles.push({
                x: player.x + player.width / 2 + (Math.random() * 12 - 6),
                y: player.y + player.height - 8,
                size: Math.random() * 3 + 1.5,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 + 1.5, // moves down
                life: Math.random() * 12 + 6,
                color: Math.random() > 0.4 ? '#22d3ee' : '#38bdf8'
            });
        }
    }

    function updateShooting(game, keys, currentTime) {
        const isShooting = keys[' '];

        if (!isShooting) {
            return;
        }

        if (currentTime - game.lastShotAt < BULLET_COOLDOWN) {
            return;
        }

        game.lastShotAt = currentTime;
        playShootSound();

        const hasTriple = currentTime < game.activePowerUps.tripleShotUntil;

        if (hasTriple) {
            // Center bullet
            game.bullets.push({
                x: game.player.x + game.player.width / 2 - BULLET_WIDTH / 2,
                y: game.player.y - BULLET_HEIGHT,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                speed: BULLET_SPEED,
                vx: 0
            });
            // Left diagonal bullet
            game.bullets.push({
                x: game.player.x + game.player.width / 2 - BULLET_WIDTH / 2 - 10,
                y: game.player.y - BULLET_HEIGHT,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                speed: BULLET_SPEED,
                vx: -2.5
            });
            // Right diagonal bullet
            game.bullets.push({
                x: game.player.x + game.player.width / 2 - BULLET_WIDTH / 2 + 10,
                y: game.player.y - BULLET_HEIGHT,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                speed: BULLET_SPEED,
                vx: 2.5
            });
        } else {
            // Single bullet
            game.bullets.push({
                x: game.player.x + game.player.width / 2 - BULLET_WIDTH / 2,
                y: game.player.y - BULLET_HEIGHT,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                speed: BULLET_SPEED,
                vx: 0
            });
        }
    }

    function updateBullets(game, deltaTime) {
        game.bullets = game.bullets
            .map((bullet) => ({
                ...bullet,
                x: bullet.x + (bullet.vx || 0) * deltaTime,
                y: bullet.y - bullet.speed * deltaTime
            }))
            .filter((bullet) => bullet.y + bullet.height > 0 && bullet.x + bullet.width > 0 && bullet.x < CANVAS_WIDTH);
    }

    function spawnEnemies(game, currentTime) {
        // If it's a boss wave (every 5 waves)
        if (game.wave % 5 === 0) {
            if (!game.bossActive && game.boss === null) {
                // Wait until all normal enemies are cleared before spawning the boss
                if (game.enemies.length === 0) {
                    game.bossActive = true;
                    game.boss = {
                        x: CANVAS_WIDTH / 2 - BOSS_WIDTH / 2,
                        y: -BOSS_HEIGHT,
                        width: BOSS_WIDTH,
                        height: BOSS_HEIGHT,
                        maxLife: 20 + game.wave * 12,
                        life: 20 + game.wave * 12,
                        label: game.wave % 10 === 0 ? 'SEGMENTATION_FAULT' : 'STACK_OVERFLOW',
                        color: '#ec4899', // bright pink
                        speed: 1.8,
                        directionX: 1,
                        lastShotAt: currentTime,
                        shootInterval: 1200 - (game.wave * 30), // shoots faster in later boss fights
                        shootPattern: 0
                    };
                }
            }
            return; // Do not spawn normal enemies during boss wave
        }

        const interval = Math.max(260, ENEMY_SPAWN_INTERVAL - game.wave * 55) * spawnMultiplier;

        if (currentTime - game.lastEnemySpawnAt < interval) {
            return;
        }

        game.lastEnemySpawnAt = currentTime;

        const enemyType = getRandomEnemyType(game.wave);
        const enemy = createEnemy(enemyType, game.wave, currentTime);

        game.enemies.push(enemy);
    }

    function getRandomEnemyType(wave) {
        const random = Math.random();

        if (wave >= 4 && random > 0.82) {
            return 'tank';
        }

        if (wave >= 2 && random > 0.62) {
            return 'fast';
        }

        return 'common';
    }

    function createEnemy(type, wave, currentTime) {
        const x = Math.random() * (CANVAS_WIDTH - ENEMY_WIDTH);
        const speedBonus = wave * 0.25;

        const enemyTypes = {
            common: {
                label: 'BUG',
                color: '#ef4444',
                speed: (ENEMY_BASE_SPEED + speedBonus) * enemySpeedMultiplier,
                points: 10,
                life: 1,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT
            },
            fast: {
                label: 'NaN',
                color: '#f97316',
                speed: (ENEMY_BASE_SPEED + speedBonus) * enemySpeedMultiplier,
                points: 20,
                life: 1,
                width: ENEMY_WIDTH - 6,
                height: ENEMY_HEIGHT - 4
            },
            tank: {
                label: 'CORS',
                color: '#a855f7',
                speed: (ENEMY_BASE_SPEED + speedBonus) * enemySpeedMultiplier,
                points: 40,
                life: 3,
                width: ENEMY_WIDTH + 14,
                height: ENEMY_HEIGHT + 10
            }
        };

        return {
            type,
            x,
            y: -60,
            directionX: Math.random() > 0.5 ? 1 : -1,
            drift: Math.random() * 0.7,
            lastShotAt: currentTime + Math.random() * 1500,
            shootInterval: 2500 + Math.random() * 3000 - (wave * 100),
            ...enemyTypes[type]
        };
    }

    function updateEnemies(game, deltaTime) {
        if (game.bossActive && game.boss) {
            const boss = game.boss;
            // Descend into view
            if (boss.y < 60) {
                boss.y += 1.5 * deltaTime;
            } else {
                // Sway left and right
                boss.x += boss.directionX * boss.speed * deltaTime;
                if (boss.x <= 20 || boss.x + boss.width >= CANVAS_WIDTH - 20) {
                    boss.directionX *= -1;
                }
            }
        }

        game.enemies = game.enemies.map((enemy) => {
            const nextX = enemy.x + enemy.directionX * enemy.drift * deltaTime;

            let directionX = enemy.directionX;

            if (nextX <= 0 || nextX + enemy.width >= CANVAS_WIDTH) {
                directionX *= -1;
            }

            return {
                ...enemy,
                x: clamp(nextX, 0, CANVAS_WIDTH - enemy.width),
                y: enemy.y + enemy.speed * deltaTime,
                directionX
            };
        });
    }

    function updateParticles(game, deltaTime) {
        game.particles = game.particles
            .map((particle) => ({
                ...particle,
                x: particle.x + particle.vx * deltaTime,
                y: particle.y + particle.vy * deltaTime,
                life: particle.life - 1 * deltaTime
            }))
            .filter((particle) => particle.life > 0);
    }

    function checkBulletEnemyCollisions(game) {
        const bulletsToRemove = new Set();
        const enemiesToRemove = new Set();

        game.bullets.forEach((bullet, bulletIndex) => {
            game.enemies.forEach((enemy, enemyIndex) => {
                if (bulletsToRemove.has(bulletIndex) || enemiesToRemove.has(enemyIndex)) {
                    return;
                }

                if (isColliding(bullet, enemy)) {
                    bulletsToRemove.add(bulletIndex);
                    enemy.life -= 1;

                    createExplosion(game, bullet.x, bullet.y, enemy.color, 6);

                    if (enemy.life <= 0) {
                        enemiesToRemove.add(enemyIndex);

                        // Combo multiplier calculation
                        const now = performance.now();
                        let multiplier = 1;
                        if (now - game.lastEnemyKilledAt < 1500) {
                            game.comboCount += 1;
                            multiplier = game.comboCount;
                        } else {
                            game.comboCount = 1;
                        }
                        game.lastEnemyKilledAt = now;

                        const pointsEarned = enemy.points * multiplier;
                        game.score += pointsEarned;

                        // Spawn floating text
                        game.floatingTexts.push({
                            text: multiplier > 1 ? `+${enemy.points} x${multiplier}!` : `+${enemy.points}`,
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y,
                            color: multiplier > 1 ? '#facc15' : '#22d3ee',
                            fontSize: multiplier > 1 ? 19 : 14,
                            life: 45,
                            maxLife: 45
                        });

                        createExplosion(game, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, 14);
                        playExplosionSound();
                    }
                }
            });
        });

        game.bullets = game.bullets.filter((_, index) => !bulletsToRemove.has(index));
        game.enemies = game.enemies.filter((_, index) => !enemiesToRemove.has(index));

        // Check boss collisions
        if (game.bossActive && game.boss) {
            const boss = game.boss;
            const bulletsToClear = new Set();

            game.bullets.forEach((bullet, bulletIndex) => {
                if (isColliding(bullet, boss)) {
                    bulletsToClear.add(bulletIndex);
                    boss.life -= 1;
                    createExplosion(game, bullet.x, bullet.y, boss.color, 5);

                    if (boss.life <= 0) {
                        const pointsEarned = 500 * (game.wave / 5);
                        game.score += pointsEarned;

                        game.floatingTexts.push({
                            text: `+${pointsEarned} ¡JEFE ELIMINADO!`,
                            x: boss.x + boss.width / 2,
                            y: boss.y + boss.height / 2,
                            color: '#ec4899',
                            fontSize: 22,
                            life: 75,
                            maxLife: 75
                        });

                        createExplosion(game, boss.x + boss.width / 2, boss.y + boss.height / 2, boss.color, 45);
                        playExplosionSound();

                        // Drop a power-up guaranteed
                        const types = ['heart', 'triple', 'shield', 'speed'];
                        const type = types[Math.floor(Math.random() * types.length)];
                        game.powerUps.push({
                            type,
                            x: boss.x + boss.width / 2 - POWERUP_WIDTH / 2,
                            y: boss.y + boss.height / 2,
                            width: POWERUP_WIDTH,
                            height: POWERUP_HEIGHT,
                            speed: 2
                        });

                        game.boss = null;
                        game.bossActive = false;
                        
                        // Force score to advance wave immediately
                        game.score += WAVE_SCORE_STEP;
                    }
                }
            });

            game.bullets = game.bullets.filter((_, index) => !bulletsToClear.has(index));
        }
    }

    function checkEnemyPlayerCollisions(game, currentTime) {
        if (game.bossActive && game.boss) {
            const boss = game.boss;
            if (isColliding(boss, game.player)) {
                if (currentTime < game.activePowerUps.shieldUntil) {
                    boss.life -= 1;
                    createExplosion(game, game.player.x + game.player.width / 2, game.player.y, boss.color, 10);
                } else if (currentTime >= game.playerInvulnerableUntil) {
                    game.lives -= 1;
                    game.playerInvulnerableUntil = currentTime + PLAYER_INVULNERABLE_TIME;
                    game.screenShakeTime = 18;
                    game.damageFlashTime = 12;
                    playHitSound();
                    createExplosion(game, game.player.x + game.player.width / 2, game.player.y, '#facc15', 20);
                }
            }
        }

        if (currentTime < game.activePowerUps.shieldUntil) {
            // Shield destroys the enemy on contact without taking damage
            const enemyIndex = game.enemies.findIndex((enemy) => isColliding(enemy, game.player));
            if (enemyIndex !== -1) {
                const enemy = game.enemies[enemyIndex];
                game.enemies.splice(enemyIndex, 1);
                game.score += enemy.points;
                playExplosionSound();
                createExplosion(game, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, 14);
            }
            return;
        }

        if (currentTime < game.playerInvulnerableUntil) {
            return;
        }

        const enemyIndex = game.enemies.findIndex((enemy) => isColliding(enemy, game.player));

        if (enemyIndex === -1) {
            return;
        }

        const enemy = game.enemies[enemyIndex];
        game.enemies.splice(enemyIndex, 1);
        game.lives -= 1;
        game.playerInvulnerableUntil = currentTime + PLAYER_INVULNERABLE_TIME;
        game.screenShakeTime = 15;
        game.damageFlashTime = 10;
        playHitSound();

        createExplosion(game, enemy.x, enemy.y, '#facc15', 18);
    }

    function updateEnemyShooting(game, currentTime) {
        if (game.bossActive && game.boss) {
            const boss = game.boss;
            const isPhase2 = boss.life <= boss.maxLife / 2;
            
            if (isPhase2) {
                boss.color = '#f43f5e'; // change to danger rose-red color in phase 2
            }

            const currentInterval = isPhase2 ? boss.shootInterval * 0.65 : boss.shootInterval;

            if (boss.y > 0 && currentTime - boss.lastShotAt >= currentInterval) {
                boss.lastShotAt = currentTime;
                playShootSound();

                if (isPhase2) {
                    // Phase 2: Rapid alternating bursts from lateral cannons
                    game.enemyBullets.push(
                        {
                            x: boss.x + 10,
                            y: boss.y + boss.height,
                            width: ENEMY_BULLET_WIDTH,
                            height: ENEMY_BULLET_HEIGHT,
                            speed: ENEMY_BULLET_SPEED + 0.8,
                            vx: -2.0
                        },
                        {
                            x: boss.x + boss.width - 10,
                            y: boss.y + boss.height,
                            width: ENEMY_BULLET_WIDTH,
                            height: ENEMY_BULLET_HEIGHT,
                            speed: ENEMY_BULLET_SPEED + 0.8,
                            vx: 2.0
                        },
                        {
                            x: boss.x + boss.width / 2 - ENEMY_BULLET_WIDTH / 2,
                            y: boss.y + boss.height,
                            width: ENEMY_BULLET_WIDTH,
                            height: ENEMY_BULLET_HEIGHT,
                            speed: ENEMY_BULLET_SPEED + 0.8,
                            vx: 0
                        }
                    );
                } else {
                    // Phase 1: 3-bullet fan pattern
                    game.enemyBullets.push(
                        {
                            x: boss.x + boss.width / 2 - ENEMY_BULLET_WIDTH / 2,
                            y: boss.y + boss.height,
                            width: ENEMY_BULLET_WIDTH,
                            height: ENEMY_BULLET_HEIGHT,
                            speed: ENEMY_BULLET_SPEED,
                            vx: 0
                        },
                        {
                            x: boss.x + boss.width / 2 - ENEMY_BULLET_WIDTH / 2,
                            y: boss.y + boss.height,
                            width: ENEMY_BULLET_WIDTH,
                            height: ENEMY_BULLET_HEIGHT,
                            speed: ENEMY_BULLET_SPEED - 0.5,
                            vx: -1.8
                        },
                        {
                            x: boss.x + boss.width / 2 - ENEMY_BULLET_WIDTH / 2,
                            y: boss.y + boss.height,
                            width: ENEMY_BULLET_WIDTH,
                            height: ENEMY_BULLET_HEIGHT,
                            speed: ENEMY_BULLET_SPEED - 0.5,
                            vx: 1.8
                        }
                    );
                }
            }
        }

        game.enemies.forEach((enemy) => {
            if (enemy.y > 0 && currentTime - enemy.lastShotAt >= enemy.shootInterval) {
                enemy.lastShotAt = currentTime;
                
                game.enemyBullets.push({
                    x: enemy.x + enemy.width / 2 - ENEMY_BULLET_WIDTH / 2,
                    y: enemy.y + enemy.height,
                    width: ENEMY_BULLET_WIDTH,
                    height: ENEMY_BULLET_HEIGHT,
                    speed: ENEMY_BULLET_SPEED,
                    vx: 0
                });
            }
        });
    }

    function updateEnemyBullets(game, deltaTime) {
        game.enemyBullets = game.enemyBullets
            .map((bullet) => ({
                ...bullet,
                x: bullet.x + (bullet.vx || 0) * deltaTime,
                y: bullet.y + bullet.speed * deltaTime
            }))
            .filter((bullet) => bullet.y < CANVAS_HEIGHT && bullet.x + bullet.width > 0 && bullet.x < CANVAS_WIDTH);
    }

    function updateBackgroundCode(game, deltaTime) {
        game.backgroundCode.forEach((item) => {
            item.y += item.speed * deltaTime;
            if (item.y > CANVAS_HEIGHT + 20) {
                item.y = -20;
                item.x = Math.random() * CANVAS_WIDTH;
                item.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
                item.speed = Math.random() * 0.6 + 0.3;
                item.opacity = Math.random() * 0.09 + 0.03;
                item.fontSize = Math.floor(Math.random() * 6) + 11;
            }
        });
    }

    function updateFloatingTexts(game, deltaTime) {
        game.floatingTexts.forEach((ft) => {
            ft.y -= 0.65 * deltaTime;
            ft.life -= 1 * deltaTime;
        });
        game.floatingTexts = game.floatingTexts.filter((ft) => ft.life > 0);
    }

    function drawFloatingTexts(ctx, floatingTexts) {
        ctx.save();
        floatingTexts.forEach((ft) => {
            const opacity = Math.max(0, ft.life / ft.maxLife);
            ctx.fillStyle = ft.color;
            ctx.font = `bold ${ft.fontSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.globalAlpha = opacity;
            
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#000000';
            ctx.fillText(ft.text, ft.x, ft.y);
        });
        ctx.restore();
    }

    function checkEnemyBulletPlayerCollisions(game, currentTime) {
        if (currentTime < game.activePowerUps.shieldUntil) {
            game.enemyBullets = game.enemyBullets.filter(bullet => {
                const collides = isColliding(bullet, game.player);
                if (collides) {
                    createExplosion(game, bullet.x, bullet.y, '#facc15', 3);
                }
                return !collides;
            });
            return;
        }

        if (currentTime < game.playerInvulnerableUntil) {
            return;
        }

        const hitIndex = game.enemyBullets.findIndex((bullet) => isColliding(bullet, game.player));

        if (hitIndex !== -1) {
            game.enemyBullets.splice(hitIndex, 1);
            game.lives -= 1;
            game.playerInvulnerableUntil = currentTime + PLAYER_INVULNERABLE_TIME;
            game.screenShakeTime = 12;
            game.damageFlashTime = 10;
            playHitSound();
            createExplosion(game, game.player.x + game.player.width / 2, game.player.y, '#facc15', 18);
        }
    }

    function drawPowerUps(ctx, powerUps) {
        powerUps.forEach((powerUp) => {
            const icons = {
                heart: '♥',
                speed: '⚡',
                triple: '×3',
                shield: '⬡'
            };

            ctx.save();
            ctx.fillStyle = '#facc15';
            ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 14px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(icons[powerUp.type], powerUp.x + powerUp.width / 2, powerUp.y + 20);
            ctx.restore();
        });
    }

    function checkEnemiesThatPassThePlayer(game) {
        const enemiesBefore = game.enemies.length;

        game.enemies = game.enemies.filter((enemy) => enemy.y < CANVAS_HEIGHT + 60);

        const escapedEnemies = enemiesBefore - game.enemies.length;

        if (escapedEnemies > 0) {
            game.lives -= escapedEnemies;
        }
    }

    function checkGameOver(game) {
        if (game.lives <= 0 && !game.gameOver) {
            game.lives = 0;
            game.gameOver = true;

            onStatsChange({
                score: game.score,
                lives: game.lives,
                wave: game.wave,
                paused: false
            });

            onGameOver({
                score: game.score,
                wave: game.wave
            });
        }
    }

    function createExplosion(game, x, y, color, amount) {
        for (let i = 0; i < amount; i += 1) {
            game.particles.push({
                x,
                y,
                size: Math.random() * 4 + 2,
                vx: Math.random() * 6 - 3,
                vy: Math.random() * 6 - 3,
                life: Math.random() * 24 + 14,
                color
            });
        }
    }

    function drawGame(ctx, game) {
        drawBackground(ctx, game);

        ctx.save();

        if (game.screenShakeTime > 0) {
            const shakeX = (Math.random() - 0.5) * 8;
            const shakeY = (Math.random() - 0.5) * 8;
            ctx.translate(shakeX, shakeY);
        }

        drawPowerUps(ctx, game.powerUps);
        drawBullets(ctx, game.bullets);
        drawEnemyBullets(ctx, game.enemyBullets);
        drawEnemies(ctx, game.enemies);
        if (game.bossActive && game.boss) {
            drawBoss(ctx, game.boss);
        }
        drawPlayer(ctx, game.player, game.playerInvulnerableUntil, game.activePowerUps.shieldUntil);
        drawParticles(ctx, game.particles);
        drawFloatingTexts(ctx, game.floatingTexts);

        ctx.restore();

        // Render damage flash overlay
        if (game.damageFlashTime > 0) {
            ctx.save();
            const opacity = Math.min(0.35, game.damageFlashTime / 10) * 0.75;
            ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.restore();
        }

        // Draw new wave banner
        if (game.waveBannerTime > 0 && !game.gameOver) {
            drawWaveBanner(ctx, game);
        }

        if (game.paused) {
            drawPauseOverlay(ctx);
        }
    }

    function drawWaveBanner(ctx, game) {
        ctx.save();
        const timeRemaining = game.waveBannerTime;
        let opacity = 1;
        
        // Fade in first 15 frames, fade out last 25 frames
        if (timeRemaining > 105) {
            opacity = (120 - timeRemaining) / 15;
        } else if (timeRemaining < 25) {
            opacity = timeRemaining / 25;
        }
        
        ctx.globalAlpha = opacity;
        
        // Draw dark background banner ribbon
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(0, CANVAS_HEIGHT / 2 - 45, CANVAS_WIDTH, 90);
        
        // Text shadow glow
        ctx.shadowBlur = 18;
        ctx.shadowColor = game.wave % 5 === 0 ? '#ec4899' : '#22d3ee'; // pink for boss wave, cyan for normal wave
        
        // Wave Text
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(game.waveBannerText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        
        ctx.restore();
    }

    function drawBoss(ctx, boss) {
        ctx.save();
        ctx.shadowBlur = 22;
        ctx.shadowColor = boss.color;
        ctx.fillStyle = boss.color;
        
        // Draw main body
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        
        // Draw boss text label
        ctx.fillStyle = '#020617';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(boss.label, boss.x + boss.width / 2, boss.y + boss.height / 2 + 5);
        ctx.restore();

        // Draw Boss Health Bar at top center
        ctx.save();
        const barWidth = 400;
        const barHeight = 12;
        const barX = CANVAS_WIDTH / 2 - barWidth / 2;
        const barY = 20;

        // Health bar background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health bar fill
        const fillRatio = Math.max(0, boss.life / boss.maxLife);
        ctx.fillStyle = boss.color;
        ctx.fillRect(barX, barY, barWidth * fillRatio, barHeight);

        // Border
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Warning label text
        ctx.fillStyle = '#fb7185';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`WARNING: ALERTA DE EXCEPCIÓN - ${boss.label}`, CANVAS_WIDTH / 2, barY - 7);
        ctx.restore();
    }

    function drawEnemyBullets(ctx, enemyBullets) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.fillStyle = '#ef4444';

        enemyBullets.forEach((bullet) => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        ctx.restore();
    }

    function drawBackground(ctx, game) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#020617');
        gradient.addColorStop(1, '#0f172a');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Layer 1: Slow background stars
        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        for (let i = 0; i < 50; i += 1) {
            const x = (i * 137) % CANVAS_WIDTH;
            const y = (i * 89 + game.score * 0.04) % CANVAS_HEIGHT;
            ctx.fillRect(x, y, 1, 1);
        }

        // Layer 2: Fast foreground stars
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        for (let i = 0; i < 30; i += 1) {
            const x = (i * 223) % CANVAS_WIDTH;
            const y = (i * 71 + game.score * 0.12) % CANVAS_HEIGHT;
            ctx.fillRect(x, y, 2, 2);
        }

        // Layer 3: Dynamic code snippets floating (parallax)
        ctx.save();
        game.backgroundCode.forEach((item) => {
            ctx.fillStyle = `rgba(34, 211, 238, ${item.opacity})`;
            ctx.font = `bold ${item.fontSize}px monospace`;
            ctx.fillText(item.text, item.x, item.y);
        });
        ctx.restore();
    }

    function drawPlayer(ctx, player, invulnerableUntil, shieldUntil) {
        const isInvulnerable = performance.now() < invulnerableUntil;
        const hasShield = performance.now() < shieldUntil;

        if (isInvulnerable && Math.floor(performance.now() / 80) % 2 === 0) {
            return;
        }

        const centerX = player.x + player.width / 2;
        const centerY = player.y + player.height / 2;

        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#22d3ee';

        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.moveTo(centerX, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(centerX, player.y + player.height - 10);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(centerX - 5, player.y + 15, 10, 12);

        if (hasShield) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(centerX, centerY, Math.max(player.width, player.height) * 0.75, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawBullets(ctx, bullets) {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#facc15';
        ctx.fillStyle = '#facc15';

        bullets.forEach((bullet) => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        ctx.restore();
    }

    function drawEnemies(ctx, enemies) {
        enemies.forEach((enemy) => {
            ctx.save();
            ctx.shadowBlur = 14;
            ctx.shadowColor = enemy.color;
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

            ctx.fillStyle = '#111827';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.label, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2 + 4);

            if (enemy.life > 1) {
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(enemy.x, enemy.y - 7, enemy.width * (enemy.life / 3), 4);
            }

            ctx.restore();
        });
    }

    function drawParticles(ctx, particles) {
        particles.forEach((particle) => {
            ctx.save();
            ctx.globalAlpha = Math.max(particle.life / 40, 0);
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            ctx.restore();
        });
    }

    function drawPauseOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 48px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSA', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        ctx.font = '20px system-ui';
        ctx.fillText('Pulsa P para continuar', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 42);
        ctx.restore();
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    return (
        <div className="canvas-shell">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="game-canvas"
            />
        </div>
    );
}

export default GameCanvas;