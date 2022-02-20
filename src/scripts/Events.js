function KeyEvent(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.down = (ev) => {
        if (ev.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }

        ev.preventDefault();
    };

    key.up = (ev) => {
        if (ev.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }

        ev.preventDefault();
    };

    window.addEventListener("keydown", key.down.bind(key), false);
    window.addEventListener("keyup", key.up.bind(key), false);

    return key;
}

export default KeyEvent;
