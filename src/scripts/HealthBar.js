import * as PIXI from "pixi.js";

function HealthBar() {
    this.container = new PIXI.Container();
    this.innerBar();
    this.outerBar();
}

HealthBar.prototype.innerBar = function () {
    this.innerBar = new PIXI.Graphics();
    this.innerBar.beginFill(0x000000).drawRect(0, 0, 128, 5).endFill();
    this.container.addChild(this.innerBar);
};

HealthBar.prototype.outerBar = function () {
    this.outerBar = new PIXI.Graphics();
    this.outerBar.beginFill(0xff3300).drawRect(0, 0, 128, 5).endFill();
    this.container.addChild(this.outerBar);
};

export default HealthBar;
