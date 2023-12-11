import { Container, Texture } from "pixi.js";
import defaultResultConfig from "../../../../assets/jsons/defaultResultConfig.json";
import { Util } from "../../../helpers/utils";
import { Tween } from "../../../systems/tween/tween";
import { Emitter, PropertyNode, upgradeConfig } from "@pixi/particle-emitter";

export class ResultDefaultFx extends Container {
  constructor(delayTime = 0) {
    super();
    let texture = Texture.from("spr_square_white");

    let fireworkContainer = new Container();
    this.addChild(fireworkContainer);
    this.emitter = new Emitter(fireworkContainer, upgradeConfig(defaultResultConfig, [texture]));
    this.emitter.autoUpdate = true;
    this.emitter.emit = false;

    this.tweenInterval = Tween.createTween({ t: 0 }, { t: 1 }, {
      duration    : 1,
      delay       : delayTime,
      onStart     : () => {
        this.emitter.emit = true;
        this.emitter.playOnce();
      },
    });
    this.play();
  }

  play() {
    this.tweenInterval.start();
  }

  stop() {
    this.tweenInterval.stop();
    this.emitter.autoUpdate = false;
    this.emitter.emit = false;
  }

  randomColor() {
    let r = Util.getRandomInt(1, 255);
    let g = Util.getRandomInt(1, 255);
    let b = Util.getRandomInt(1, 255);
    let color = new PropertyNode({ r, g, b });
    return Util.randomOfList([color]);
  }
}
