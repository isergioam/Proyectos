import { RUN_ANIMATION_FRAME_TIME } from './constants';

export function getPlayerSprite(player, images, currentTime, gameOver) {
    if (gameOver) {
        return images.player.hit;
    }

    if (player.isDashing) {
        return images.player.dash;
    }

    if (!player.onGround) {
        if (player.isFlapping) {
            const flapFrameIndex = Math.floor(currentTime / 70) % images.player.flap.length;
            return images.player.flap[flapFrameIndex];
        }
        return images.player.jump;
    }

    const frameIndex = Math.floor(currentTime / RUN_ANIMATION_FRAME_TIME) % images.player.run.length;
    return images.player.run[frameIndex];
}