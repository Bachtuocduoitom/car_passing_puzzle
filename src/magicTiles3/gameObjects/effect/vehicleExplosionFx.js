import { AnimatedSprite, Container, Sprite, Spritesheet, Texture } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";
import { Emitter, PropertyNode, upgradeConfig } from "@pixi/particle-emitter";
import { AssetSelector } from "../../assetSelector";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { Sound } from "@pixi/sound";
import { SoundManager } from "../../../soundManager";
import { GameConstant } from "../../../gameConstant";

export const VehicleExplosionFxEvent = Object.freeze({
  Start: "start",
  Complete: "complete",
});

export class VehicleExplosionFx extends Container {
  constructor(delayTime = 0) {
    super();
    let textures = AssetSelector.getExplosionTextures();

    this.explosion = new AnimatedSprite(textures);
    this.explosion.visible = false;
    this.explosion.anchor.set(0.5);
    this.explosion.scale.set(3.5);
    this.explosion.position.set(0, 20);
    this.addChild(this.explosion);


    this.tweenInterval = Tween.createTween({ t: 0 }, { t: 1 }, {
      duration    : GameConstant.EXPLOSION_ANIMATION_SPEED * textures.length,
      delay       : delayTime,
      onStart     : () => {
        this.explosion.visible = true;
        this.explosion.textures = textures;
        this.explosion.loop = false;
        this.explosion.animationSpeed = GameConstant.EXPLOSION_ANIMATION_SPEED;
        this.explosion.play();
      },
      onCompete   : () => {
        this.explosion.visible = false;
        this.explosion.stop();
      },
    });
  }

  play() {
    this.tweenInterval?.stop();
    this.tweenInterval.start();
  }

  stop() {
    this.tweenInterval?.stop();
    this.explosion.visible = false;
    this.explosion.stop();
  }
}
