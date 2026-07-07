const imagePaths = {
    backgrounds: {
        far: '/assets/backgrounds/bg_layer_1.png',
        middle: '/assets/backgrounds/bg_layer_2.png',
        near: '/assets/backgrounds/bg_layer_3.png'
    },
    ground: {
        tile: '/assets/ground/ground_tile.png'
    },
    player: {
        run: [
            '/assets/player/runner_run_1.png',
            '/assets/player/runner_run_2.png',
            '/assets/player/runner_run_3.png',
            '/assets/player/runner_run_4.png'
        ],
        jump: '/assets/player/runner_jump.png',
        hit: '/assets/player/runner_hit.png'
    },
    obstacles: {
        error404: '/assets/obstacles/error_404.png',
        error500: '/assets/obstacles/error_500.png',
        cors: '/assets/obstacles/cors_bug.png',
        nan: '/assets/obstacles/nan_bug.png',
        merge: '/assets/obstacles/merge_bug.png'
    },
    collectibles: {
        cache: '/assets/collectibles/cache_token.png',
        cookie: '/assets/collectibles/cookie.png',
        shield: '/assets/collectibles/shield_200.png'
    }
};

export function loadGameImages() {
    return {
        backgrounds: {
            far: loadImage(imagePaths.backgrounds.far),
            middle: loadImage(imagePaths.backgrounds.middle),
            near: loadImage(imagePaths.backgrounds.near)
        },
        ground: {
            tile: loadImage(imagePaths.ground.tile)
        },
        player: {
            run: imagePaths.player.run.map(loadImage),
            jump: loadImage(imagePaths.player.jump),
            hit: loadImage(imagePaths.player.hit)
        },
        obstacles: {
            error404: loadImage(imagePaths.obstacles.error404),
            error500: loadImage(imagePaths.obstacles.error500),
            cors: loadImage(imagePaths.obstacles.cors),
            nan: loadImage(imagePaths.obstacles.nan),
            merge: loadImage(imagePaths.obstacles.merge)
        },
        collectibles: {
            cache: loadImage(imagePaths.collectibles.cache),
            cookie: loadImage(imagePaths.collectibles.cookie),
            shield: loadImage(imagePaths.collectibles.shield)
        }
    };
}

function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}