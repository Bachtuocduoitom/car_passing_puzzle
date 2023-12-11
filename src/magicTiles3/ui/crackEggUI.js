import { Tween } from "../../integrate/tween";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";

export class CrackEggUI extends PIXI.Container {
  constructor(texEggTop, texEggBottom, texSongName) {
    super();
    this._initBackground();
    this._initEgg(texEggTop, texEggBottom, texSongName);
    GameResizer.registerOnResizeCallback(this.onResize, this);
    this.onResize();
  }

  destroy() {
    super.destroy();
    GameResizer.unregisterOnResizeCallback(this.onResize, this);
  }

  _initBackground() {
    this.bg = new PureSprite(
      PIXI.Texture.from("spr_square_white"),
      new PureTransform({
        alignment: Alignment.FULL,
      })
    );
    this.bg.displayObject.alpha = 0.5;
    this.bg.displayObject.tint = 0x000092;
    this.addChild(this.bg.displayObject);
  }

  _initEgg(texTop, texBottom, texSongName) {
    this.egg = new PIXI.Container();
    this.addChild(this.egg);

    this.eggContainer = new PIXI.Container();
    this.egg.addChild(this.eggContainer);

    this.sprEggTop = new PIXI.Sprite(texTop);
    this.sprEggTop.anchor.set(0.5, 1);
    this.sprEggTop.x = -38;
    this.sprEggTop.y = 30;
    this.eggContainer.addChild(this.sprEggTop);

    this.sprEggBottom = new PIXI.Sprite(texBottom);
    this.sprEggBottom.anchor.set(0.5, 0);
    this.eggContainer.addChild(this.sprEggBottom);

    this.sprSongName = new PIXI.Sprite(texSongName);
    this.sprSongName.anchor.set(0.5);
    this.sprSongName.x = -12;
    this.sprSongName.y = 24;
    this.eggContainer.addChild(this.sprSongName);
  }

  crack(from, to, onComplete) {
    this.egg.x = from.x;
    this.egg.y = from.y;
    this.egg.alpha = 0;

    this.tweenFadeIn = Tween.createTween(this.egg, { alpha: 1 }, {
      duration: 0.2
    });
    this.tweenMove = Tween.createTween(this.egg, to, {
      duration: 0.75,
      easing: Tween.Easing.Sinusoidal.Out,
      onComplete
    });

    this.sprSongName.scale.set(0);
    this.tweenScaleSongName = Tween.createTween(this.sprSongName.scale, { x: 1, y: 1 }, {
      duration: 0.2,
    }).start();

    this.sprEggTop.scale.set(1, 0);
    this.sprEggBottom.scale.set(1, 0);
    this.tweenScaleEggTop = Tween.createTween(this.sprEggTop.scale, { x: 1, y: 1 }, {
      duration: 0.2,
    }).start();
    this.tweenScaleEggBottom = Tween.createTween(this.sprEggBottom.scale, { x: 1, y: 1 }, {
      duration: 0.2,
    }).start();

    this.tweenFadeIn.chain(this.tweenMove);
    this.tweenFadeIn.start();
  }

  onResize() {
    if (GameResizer.isPortrait()) {
      this.eggContainer.scale.set(1.5);
    }
  }
}