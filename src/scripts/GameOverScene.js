import * as PIXI from "pixi.js";

function GameOverScene() {
    this.container = new PIXI.Container();
    this.message = new PIXI.BitmapText("", { fontName: "Notalot60", fontSize: 48 });
    this.container.addChild(this.message);
    this.container.visible = false;
}

export default GameOverScene;
