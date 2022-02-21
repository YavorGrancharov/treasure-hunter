import * as PIXI from "pixi.js";

function Border(c, x, y, w, h, cb, ctx) {
    this.container = new PIXI.Container();
    this.outline = new PIXI.Graphics();
    this.outline.lineStyle(4, c, 1).drawRoundedRect(x, y, w, h, 20).endFill();
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.hitArea = new PIXI.Rectangle(x, y, w, h);
    this.container.on("pointerdown", cb, ctx);
    this.container.addChild(this.outline);
}

export default Border;
