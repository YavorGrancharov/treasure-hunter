import * as PIXI from "pixi.js";

import Loader from "./Loader";
import GameScene from "./GameScene";
import GameOverScene from "./GameOverScene";
import Assets from "./Assets";
import Contain from "./Contain";
import HitTestRectangle from "./HitTestRectangle";

function App() {
    const ratio = window.innerWidth / window.innerHeight;

    this.app = new PIXI.Application({
        width: 512,
        height: 512,
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
    this.hittedBlobs = [];

    this.gameScene = new GameScene();
    this.gameScene.container.scale.set(this.app.view.width / this.gameScene.container.width);
    this.app.stage.addChild(this.gameScene.container);

    this.gameOverScene = new GameOverScene();
    this.app.stage.addChild(this.gameOverScene.container);
    this.app.stage.addChild(this.gameOverScene.message);

    this.state = this.play;

    this.app.ticker.add((dt) => this.gameLoop(dt));
};

App.prototype.play = function () {
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
            this.hittedBlobs.push(blob);
            heroHit = true;
        }
    });

    if (heroHit) {
        this.gameScene.hero.alpha = 0.5;

        this.gameScene.healthBar.outerBar.width -= 1;
    } else {
        this.gameScene.hero.alpha = 1;
    }

    if (HitTestRectangle(this.gameScene.hero, this.gameScene.treasure)) {
        this.gameScene.treasure.x = this.gameScene.hero.x + 8;
        this.gameScene.treasure.y = this.gameScene.hero.y + 8;
    }

    if (this.gameScene.healthBar.outerBar.width < 0) {
        this.state = this.end;
        this.gameOverScene.message.text = "You Lost!";
    }

    if (HitTestRectangle(this.gameScene.treasure, this.gameScene.door)) {
        this.state = this.end;
        this.gameOverScene.message.text = "You Won!";
    }
};

App.prototype.end = function () {
    this.gameScene.container.visible = false;
    this.gameOverScene.message.x = this.app.view.width / 2 - this.gameOverScene.message.width / 2;
    this.gameOverScene.message.y = this.app.view.height / 2 - this.gameOverScene.message.height / 2;
    this.gameScene.dungeon.alpha = 0.5;
    this.gameScene.hero.alpha = 0.5;
    this.gameScene.treasure.alpha = 0.5;
    this.gameScene.door.alpha = 0.5;
    this.gameScene.healthBar.container.alpha = 0.5;
    if (this.hittedBlobs.length) {
        this.hittedBlobs.map((blob) => {
            blob.alpha = 0.5;
            this.gameOverScene.container.addChild(blob);
        });
    }
    this.gameOverScene.container.addChild(this.gameScene.healthBar.container);
    this.gameOverScene.container.addChild(this.gameScene.hero);
    this.gameOverScene.container.addChild(this.gameScene.dungeon);
    this.gameOverScene.container.addChild(this.gameScene.door);
    this.gameOverScene.container.addChild(this.gameScene.treasure);
    this.gameOverScene.container.visible = true;
};

App.prototype.gameLoop = function (dt) {
    this.state(dt);
};

export default App;
