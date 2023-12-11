import { Tile } from "./tile";
import { PureNinePatch } from "../../../pureDynamic/PixiWrapper/pureNinePatch";
import { PureSprite } from "../../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../../pureDynamic/PixiWrapper/pureText";
import { PureTransform } from "../../../pureDynamic/core/pureTransform";
import { Alignment } from "../../../pureDynamic/core/pureTransformConfig";
import { GameConstant } from "../../../gameConstant";
import { TileType } from "./tileType";
import { AssetSelector } from "../../assetSelector";

export class TileLong extends Tile {
  constructor() {
    super(TileType.Long);
    this.holdScore = 0;
    this.isMiddleBelowHold = true;
  }

  update(dt) {
    super.update(dt);
    if (this.isPointerDown && this.hold) {
      this.hold.height += GameConstant.SPEED * dt;
      this.hold.y -= GameConstant.SPEED * dt;
      if (this.hold.height >= this.tile.height) {
        this._remove();
      }
    }
  }

  destroy() {
    super.destroy();
    if (this.middle) {
      this.parent.removeChild(this.middle.displayObject);
    }

    if (this.hold) {
      this.parent.removeChild(this.hold.displayObject);
    }

    if (this.touched) {
      this.parent.removeChild(this.touched);
    }

    if (this.holdScore) {
      this.parent.removeChild(this.txtHoldScore.displayObject);
    }
  }

  onDespawn() {
    if (this.middle) {
      this.parent.removeChild(this.middle.displayObject);
    }

    if (this.hold) {
      this.parent.removeChild(this.hold.displayObject);
    }

    if (this.touched) {
      this.parent.removeChild(this.touched);
    }

    if (this.holdScore) {
      this.parent.removeChild(this.txtHoldScore.displayObject);
    }
  }

  initTouchedSprite(texture, left = 0, top = 0, right = 0, bottom = 0) {
    if (left || top || right || bottom) {
      this.touched = new PureNinePatch(texture, left, top, right, bottom, this.getTransform());
    }
    else {
      this.touched = new PureSprite(texture, this.getTransform());
    }
    this.tile.addChild(this.touched.displayObject);
  }

  initTxtHoldScore(score) {
    this.holdScore = score;
    let transform = new PureTransform({
      container       : this,
      pivotX          : 0.5,
      pivotY          : 1,
      anchorX         : 0.5,
      y               : -4,
      useOriginalSize : true,
    });

    const style = new PIXI.TextStyle({
      fontSize : 60,
      fill     : [AssetSelector.getTileLongScoreColor()],
      align    : "center",
    });
    this.txtHoldScore = new PureText(`+${this.holdScore}`, transform, style);
  }

  initHoldSprite(texture, left = 0, top = 0, right = 0, bottom = 0) {
    if (!this.tile) {
      return;
    }

    let transform = new PureTransform({
      container : this,
      alignment : Alignment.HORIZONTAL_BOTTOM,
      height    : GameConstant.SKIP_HOLD_DURATION * GameConstant.SPEED,
    });

    if (left || top || right || bottom) {
      this.hold = new PureNinePatch(texture, left, top, right, bottom, transform);
    }
    else {
      this.hold = new PureSprite(texture, transform);
    }
  }

  initMiddleSprite(texture, isBelowHold, left = 0, top = 0, right = 0, bottom = 0) {
    if (!this.tile) {
      return;
    }

    this.isMiddleBelowHold = isBelowHold;
    let transform = new PureTransform({
      container  : this,
      alignment  : Alignment.MIDDLE_CENTER,
      usePercent : true,
      height     : 0.8,
    });
    this.middle = new PureNinePatch(texture, left, top, right, bottom, transform);
    this.parent.addChild(this.middle.displayObject);
  }

  /**
   * @param {PIXI.Container} fx
   * @param {number} offsetY
   */
  initFxHold(fx, offsetY) {
    fx.x = this.tile.x + this.tile.width / 2;
    fx.y = this.hold.y + offsetY;
    fx.children.forEach((fx) => {
      if (fx.tween) {
        // fx.tween.reset();
        fx.tween.start();
      }
    });
    this.parent.addChildAt(fx, this.parent.children.indexOf(this.hold.displayObject));
    this.fxHold = fx;
  }

  onPointerDown(event) {
    if (!this.isTouched) {
      if (this.hold) {
        this.parent.addChild(this.hold.displayObject);
        if (this.middle && !this.isMiddleBelowHold) {
          this.parent.addChild(this.middle.displayObject);
        }
      }
      super.onPointerDown(event);
    }
  }

  onPointerUp(event) {
    super.onPointerUp(event);
    if (this.isPointerDown) {
      this.isPointerDown = false;
      this.isTouched = true;
      this._removeFxHold();
      this.emitter.emit("pointerup", this, event);
    }
  }

  _remove() {
    if (!this.isTouched) {
      this.isPointerDown = false;
      this.isTouched = true;
      this.tile.displayObject.alpha = this.touchedAlpha;

      if (this.touched) {
        this.parent.addChild(this.touched.displayObject);
      }
      if (this.middle) {
        this.parent.removeChild(this.middle.displayObject);
      }

      this.parent.addChild(this.txtHoldScore.displayObject);
      this.parent.removeChild(this.hold.displayObject);
      this._removeFxHold();
      this.emitter.emit("remove", this);
    }
  }

  _removeFxHold() {
    if (this.fxHold) {
      this.parent.removeChild(this.fxHold);
      this.fxHold = undefined;
    }
  }

  get x() {
    return super.x;
  }

  set x(value) {
    let offset = value - super.x;
    super.x = value;
    if (this.touched) {
      this.touched.displayObject.x += offset;
    }

    if (this.txtHoldScore) {
      this.txtHoldScore.displayObject.x += offset;
    }

    if (this.hold) {
      this.hold.displayObject.x += offset;
    }

    if (this.middle) {
      this.middle.displayObject.x += offset;
    }
  }

  get y() {
    return super.y;
  }

  set y(value) {
    let offset = value - super.y;
    super.y = value;
    if (this.touched) {
      this.touched.displayObject.y += offset;
    }

    if (this.txtHoldScore) {
      this.txtHoldScore.displayObject.y += offset;
    }

    if (this.hold) {
      this.hold.displayObject.y += offset;
    }

    if (this.middle) {
      this.middle.displayObject.y += offset;
    }
  }
}
