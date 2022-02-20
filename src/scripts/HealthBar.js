import * as PIXI from "pixi.js";

import GameScene from "./GameScene";

function HealthBar() {
    this.scene = new GameScene();
    this.container = new PIXI.Container();
    this.container.position.set(this.scene.container.width, 4);
    this.container.outer = this.outerBar;
    this.innerBar();
    this.outerBar();
}

HealthBar.prototype.innerBar = function () {
    this.innerBar = new PIXI.Graphics();
    this.innerBar.beginFill(0x000000).drawRect(0, 0, 128, 8).endFill();
    this.container.addChild(this.innerBar);
};

HealthBar.prototype.outerBar = function () {
    this.outerBar = new PIXI.Graphics();
    this.outerBar.beginFill(0xff3300).drawRect(0, 0, 128, 8).endFill();
    this.container.addChild(this.outerBar);
};

export default HealthBar;
