import * as PIXI from "pixi.js";

import Globals from "./Globals";
import KeyEvent from "./Events";
import HealthBar from "./HealthBar";

function GameScene() {
    this.container = new PIXI.Container();
    this.blobs = [];
    this.gameScene();
}

GameScene.prototype.gameScene = function () {
    this.extractSrc = Globals.resources["Field"].textures;

    this.dungeon = new PIXI.Sprite(this.extractSrc["dungeon.png"]);
    this.container.addChild(this.dungeon);

    this.hero = new PIXI.Sprite(this.extractSrc["hero.png"]);
    this.hero.x = 68;
    this.hero.y = this.container.height / 2 - this.hero.height / 2;
    this.hero.vx = 0;
    this.hero.vy = 0;
    this.hero.speed = 2;
    this.container.addChild(this.hero);

    this.door = new PIXI.Sprite(this.extractSrc["door.png"]);
    this.door.position.set(32, 0);
    this.container.addChild(this.door);

    this.treasure = new PIXI.Sprite(this.extractSrc["treasure.png"]);
    this.treasure.x = this.container.width - this.treasure.width - 48;
    this.treasure.y = this.container.height / 2 - this.treasure.height / 2;
    this.container.addChild(this.treasure);

    this.healthBar = new HealthBar();
    this.healthBar.container.position.set(this.container.width - 160, 4);
    this.container.addChild(this.healthBar.container);

    let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150,
        speed = 2,
        direction = 1;

    for (let i = 0; i < numberOfBlobs; i++) {
        const blob = new PIXI.Sprite(this.extractSrc["blob.png"]);

        const x = spacing * i + xOffset;
        const y = this.randomInt(0, this.container.height - blob.height);

        blob.x = x;
        blob.y = y;

        blob.vy = speed * direction;

        direction *= -1;

        this.blobs.push(blob);

        this.container.addChild(blob);
    }

    const left = KeyEvent(37),
        up = KeyEvent(38),
        right = KeyEvent(39),
        down = KeyEvent(40);

    left.press = () => {
        this.hero.vx = -5;
        this.hero.vy = 0;
    };

    left.release = () => {
        if (!right.isDown && this.hero.vy === 0) {
            this.hero.vx = 0;
        }
    };

    up.press = () => {
        this.hero.vy = -5;
        this.hero.vx = 0;
    };

    up.release = () => {
        if (!down.isDown && this.hero.vx === 0) {
            this.hero.vy = 0;
        }
    };

    right.press = () => {
        this.hero.vx = 5;
        this.hero.vy = 0;
    };

    right.release = () => {
        if (!left.isDown && this.hero.vy === 0) {
            this.hero.vx = 0;
        }
    };

    down.press = () => {
        this.hero.vy = 5;
        this.hero.vx = 0;
    };

    down.release = () => {
        if (!up.isDown && this.hero.vx === 0) {
            this.hero.vy = 0;
        }
    };
};

GameScene.prototype.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default GameScene;
