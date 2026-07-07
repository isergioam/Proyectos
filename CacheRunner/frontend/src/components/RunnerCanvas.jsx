import { useEffect, useRef } from 'react';
import {
    playSound,
    playFartSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    setMusicPlaybackRate
} from '../game/sounds';
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

        startBackgroundMusic();

        function handleKeyDown(event) {
            const key = event.key.toLowerCase();

            if (key === ' ' || key === 'arrowup' || key === 'arrowright' || key === 'shift') {
                event.preventDefault();
            }

            if (key === 'p') {
                gameRef.current.paused = !gameRef.current.paused;
                onPauseChange(gameRef.current.paused);
                if (gameRef.current.paused) {
                    pauseBackgroundMusic();
                } else {
                    resumeBackgroundMusic();
                }
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
            } else if (game.gameOver) {
                if (game.gameOverAnimProgress === undefined) {
                    game.gameOverAnimProgress = 0;
                    game.splatActive = false;
                    game.splatSlideY = 0;
                }
                if (game.gameOverAnimProgress < 1.0) {
                    game.gameOverAnimProgress += 0.024 * deltaTime;
                    if (game.gameOverAnimProgress >= 1.0) {
                        game.gameOverAnimProgress = 1.0;
                        game.splatActive = true;
                    }
                } else {
                    game.splatSlideY += 0.8 * deltaTime;
                }
            }

            drawGame(ctx, game, currentTime);

            if (game.gameOver && !gameOverSentRef.current) {
                const canSendGameOver = !game.hitAt || currentTime - game.hitAt >= HIT_FREEZE_TIME;

                if (canSendGameOver) {
                    gameOverSentRef.current = true;
                    playSound('gameover');
                    stopBackgroundMusic();
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
            stopBackgroundMusic();
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
        overclockActive: false,
        overclockTimeRemaining: 0,
        streakCount: 0,
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
        platforms: [],
        lastPlatformSpawnAt: 0,
        binaryDrops: Array.from({ length: 40 }, () => ({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            speedY: Math.random() * 2 + 1.5,
            speedX: Math.random() * 0.5 + 0.2,
            char: Math.random() < 0.5 ? '0' : '1',
            size: Math.floor(Math.random() * 6 + 10)
        })),
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
            extraNear: 0,
            ground: 0
        }
    };
}

function updateGame(game, keys, deltaTime, currentTime) {
    if (game.overclockActive) {
        game.overclockTimeRemaining -= deltaTime * 16.67;
        if (game.overclockTimeRemaining <= 0) {
            game.overclockActive = false;
            game.streakCount = 0;
            setMusicPlaybackRate(1.0);
        }
    }

    updateSpeed(game);
    updateDistanceAndScore(game, deltaTime);
    updateBackgroundOffsets(game, deltaTime);
    updatePlayer(game, keys, deltaTime);
    updateParticles(game, deltaTime);
    updateBinaryDrops(game, deltaTime);
    spawnObstacles(game, currentTime);
    updateObstacles(game, deltaTime);
    spawnPlatforms(game, currentTime);
    updatePlatforms(game, deltaTime);
    checkObstacleCollisions(game);
    checkNearMisses(game);
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
            collectedIndexes.add(index);
            if (collectible.type === 'shield') {
                game.shieldActive = true;
                playSound('shield');
                for (let i = 0; i < 8; i++) {
                    game.particles.push(createCollectParticle(collectible.x, collectible.y, 'SHIELD'));
                }
            } else {
                const earnedPoints = game.overclockActive ? collectible.points * 2 : collectible.points;
                game.score += earnedPoints;
                game.collectiblesCollected += 1;
                playSound('collect');
                
                game.streakCount += 1;
                
                if (game.streakCount >= 5 && !game.overclockActive) {
                    game.overclockActive = true;
                    game.overclockTimeRemaining = 8000;
                    playSound('save');
                    setMusicPlaybackRate(1.35);
                }
                
                const particleText = game.overclockActive ? `X2 +${earnedPoints}` : `+${earnedPoints}`;
                const words = [particleText, '01', '10', 'OK', 'GET', '200'];
                for (let i = 0; i < 8; i++) {
                    const randWord = words[Math.floor(Math.random() * words.length)];
                    game.particles.push(createCollectParticle(collectible.x, collectible.y, randWord));
                }
            }
        }
    });

    game.collectibles = game.collectibles.filter((_, index) => !collectedIndexes.has(index));
}

