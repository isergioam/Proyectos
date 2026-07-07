import { useEffect, useRef } from 'react';
import { playSound, playFartSound } from '../game/sounds';
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    DISTANCE_SCORE_MULTIPLIER,
    GRAVITY,
    GROUND_Y,
    INITIAL_WORLD_SPEED,
    JUMP_FORCE,
    MAX_FLAP_TIME,
    MAX_WORLD_SPEED,
    OBSTACLE_SPAWN_INTERVAL,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_X,
    HIT_FREEZE_TIME,
    COLLECTIBLE_SPAWN_INTERVAL,
    COLLECTIBLE_WIDTH,
    COLLECTIBLE_HEIGHT,
    COLLECTIBLE_POINTS
} from '../game/constants';
import { isColliding } from '../game/collisions';
import { loadGameImages } from '../game/assets';
import { getPlayerSprite } from '../game/animations';

const images = loadGameImages();

function RunnerCanvas({ onStatsChange, onGameOver, onPauseChange }) {
    const canvasRef = useRef(null);
    const gameRef = useRef(createInitialGameState());
    const keysRef = useRef({});
    const animationFrameRef = useRef(null);
    const previousTimeRef = useRef(0);
    const gameOverSentRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        function handleKeyDown(event) {
            const key = event.key.toLowerCase();

            if (key === ' ' || key === 'arrowup' || key === 'arrowright' || key === 'shift') {
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

        function gameLoop(currentTime) {
            if (!previousTimeRef.current) {
                previousTimeRef.current = currentTime;
            }

            const deltaTime = Math.min((currentTime - previousTimeRef.current) / 16.67, 2);
            previousTimeRef.current = currentTime;

            const game = gameRef.current;

            if (!game.paused && !game.gameOver) {
                updateGame(game, keysRef.current, deltaTime, currentTime);
                onStatsChange({
                    score: game.score,
                    distance: game.distance,
                    speed: game.worldSpeed / INITIAL_WORLD_SPEED,
                    paused: game.paused
                });
            }

            drawGame(ctx, game, currentTime);

            if (game.gameOver && !gameOverSentRef.current) {
                const canSendGameOver = !game.hitAt || currentTime - game.hitAt >= HIT_FREEZE_TIME;

                if (canSendGameOver) {
                    gameOverSentRef.current = true;
                    playSound('gameover');
                    onGameOver({
                        score: game.score,
                        distance: game.distance,
                        speed: game.worldSpeed / INITIAL_WORLD_SPEED
                    });
                }
            }

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [onGameOver, onPauseChange, onStatsChange]);

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

function createInitialGameState() {
    return {
        shieldActive: false,
        lastCollectibleSpawnAt: 0,
        collectibles: [],
        collectiblesCollected: 0,
        hitAt: null,
        score: 0,
        distance: 0,
        worldSpeed: INITIAL_WORLD_SPEED,
        paused: false,
        gameOver: false,
        lastObstacleSpawnAt: 0,
        jumpPressedLastFrame: false,
        player: {
            x: PLAYER_X,
            y: GROUND_Y - PLAYER_HEIGHT,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            vy: 0,
            onGround: true,
            isFlapping: false,
            flapTimeRemaining: MAX_FLAP_TIME,
            isDashing: false,
            dashTimeRemaining: 0,
            hasDashed: false,
            jumpsAvailable: 2
        },
        obstacles: [],
        particles: [],
        backgroundOffsets: {
            far: 0,
            middle: 0,
            near: 0,
            ground: 0
        }
    };
}

function updateGame(game, keys, deltaTime, currentTime) {
    updateSpeed(game);
    updateDistanceAndScore(game, deltaTime);
    updateBackgroundOffsets(game, deltaTime);
    updatePlayer(game, keys, deltaTime);
    updateParticles(game, deltaTime);
    spawnObstacles(game, currentTime);
    updateObstacles(game, deltaTime);
    checkObstacleCollisions(game);
    spawnCollectibles(game, currentTime);
    updateCollectibles(game, deltaTime);
    checkCollectibleCollisions(game);
}

function spawnCollectibles(game, currentTime) {
    if (currentTime - game.lastCollectibleSpawnAt < COLLECTIBLE_SPAWN_INTERVAL) {
        return;
    }

    game.lastCollectibleSpawnAt = currentTime;

    const types = [
        { type: 'cache', imageKey: 'cache', points: COLLECTIBLE_POINTS },
        { type: 'cookie', imageKey: 'cookie', points: COLLECTIBLE_POINTS },
        { type: 'shield', imageKey: 'shield', points: 0 }
    ];

    const selectedType = types[Math.floor(Math.random() * types.length)];

    game.collectibles.push({
        ...selectedType,
        x: CANVAS_WIDTH + 30,
        y: randomBetween(210, GROUND_Y - 110),
        width: COLLECTIBLE_WIDTH,
        height: COLLECTIBLE_HEIGHT
    });
}

function updateCollectibles(game, deltaTime) {
    game.collectibles = game.collectibles
        .map((collectible) => ({
            ...collectible,
            x: collectible.x - game.worldSpeed * deltaTime
        }))
        .filter((collectible) => collectible.x + collectible.width > -60);
}

function checkCollectibleCollisions(game) {
    const collectedIndexes = new Set();

    game.collectibles.forEach((collectible, index) => {
        if (isColliding(game.player, collectible)) {
            game.score += collectible.points;
            game.collectiblesCollected += 1;
            collectedIndexes.add(index);
            playSound('collect');
        }

        if (collectible.type === 'shield') {
            game.shieldActive = true;
            playSound('shield');
        } else {
            game.score += collectible.points;
            playSound('collect');
        }
    });

    game.collectibles = game.collectibles.filter((_, index) => !collectedIndexes.has(index));
}

function drawCollectibles(ctx, collectibles) {
    collectibles.forEach((collectible) => {
        const sprite = images.collectibles[collectible.imageKey];
        ctx.drawImage(sprite, collectible.x, collectible.y, collectible.width, collectible.height);
    });
}

function updateSpeed(game) {
    game.worldSpeed = Math.min(
        MAX_WORLD_SPEED,
        INITIAL_WORLD_SPEED + game.distance / 250
    );
}

function updateDistanceAndScore(game, deltaTime) {
    game.distance += game.worldSpeed * deltaTime * 0.12;
    game.score = Math.floor(game.distance * DISTANCE_SCORE_MULTIPLIER);
}

function updateBackgroundOffsets(game, deltaTime) {
    game.backgroundOffsets.far = (game.backgroundOffsets.far + game.worldSpeed * 0.25 * deltaTime) % CANVAS_WIDTH;
    game.backgroundOffsets.middle = (game.backgroundOffsets.middle + game.worldSpeed * 0.45 * deltaTime) % CANVAS_WIDTH;
    game.backgroundOffsets.near = (game.backgroundOffsets.near + game.worldSpeed * 0.75 * deltaTime) % CANVAS_WIDTH;
    game.backgroundOffsets.ground = (game.backgroundOffsets.ground + game.worldSpeed * deltaTime) % 128;
}

function updatePlayer(game, keys, deltaTime) {
    const player = game.player;
    const wantsToJump = keys[' '] || keys.w || keys.arrowup;
    const wantsToDash = keys.shift || keys.d || keys.arrowright || keys.control;

    // Handle Jump & Double Jump
    if (wantsToJump && !game.jumpPressedLastFrame && player.jumpsAvailable > 0) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
        player.flapTimeRemaining = MAX_FLAP_TIME;
        player.hasDashed = false;
        player.jumpsAvailable -= 1;

        if (player.jumpsAvailable === 1) {
            playSound('jump');
        } else {
            playSound('doublejump');
        }
    }

    game.jumpPressedLastFrame = Boolean(wantsToJump);

    // Trigger Dash (only mid-air, only once per jump)
    if (!player.onGround && wantsToDash && !player.hasDashed && !player.isDashing) {
        player.isDashing = true;
        player.dashTimeRemaining = 14; // dash duration (approx 230ms)
        player.hasDashed = true;
        player.vy = 0; // freeze vertical movement initially
        playFartSound();
        // Burst of fart particles!
        for (let i = 0; i < 18; i++) {
            game.particles.push(createFartParticle(player.x, player.y + player.height - 18));
        }
    }

    let currentGravity = GRAVITY;
    player.isFlapping = false;

    if (player.isDashing) {
        currentGravity = 0;
        player.vy = 0; // maintain height
        player.dashTimeRemaining = Math.max(0, player.dashTimeRemaining - deltaTime);
        // Thrust the player forward relative to the screen
        player.x = Math.min(PLAYER_X + 160, player.x + 13 * deltaTime);

        // Emit continuous fart trail!
        if (Math.random() < 0.7) {
            game.particles.push(createFartParticle(player.x, player.y + player.height - 18));
        }

        if (player.dashTimeRemaining <= 0) {
            player.isDashing = false;
        }
    } else {
        // Normal mid-air behavior (flapping or falling)
        if (!player.onGround && wantsToJump && player.flapTimeRemaining > 0) {
            player.isFlapping = true;
            player.flapTimeRemaining = Math.max(0, player.flapTimeRemaining - deltaTime);
            currentGravity = GRAVITY * 0.22;
            if (player.vy > 1.2) {
                player.vy = 1.2;
            }
        }

        // Slide back to default X position smoothly
        if (player.x > PLAYER_X) {
            player.x = Math.max(PLAYER_X, player.x - 3.5 * deltaTime);
        }
    }

    player.vy += currentGravity * deltaTime;
    player.y += player.vy * deltaTime;

    // Land on ground
    if (player.y + player.height >= GROUND_Y) {
        player.y = GROUND_Y - player.height;
        player.vy = 0;
        player.onGround = true;
        player.flapTimeRemaining = MAX_FLAP_TIME;
        player.isFlapping = false;
        player.hasDashed = false;
        player.isDashing = false;
        player.jumpsAvailable = 2; // Reset jumps on ground
    }
}

function spawnObstacles(game, currentTime) {
    const interval = Math.max(520, OBSTACLE_SPAWN_INTERVAL - game.distance * 0.8);

    if (currentTime - game.lastObstacleSpawnAt < interval) {
        return;
    }

    game.lastObstacleSpawnAt = currentTime;
    game.obstacles.push(createObstacle());
}

function createObstacle() {
    const obstacleTypes = [
        { type: '404', imageKey: 'error404', width: 52, height: 62 },
        { type: '500', imageKey: 'error500', width: 58, height: 74 },
        { type: 'cors', imageKey: 'cors', width: 70, height: 52 },
        { type: 'nan', imageKey: 'nan', width: 48, height: 50 },
        { type: 'merge', imageKey: 'merge', width: 76, height: 68 }
    ];

    const selectedType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    return {
        ...selectedType,
        x: CANVAS_WIDTH + 30,
        y: GROUND_Y - selectedType.height
    };
}

function updateObstacles(game, deltaTime) {
    game.obstacles = game.obstacles
        .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - game.worldSpeed * deltaTime
        }))
        .filter((obstacle) => obstacle.x + obstacle.width > -80);
}

