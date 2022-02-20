import * as PIXI from "pixi.js";

import Loader from "./Loader";
import Globals from "./Globals";
import GameScene from "./GameScene";
import GameOverScene from "./GameOverScene";
import Assets from "./Assets";
import Contain from "./Contain";
import HitTestRectangle from "./HitTestRectangle";
import HealthBar from "./HealthBar";

function App() {
    const ratio = window.innerWidth / window.innerHeight;

    this.app = new PIXI.Application({
        width: window.innerWidth / 2,
        height: (window.innerHeight / 2) * ratio,
        antialias: true,
        resolution: 1,
    });

    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoDensity = true;
}

App.prototype.run = function () {
    document.getElementById("root").appendChild(this.app.view);
    this.assets = Assets;

    this.loader = new Loader(PIXI.Loader.shared);
    this.loader.preload().then(() => this.start());
};

App.prototype.start = function () {
    this.gameName = new PIXI.BitmapText("Treasure Hunter", { fontName: "Notalot60", tint: 0xffffff, fontSize: 48 });
    this.app.stage.addChild(this.gameName);

    this.gameScene = new GameScene();
    this.gameScene.container.scale.set(this.app.view.width / this.gameScene.container.width);
    this.app.stage.addChild(this.gameScene.container);

    this.gameOverScene = new GameOverScene();
    this.app.stage.addChild(this.gameOverScene.container);

    this.state = this.play;

    this.app.ticker.add((dt) => this.gameLoop(dt));
};

App.prototype.play = function () {
    this.healthBar = new HealthBar();
    this.app.stage.addChild(this.healthBar.container);

    this.gameScene.hero.x += this.gameScene.hero.vx;
    this.gameScene.hero.y += this.gameScene.hero.vy;

    Contain(this.gameScene.hero, { x: 28, y: 10, width: 488, height: 480 });

    let heroHit = false;

    this.gameScene.blobs.forEach((blob) => {
        blob.y += blob.vy;

        const blobHitWall = Contain(blob, { x: 28, y: 10, width: 488, height: 480 });

        if (blobHitWall.has("top") || blobHitWall.has("bottom")) {
            blob.vy *= -1;
        }

        if (HitTestRectangle(this.gameScene.hero, blob)) {
            heroHit = true;
        }
    });

    if (heroHit) {
        this.gameScene.hero.alpha = 0.5;

        this.healthBar.outer -=1
    } else {
        this.gameScene.hero.alpha = 1;
    }

    if (HitTestRectangle(this.gameScene.hero, this.gameScene.chest)) {
        this.gameScene.chest.x = this.gameScene.hero.x + 8;
        this.gameScene.chest.y = this.gameScene.hero.y + 8;
    }

    if (this.healthBar.con < 0) {
        this.state = this.end;
        this.gameOverScene.message.text = "You Lost!";
    }

    if (HitTestRectangle(this.gameScene.chest, this.gameScene.door)) {
        this.state = this.end;
        this.gameOverScene.message.text = "You Won!";
    }
};

App.prototype.end = function () {
    this.gameScene.container.visible = false;
    this.gameOverScene.container.visible = true;
};

App.prototype.gameLoop = function (dt) {
    this.state(dt);
};

export default App;