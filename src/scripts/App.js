import * as PIXI from "pixi.js";
import { Howl, Howler } from "howler";

import Loader from "./Loader";
import Globals from "./Globals";
import GameScene from "./GameScene";
import GameOverScene from "./GameOverScene";
import Assets from "./Assets";
import Contain from "./Contain";
import HitTestRectangle from "./HitTestRectangle";
import Border from "./Border";
import KeyEvent from "./Events";

function App() {
    const size = [512, 512];

    this.app = new PIXI.Application({
        width: size[0],
        height: size[1],
        antialias: true,
        resolution: 1,
        clearBeforeRender: true,
    });

    this.ratio = size[0] / size[1];

    const { renderer } = this.app;

    renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoDensity = true;
}

App.prototype.run = function () {
    document.getElementById("root").appendChild(this.app.view);
    this.assets = Assets;

    this.loader = new Loader(PIXI.Loader.shared);
    this.loader.preload().then(() => this.start());
};

App.prototype.start = function () {
    window.onresize = this.resize();
    this.hittedBlobs = [];
    this.pickedTreasure = false;

    this.mix = new Howl({ src: [Globals.resources.mix.url], volume: 0.5, sprite: { blobhit: [0, 900], loser: [1200, 3000], pickup: [4300, 3000], winner: [7900, 3500] } });
    this.bgmusic = new Howl({ src: [Globals.resources.bgmusic.url], volume: 0.5, autoplay: true, loop: true });

    this.message = new PIXI.BitmapText("", { fontName: "Notalot60", fontSize: 48 });
    this.playAgain = new PIXI.BitmapText("Play", { fontName: "Notalot60", fontSize: 28 });

    this.gameScene = new GameScene();
    this.gameScene.container.scale.set(this.app.view.width / this.gameScene.container.width);
    this.app.stage.addChild(this.gameScene.container);

    this.gameOverScene = new GameOverScene();
    this.gameOverScene.container.visible = false;
    this.app.stage.addChild(this.gameOverScene.container);

    const pause = KeyEvent(32);
    let paused = false;

    pause.press = () => {
        paused = !paused;
        if (paused) this.app.ticker.stop();
        else this.app.ticker.start();
    };

    this.state = this.play;

    this.bgmusic.once("load", () => {
        this.bgmusic.play();
        this.app.ticker.add((dt) => this.gameLoop(dt));
    });
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

        this.mix.play("blobhit");
    } else {
        this.gameScene.hero.alpha = 1;
    }

    if (HitTestRectangle(this.gameScene.hero, this.gameScene.treasure)) {
        this.gameScene.treasure.x = this.gameScene.hero.x + 8;
        this.gameScene.treasure.y = this.gameScene.hero.y + 8;
        if (!this.pickedTreasure) {
            this.pickedTreasure = true;
            this.mix.play("pickup");
        }
    }

    if (this.gameScene.healthBar.outerBar.width < 0) {
        this.state = this.end;
        this.message.text = "You Lost!";
        this.bgmusic.stop();
        this.mix.play("loser");
    }

    if (HitTestRectangle(this.gameScene.treasure, this.gameScene.door)) {
        this.state = this.end;
        this.message.text = "You Won!";
        this.bgmusic.stop();
        this.mix.play("winner");
    }
};

App.prototype.end = function () {
    this.gameScene.container.visible = false;
    this.message.x = this.app.view.width / 2 - this.message.width / 2;
    this.message.y = this.app.view.height / 2 - this.message.height / 2;
    this.playAgain.x = this.app.view.width / 2 - this.playAgain.width / 2;
    this.playAgain.y = this.app.view.height / 2 - this.playAgain.height / 2 + 100;
    this.border = new Border(0x0, this.playAgain.x - 10, this.playAgain.y - 10, this.playAgain.width + 20, this.playAgain.height + 20, this.restart, this);
    this.border.container.addChild(this.playAgain);
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
    this.gameOverScene.container.addChild(this.message);
    this.gameOverScene.container.addChild(this.border.container);
    this.gameOverScene.container.visible = true;
};

App.prototype.restart = function () {
    this.gameScene.container.removeChildren();
    this.gameOverScene.container.removeChildren();
    this.start();
};

App.prototype.gameLoop = function (dt) {
    this.state(dt);
};

App.prototype.resize = function () {
    let w, h;
    if (window.innerWidth / window.innerHeight >= this.ratio) {
        w = window.innerHeight * this.ratio;
        h = window.innerHeight;
    } else {
        w = window.innerWidth;
        h = window.innerWidth / this.ratio;
    }

    this.app.view.style.width = w + "px";
    this.app.view.style.height = h + "px";
};

export default App;