function drawCollectibles(ctx, collectibles) {
    collectibles.forEach((collectible) => {
        const sprite = images.collectibles[collectible.imageKey];
        if (sprite) {
            ctx.drawImage(sprite, collectible.x, collectible.y, collectible.width, collectible.height);
        }
    });
}

function updateSpeed(game) {
    let targetSpeed = INITIAL_WORLD_SPEED + game.distance / 250;
    if (game.overclockActive) {
        targetSpeed += 6;
    }
    game.worldSpeed = Math.min(
        MAX_WORLD_SPEED + (game.overclockActive ? 6 : 0),
        targetSpeed
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
    game.backgroundOffsets.extraNear = (game.backgroundOffsets.extraNear + game.worldSpeed * 0.85 * deltaTime) % CANVAS_WIDTH;
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
            game.particles.push(createShockwave(player.x + player.width / 2, player.y + player.height - 10));
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

    // Land on platform
    let onPlatform = false;
    game.platforms.forEach((platform) => {
        const playerBottom = player.y + player.height;
        const prevPlayerBottom = playerBottom - player.vy * deltaTime;
        
        if (
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.vy >= 0 &&
            prevPlayerBottom <= platform.y + 6 &&
            playerBottom >= platform.y
        ) {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.onGround = true;
            player.flapTimeRemaining = MAX_FLAP_TIME;
            player.isFlapping = false;
            player.hasDashed = false;
            player.isDashing = false;
            player.jumpsAvailable = 2;
            onPlatform = true;
        }
    });

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
    } else if (!onPlatform) {
        player.onGround = false;
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

function spawnPlatforms(game, currentTime) {
    if (!game.lastPlatformSpawnAt) {
        game.lastPlatformSpawnAt = currentTime;
    }
    const spawnInterval = 4500;
    if (currentTime - game.lastPlatformSpawnAt > spawnInterval) {
        const isHitActive = game.hitAt && (currentTime - game.hitAt < HIT_FREEZE_TIME);
        if (!isHitActive) {
            const platformY = randomBetween(230, 270);
            const platformWidth = randomBetween(160, 240);
            
            game.platforms.push({
                x: CANVAS_WIDTH,
                y: platformY,
                width: platformWidth,
                height: 20
            });

            const isShield = Math.random() < 0.22;
            const itemType = isShield 
                ? { type: 'shield', imageKey: 'shield', points: 0 }
                : Math.random() < 0.5 
                    ? { type: 'cache', imageKey: 'cache', points: COLLECTIBLE_POINTS }
                    : { type: 'cookie', imageKey: 'cookie', points: COLLECTIBLE_POINTS };

            game.collectibles.push({
                ...itemType,
                x: CANVAS_WIDTH + platformWidth / 2 - COLLECTIBLE_WIDTH / 2,
                y: platformY - COLLECTIBLE_HEIGHT - 6,
                width: COLLECTIBLE_WIDTH,
                height: COLLECTIBLE_HEIGHT
            });

            game.lastPlatformSpawnAt = currentTime;
        }
    }
}

function updatePlatforms(game, deltaTime) {
    game.platforms = game.platforms
        .map((p) => ({
            ...p,
            x: p.x - game.worldSpeed * deltaTime
        }))
        .filter((p) => p.x + p.width > -50);
}

function checkObstacleCollisions(game) {
    const obstacleIndex = game.obstacles.findIndex((obstacle) => {
        return isColliding(game.player, obstacle);
    });

    if (obstacleIndex === -1) {
        return;
    }

    game.streakCount = 0;
    if (game.overclockActive) {
        game.overclockActive = false;
        setMusicPlaybackRate(1.0);
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

function checkNearMisses(game) {
    game.obstacles.forEach((obstacle) => {
        if (obstacle.nearMissAwarded) return;

        // Expanded player box for close-proximity detection
        const expandedPlayer = {
            x: game.player.x - 22,
            y: game.player.y - 22,
            width: game.player.width + 44,
            height: game.player.height + 44
        };

        if (isColliding(expandedPlayer, obstacle) && !isColliding(game.player, obstacle)) {
            const playerCenter = game.player.x + game.player.width / 2;
            const obstacleCenter = obstacle.x + obstacle.width / 2;
            
            if (playerCenter > obstacleCenter) {
                obstacle.nearMissAwarded = true;
                game.score += 50;
                playSound('save');
                
                for (let i = 0; i < 4; i++) {
                    game.particles.push(createCollectParticle(
                        obstacle.x + obstacle.width / 2,
                        obstacle.y - 25,
                        'NEAR MISS! +50'
                    ));
                }
            }
        }
    });
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
    const isHitActive = game.hitAt && (currentTime - game.hitAt < HIT_FREEZE_TIME);
    ctx.save();
    if (isHitActive) {
        const shakeX = (Math.random() - 0.5) * 12;
        const shakeY = (Math.random() - 0.5) * 12;
        ctx.translate(shakeX, shakeY);
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawParallaxBackground(ctx, game.backgroundOffsets);
    drawBinaryRain(ctx, game);
    drawGround(ctx, game.backgroundOffsets.ground);
    drawNeonGrid(ctx, game);
    drawParticles(ctx, game.particles);
    drawCollectibles(ctx, game.collectibles);
    drawObstacles(ctx, game.obstacles, currentTime);
    drawPlatforms(ctx, game.platforms);
    drawPlayer(ctx, game.player, currentTime, game.gameOver);
    
    if (game.shieldActive) {
        drawShield(ctx, game.player);
    }
    
    if (game.player.isDashing) {
        drawDashSpeedLines(ctx, game);
    }
    
    drawDashCooldown(ctx, game.player);
    drawOverclockHUD(ctx, game);

    if (game.paused) {
        drawPauseOverlay(ctx);
    }

    if (isHitActive) {
        drawGlitchOverlay(ctx);
    }

    drawGameOverSplat(ctx, game, currentTime);

    ctx.restore();
}

function drawParallaxBackground(ctx, offsets) {
    drawRepeatingImage(ctx, images.backgrounds.far, -offsets.far, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawRepeatingImage(ctx, images.backgrounds.middle, -offsets.middle, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawRepeatingImage(ctx, images.backgrounds.near, -offsets.near, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawRepeatingImage(ctx, images.backgrounds.extraNear, -offsets.extraNear, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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

function drawObstacles(ctx, obstacles, currentTime) {
    obstacles.forEach((obstacle) => {
        const spriteData = images.obstacles[obstacle.imageKey];
        const sprite = Array.isArray(spriteData)
            ? spriteData[Math.floor(currentTime / 160) % spriteData.length]
            : spriteData;

        if (sprite) {
            ctx.drawImage(sprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}

function drawPlatforms(ctx, platforms) {
    platforms.forEach((platform) => {
        ctx.save();
        // Grass top
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(platform.x, platform.y, platform.width, 6);
        // Soil bottom
        ctx.fillStyle = '#78350f';
        ctx.fillRect(platform.x, platform.y + 6, platform.width, platform.height - 6);
        // Border
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        ctx.restore();
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

function createShockwave(x, y) {
    return {
        type: 'shockwave',
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        radius: 10,
        alpha: 1.0,
        color: 'rgba(34, 211, 238, ',
        decay: 0.05
    };
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

function createCollectParticle(x, y, text) {
    return {
        type: 'text',
        text: text,
        x: x,
        y: y,
        vx: (Math.random() * 4 - 2), // expand outwards
        vy: -(Math.random() * 3 + 2), // float upwards
        alpha: 1.0,
        color: Math.random() < 0.5 ? '#22c55e' : '#06b6d4', // green or cyan
        decay: Math.random() * 0.03 + 0.02,
        size: Math.floor(Math.random() * 6 + 12)
    };
}

function updateParticles(game, deltaTime) {
    game.particles = game.particles
        .map((p) => ({
            ...p,
            x: p.x + p.vx * deltaTime,
            y: p.y + p.vy * deltaTime,
            radius: p.type === 'text'
                ? 0
                : p.type === 'shockwave'
                    ? p.radius + 4.0 * deltaTime
                    : p.radius + 0.5 * deltaTime, // expand if circular
            alpha: Math.max(0, p.alpha - p.decay * deltaTime)
        }))
        .filter((p) => p.alpha > 0);
}

function drawParticles(ctx, particles) {
    particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.type === 'text') {
            ctx.fillStyle = p.color;
            ctx.font = `bold ${p.size}px monospace`;
            ctx.fillText(p.text, p.x, p.y);
        } else if (p.type === 'shockwave') {
            ctx.strokeStyle = p.color + p.alpha + ')';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    });
}

function updateBinaryDrops(game, deltaTime) {
    game.binaryDrops.forEach((drop) => {
        drop.y += drop.speedY * deltaTime;
        drop.x -= (game.worldSpeed * 0.3 + drop.speedX) * deltaTime;

        if (drop.y > CANVAS_HEIGHT) {
            drop.y = -20;
            drop.x = Math.random() * CANVAS_WIDTH;
        }
        if (drop.x < -20) {
            drop.x = CANVAS_WIDTH + 20;
            drop.y = Math.random() * CANVAS_HEIGHT;
        }
    });
}

function drawBinaryRain(ctx, game) {
    ctx.save();
    ctx.fillStyle = game.overclockActive ? 'rgba(239, 68, 68, 0.45)' : 'rgba(34, 197, 94, 0.28)'; // neon red vs neon green
    game.binaryDrops.forEach((drop) => {
        ctx.font = `${drop.size}px monospace`;
        ctx.fillText(drop.char, drop.x, drop.y);
    });
    ctx.restore();
}

function drawNeonGrid(ctx, game) {
    const groundY = GROUND_Y;
    ctx.save();
    ctx.strokeStyle = game.overclockActive ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.22)'; // wireframe grid
    ctx.lineWidth = 1.5;

    // Horizontal perspective lines
    const lineSpacing = [8, 20, 36, 56, 80];
    lineSpacing.forEach((yOffset) => {
        ctx.beginPath();
        ctx.moveTo(0, groundY + yOffset);
        ctx.lineTo(CANVAS_WIDTH, groundY + yOffset);
        ctx.stroke();
    });

    // Vertical lines with perspective slant
    const scrollOffset = game.backgroundOffsets.ground;
    const spacing = 64;
    for (let x = -scrollOffset; x < CANVAS_WIDTH + spacing; x += spacing) {
        ctx.beginPath();
        const topX = x;
        const bottomX = x + (x - CANVAS_WIDTH / 2) * 0.45;
        ctx.moveTo(topX, groundY);
        ctx.lineTo(bottomX, CANVAS_HEIGHT);
        ctx.stroke();
    }
    ctx.restore();
}

function drawDashSpeedLines(ctx, game) {
    ctx.save();
    ctx.strokeStyle = game.overclockActive ? 'rgba(239, 68, 68, 0.75)' : 'rgba(34, 211, 238, 0.55)'; // neon red vs cian speed line
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
        const y = Math.random() * (GROUND_Y - 50) + 20;
        const length = Math.random() * 150 + 80;
        const x = Math.random() * CANVAS_WIDTH;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length, y);
        ctx.stroke();
    }
    ctx.restore();
}

function drawOverclockHUD(ctx, game) {
    if (!game.overclockActive) return;
    
    ctx.save();
    const flash = Math.floor(performance.now() / 250) % 2 === 0;
    ctx.fillStyle = flash ? '#ef4444' : '#f97316';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ef4444';
    ctx.fillText('OVERCLOCK ACTIVE [2X POINTS]', CANVAS_WIDTH / 2, 40);
    
    const w = 180;
    const h = 8;
    const x = CANVAS_WIDTH / 2 - w / 2;
    const y = 48;
    
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    
    const ratio = Math.max(0, game.overclockTimeRemaining / 8000);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 1, y + 1, (w - 2) * ratio, h - 2);
    ctx.restore();
}

function drawDashCooldown(ctx, player) {
    if (player.onGround) return;
    const x = player.x + player.width / 2 - 15;
    const y = player.y - 15;
    const w = 30;
    const h = 6;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    const isReady = !player.hasDashed && !player.isDashing;
    ctx.fillStyle = isReady ? '#22c55e' : '#ef4444';
    const fillWidth = isReady ? w - 2 : 2;
    ctx.fillRect(x + 1, y + 1, fillWidth, h - 2);
    ctx.restore();
}

function drawGlitchOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
    ctx.lineWidth = 1;
    for (let y = 0; y < CANVAS_HEIGHT; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CRITICAL_SYSTEM_ERROR', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
    ctx.restore();
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function drawGameOverSplat(ctx, game, currentTime) {
    if (!game.gameOver || game.gameOverAnimProgress === undefined) return;

    ctx.save();
    
    const progress = game.gameOverAnimProgress;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    if (progress < 1.0) {
        // Zooming in smoothly to match the final scale
        const scale = progress * 13.5; 
        const width = PLAYER_WIDTH * scale;
        const height = PLAYER_HEIGHT * scale;
        const angle = progress * Math.PI * 4.5; 
        
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        const hitSprite = images.player.hit;
        if (hitSprite) {
            ctx.drawImage(hitSprite, -width / 2, -height / 2, width, height);
        }
    } else {
        const splatY = centerY + game.splatSlideY;
        
        drawGlassCracks(ctx, centerX, centerY);
        
        // Massive, impactful squashed size!
        const squashW = PLAYER_WIDTH * 15.0;
        const squashH = PLAYER_HEIGHT * 9.5;
        
        const hitSprite = images.player.hit;
        if (hitSprite) {
            const wiggle = Math.sin(currentTime * 0.008) * 0.08;
            ctx.translate(centerX, splatY);
            ctx.rotate(wiggle);
            ctx.drawImage(hitSprite, -squashW / 2, -squashH / 2, squashW, squashH);
        }
    }
    
    ctx.restore();
}

function drawGlassCracks(ctx, cx, cy) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 3.0;
    
    // Crack lines going all the way to the screen edges
    const lines = [
        [ [0,0], [-80, -60], [-180, -120], [-290, -180], [-cx, -cy] ],
        [ [0,0], [90, -50], [200, -110], [310, -190], [CANVAS_WIDTH - cx, -cy] ],
        [ [0,0], [-70, 70], [-160, 150], [-270, 220], [-cx, CANVAS_HEIGHT - cy] ],
        [ [0,0], [80, 80], [190, 160], [290, 210], [CANVAS_WIDTH - cx, CANVAS_HEIGHT - cy] ],
        [ [0,0], [10, -90], [-20, -180], [0, -cy] ],
        [ [0,0], [-15, 80], [25, 170], [0, CANVAS_HEIGHT - cy] ],
        [ [0,0], [-90, -10], [-180, 15], [-cx, 0] ],
        [ [0,0], [100, 5], [210, -10], [CANVAS_WIDTH - cx, 0] ]
    ];
    
    lines.forEach((crack) => {
        ctx.beginPath();
        ctx.moveTo(cx + crack[0][0], cy + crack[0][1]);
        for (let i = 1; i < crack.length; i++) {
            ctx.lineTo(cx + crack[i][0], cy + crack[i][1]);
        }
        ctx.stroke();
    });
    
    // Large spiderweb concentric cracks covering the screen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = 1.8;
    [45, 95, 165, 260, 380].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    });
    
    ctx.restore();
}

export default RunnerCanvas;