function checkObstacleCollisions(game) {
    const obstacleIndex = game.obstacles.findIndex((obstacle) => {
        return isColliding(game.player, obstacle);
    });

    if (obstacleIndex === -1) {
        return;
    }

    if (game.shieldActive) {
        game.shieldActive = false;
        game.obstacles.splice(obstacleIndex, 1);
        playSound('shield');
        return;
    }

    playSound('hit');
    game.hitAt = performance.now();
    game.gameOver = true;
}

function drawShield(ctx, player) {
    ctx.save();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#22d3ee';
    ctx.beginPath();
    ctx.arc(
        player.x + player.width / 2,
        player.y + player.height / 2,
        Math.max(player.width, player.height) * 0.72,
        0,
        Math.PI * 2
    );
    ctx.stroke();
    ctx.restore();
}

function drawGame(ctx, game, currentTime) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawParallaxBackground(ctx, game.backgroundOffsets);
    drawGround(ctx, game.backgroundOffsets.ground);
    drawParticles(ctx, game.particles);
    drawCollectibles(ctx, game.collectibles);
    drawObstacles(ctx, game.obstacles);
    drawPlayer(ctx, game.player, currentTime, game.gameOver);
    if (game.shieldActive) {
        drawShield(ctx, game.player);
    }
    if (game.paused) {
        drawPauseOverlay(ctx);
    }
}

