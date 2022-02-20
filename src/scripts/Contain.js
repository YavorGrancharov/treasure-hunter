function Contain(sprite, container) {
    let collision = new Set();

    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision.add("left");
    }

    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision.add("top");
    }

    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision.add("right");
    }

    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision.add("bottom");
    }

    return collision;
}

export default Contain;
