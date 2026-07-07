import { RUN_ANIMATION_FRAME_TIME } from './constants';

export function getPlayerSprite(player, images, currentTime, gameOver) {
    if (gameOver) {
        return images.player.hit;
    }

    if (!player.onGround) {
        return images.player.jump;
    }

    const frameIndex = Math.floor(currentTime / RUN_ANIMATION_FRAME_TIME) % images.player.run.length;
    return images.player.run[frameIndex];
}