import { Container, Sprite, Texture } from "pixi.js";
import { GameConstant } from "../../../gameConstant";
import { PureTransform } from "../../../pureDynamic/core/pureTransform";
import { Alignment } from "../../../pureDynamic/core/pureTransformConfig";
import { PureNinePatch } from "../../../pureDynamic/PixiWrapper/pureNinePatch";
import { PureSprite } from "../../../pureDynamic/PixiWrapper/pureSprite";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { ProgressStar } from "./progressStar";

export class ProgressBar extends PIXI.Container {
  constructor() {
    super();
    this.stars = [];
    this.currFilledStarIndex = -1;
    this.curProgress = 0;

    this._initBg();
    this._initProgress();
    this._initProgressDot();
    this._initStars();

    GameResizer.registerOnResizedCallback(this.resize.bind(this));
    this.resize();
  }

  resize() {
    let totalWidth = this.bg.displayObject.width;
    let width = totalWidth / GameConstant.PROGRESS_STARS;
    let startStarX = GameResizer.width / 2 - totalWidth / 2;
    let starScale = 1;

    if (GameResizer.isPortrait()) {
      this.dot.scale.set(1);
      this.dot.y = 4;
    }
    else {
      this.dot.scale.set(2);
      this.dot.y = 8;
      starScale = 1.6;
    }

    this.stars.forEach((star, index) => {
      star.scale.set(starScale);
      star.x = startStarX + width * (index + 1);
      star.y = this.bg.y;
    });

    this.progressMaxWidth = this.bg.displayObject.width;
    this.progress.displayObject.width = this.curProgress * this.progressMaxWidth;
    this.progress.displayObject.height = this.bg.displayObject.height;
    this.dot.x = this.progress.displayObject.width;
  }

  updateProgress(progress) {
    this.curProgress = progress;
    this.startProgressAnimation(this.progressMaxWidth * progress);
  }

  startProgressAnimation(width) {
    this.progress.displayObject.width = width;
    this.dot.x = this.progress.displayObject.width || 0;
  }

  fillStar() {
    this.currFilledStarIndex++;
    this._updateFilledStars();
  }

  _updateFilledStars() {
    for (var i = 0; i <= this.currFilledStarIndex; i++) {
      var star = this.stars[i];
      if (star) {
        star.fill();
      }
    }
  }

  unFillAllStars() {
    this.currFilledStarIndex = -1;
    this.stars.forEach((star) => {
      if (star) {
        star.unFill();
      }
    });
  }

  _initBg() {
    let texture = Texture.from("progressBar_bg");
    let pTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      y         : 60,
      height    : 8,
    });

    let lTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      y         : 80,
      width     : texture.width * 1.6,
      height    : 14,
    });
    this.bg = new PureSprite(texture, pTransform, lTransform);
    this.bg.displayObject.alpha = 0.5;
    this.addChild(this.bg.displayObject);
  }

  _initProgress() {
    let texture = Texture.WHITE;
    this.progress = new PureNinePatch(texture, 20, 18, 20, 18, new PureTransform({
      container       : this.bg,
      alignment       : Alignment.TOP_LEFT,
      useOriginalSize : true,
    }));
    this.progressMaxWidth = this.bg.displayObject.width;
    this.progress.displayObject.width = 0;
    this.progress.displayObject.height = 8;
    this.progress.displayObject.tint = 0xffeb77;
    this.addChild(this.progress.displayObject);
  }

  _initProgressDot() {
    let texture = Texture.from("progressBar_dot");
    this.dot = new Sprite(texture);
    this.dot.anchor.set(0.5);
    this.progress.displayObject.addChild(this.dot);
  }

  _initStars() {
    this.starsContainer = new Container();
    this.addChild(this.starsContainer);

    for (var i = 0; i < GameConstant.PROGRESS_STARS; i++) {
      var texUnfill = Texture.from("star");
      var texFilled = Texture.from("star_active");

      if (i >= GameConstant.PROGRESS_STARS / 2) {
        texUnfill = Texture.from("crown");
        texFilled = Texture.from("crown_active");
      }

      var star = new ProgressStar(texUnfill, texFilled);

      if (i < GameConstant.PROGRESS_STARS / 2) {
        star.angle = 20;
      }

      this.starsContainer.addChild(star);
      this.stars.push(star);
    }
  }
}