function drawParallaxBackground(ctx, offsets) {
    drawRepeatingImage(ctx, images.backgrounds.far, -offsets.far, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawRepeatingImage(ctx, images.backgrounds.middle, -offsets.middle, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawRepeatingImage(ctx, images.backgrounds.near, -offsets.near, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGround(ctx, offset) {
    const tile = images.ground.tile;
    const tileWidth = 128;
    const tileHeight = CANVAS_HEIGHT - GROUND_Y;

    for (let x = -offset; x < CANVAS_WIDTH + tileWidth; x += tileWidth) {
        ctx.drawImage(tile, x, GROUND_Y, tileWidth, tileHeight);
    }
}

function drawPlayer(ctx, player, currentTime, gameOver) {
    const sprite = getPlayerSprite(player, images, currentTime, gameOver);
    ctx.drawImage(sprite, player.x, player.y, player.width, player.height);
}

function drawObstacles(ctx, obstacles) {
    obstacles.forEach((obstacle) => {
        const sprite = images.obstacles[obstacle.imageKey];
        ctx.drawImage(sprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawRepeatingImage(ctx, image, offsetX, y, width, height) {
    ctx.drawImage(image, offsetX, y, width, height);
    ctx.drawImage(image, offsetX + width, y, width, height);
}

function drawPauseOverlay(ctx) {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 48px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSA', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    ctx.font = '18px system-ui';
    ctx.fillText('Pulsa P para continuar', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 42);
}

function createFartParticle(x, y) {
    return {
        x: x,
        y: y,
        vx: -(Math.random() * 4 + 3), // blow backwards fast
        vy: (Math.random() * 2.4 - 1.2),  // float slightly up/down
        radius: Math.random() * 8 + 6,
        alpha: 1.0,
        color: `hsla(${Math.random() * 25 + 75}, 85%, 42%, `, // yellowish-green gas
        decay: Math.random() * 0.05 + 0.03
    };
}

function updateParticles(game, deltaTime) {
    game.particles = game.particles
        .map((p) => ({
            ...p,
            x: p.x + p.vx * deltaTime,
            y: p.y + p.vy * deltaTime,
            radius: p.radius + 0.5 * deltaTime, // expand!
            alpha: Math.max(0, p.alpha - p.decay * deltaTime)
        }))
        .filter((p) => p.alpha > 0);
}

function drawParticles(ctx, particles) {
    particles.forEach((p) => {
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

export default RunnerCanvas;