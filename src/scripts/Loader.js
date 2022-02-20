import Assets from './Assets';
import Globals from './Globals';

function Loader(loader) {
    this.loader = loader;
    this.assets = Assets;
}

Loader.prototype.preload = function () {
    return new Promise((resolve, reject) => {
        this.assets.forEach((asset) => this.loader.add(asset.name, asset.path));

        this.loader.load((loader, resources) => {
            Globals.resources = resources;
            resolve();
        });
    });
};

export default Loader;
