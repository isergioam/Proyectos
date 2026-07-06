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
    POWERUP_WIDTH
} from '../game/constants';
import { isColliding } from '../game/collisions';

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
            enemies: [],
            particles: [],
            lastPowerUpSpawnAt: 0,
            powerUps: [],
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
        updateEnemies(game, deltaTime);
        updateParticles(game, deltaTime);
        checkBulletEnemyCollisions(game);
        checkEnemyPlayerCollisions(game, currentTime);
        checkEnemiesThatPassThePlayer(game);
        checkGameOver(game);
        spawnPowerUps(game, currentTime);
        updatePowerUps(game, deltaTime);
        checkPlayerPowerUpCollisions(game, currentTime);
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
        const interval = Math.max(260, ENEMY_SPAWN_INTERVAL - game.wave * 55) * spawnMultiplier;

        if (currentTime - game.lastEnemySpawnAt < interval) {
            return;
        }

        game.lastEnemySpawnAt = currentTime;

        const enemyType = getRandomEnemyType(game.wave);
        const enemy = createEnemy(enemyType, game.wave);

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

    function createEnemy(type, wave) {
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
            ...enemyTypes[type]
        };
    }

    function updateEnemies(game, deltaTime) {
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
                        game.score += enemy.points;
                        createExplosion(game, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, 14);
                    }
                }
            });
        });

        game.bullets = game.bullets.filter((_, index) => !bulletsToRemove.has(index));
        game.enemies = game.enemies.filter((_, index) => !enemiesToRemove.has(index));
    }

    function checkEnemyPlayerCollisions(game, currentTime) {

        if (currentTime < game.activePowerUps.shieldUntil) {
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

        createExplosion(game, enemy.x, enemy.y, '#facc15', 18);
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
        drawPowerUps(ctx, game.powerUps);
        drawBullets(ctx, game.bullets);
        drawEnemies(ctx, game.enemies);
        drawPlayer(ctx, game.player, game.playerInvulnerableUntil, game.activePowerUps.shieldUntil);
        drawParticles(ctx, game.particles);

        if (game.paused) {
            drawPauseOverlay(ctx);
        }
    }

    function drawBackground(ctx, game) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#020617');
        gradient.addColorStop(1, '#111827');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';

        for (let i = 0; i < 70; i += 1) {
            const x = (i * 137) % CANVAS_WIDTH;
            const y = (i * 89 + game.score * 0.08) % CANVAS_HEIGHT;
            ctx.fillRect(x, y, 2, 2);
        }
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