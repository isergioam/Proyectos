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
            '/assets/player/runner_run_1.svg',
            '/assets/player/runner_run_2.svg',
            '/assets/player/runner_run_3.svg',
            '/assets/player/runner_run_4.svg'
        ],
        jump: '/assets/player/runner_jump.svg',
        hit: '/assets/player/runner_hit.svg',
        flap: [
            '/assets/player/runner_flap_1.svg',
            '/assets/player/runner_flap_2.svg'
        ],
        dash: '/assets/player/runner_dash.svg'
    },
    obstacles: {
        error404: '/assets/obstacles/error_404.png',
        error500: '/assets/obstacles/error_500.png',
        cors: [
            '/assets/obstacles/cors_bug_1.png',
            '/assets/obstacles/cors_bug_2.png'
        ],
        nan: '/assets/obstacles/nan_bug.png',
        merge: '/assets/obstacles/merge_bug.png'
    },
    collectibles: {
        cache: '/assets/collectibles/cache_token.png',
        cookie: '/assets/collectibles/cookie.png',
        shield: '/assets/collectibles/shield_200.png'
    }
};

const flatImagePaths = [
    imagePaths.backgrounds.far,
    imagePaths.backgrounds.middle,
    imagePaths.backgrounds.near,
    imagePaths.ground.tile,
    ...imagePaths.player.run,
    imagePaths.player.jump,
    imagePaths.player.hit,
    ...imagePaths.player.flap,
    imagePaths.player.dash,
    imagePaths.obstacles.error404,
    imagePaths.obstacles.error500,
    ...imagePaths.obstacles.cors,
    imagePaths.obstacles.nan,
    imagePaths.obstacles.merge,
    imagePaths.collectibles.cache,
    imagePaths.collectibles.cookie,
    imagePaths.collectibles.shield
];

export function preloadImages() {
    const promises = flatImagePaths.map((src) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = reject;
            image.src = src;
        });
    });

    return Promise.all(promises);
}

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
            hit: loadImage(imagePaths.player.hit),
            flap: imagePaths.player.flap.map(loadImage),
            dash: loadImage(imagePaths.player.dash)
        },
        obstacles: {
            error404: loadImage(imagePaths.obstacles.error404),
            error500: loadImage(imagePaths.obstacles.error500),
            cors: imagePaths.obstacles.cors.map(loadImage),
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