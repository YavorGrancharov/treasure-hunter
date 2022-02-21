function HitTestRectangle(rect1, rect2) {
    let hit, halfWidthCombined, halfHeightCombined, vx, vy;

    hit = false;

    rect1.centerX = rect1.x + rect1.width / 2;
    rect1.centerY = rect1.y + rect1.height / 2;
    rect2.centerX = rect2.x + rect2.width / 2;
    rect2.centerY = rect2.y + rect2.height / 2;

    rect1.halfWidth = rect1.width / 2;
    rect1.halfHeight = rect1.height / 2;
    rect2.halfWidth = rect2.width / 2;
    rect2.halfHeight = rect2.height / 2;

    vx = rect1.centerX - rect2.centerX;
    vy = rect1.centerY - rect2.centerY;

    halfWidthCombined = rect1.halfWidth + rect2.halfWidth;
    halfHeightCombined = rect1.halfHeight + rect2.halfHeight;

    if (Math.abs(vx) < halfWidthCombined) {
        if (Math.abs(vy) < halfHeightCombined) {
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }

    return hit;
}

export default HitTestRectangle;
