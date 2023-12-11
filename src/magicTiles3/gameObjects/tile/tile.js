import { PureRect } from "../../../pureDynamic/PixiWrapper/pureRect";
import { GameConstant } from "../../../gameConstant";
import { PureSprite } from "../../../pureDynamic/PixiWrapper/pureSprite";
import { PureNinePatch } from "../../../pureDynamic/PixiWrapper/pureNinePatch";
import { PureTransform } from "../../../pureDynamic/core/pureTransform";
import { Alignment } from "../../../pureDynamic/core/pureTransformConfig";
import { Util } from "../../../helpers/utils";

export class Tile extends PureRect {
  /**
   * @class Tile
   * @param {PIXI.Sprite} parent
   * @param {string} type
   * @param {PureTransform} transformPortrait
   * @param {PureTransform} transformLandscape
   */
  constructor(type) {
    super(new PureTransform());
    this.type = type;
    this.xIndex = 0;
    this.isSecondNoteOfDoubleNotes = false;
    this.isTouched = false;
    this.touchedAlpha = 0;
    this.isPointerDown = false;
    this.maintainMovementRatio = true;
    this.skipMovement = true;
  }

  update(dt) {
    this.y += GameConstant.SPEED * dt;
  }

  setDisplay(parent, transform) {
    this.parent = parent;
    Util.copyObject(transform, this.transform);
    this.transform.setup(this);
    this._updateTransform();
  }

  reset() {
    this.isTouched = false;
    this.isPointerDown = false;
    this.isSecondNoteOfDoubleNotes = false;
    this.touchedAlpha = 0;
    this.skipMovement = true;
    this.parent.removeChild(this.tile.displayObject);
    this.emitter.removeAllListeners();
  }

  destroy() {
    if (this.tile) {
      this.parent.removeChild(this.tile.displayObject);
    }
  }

  initSprite(texture, left = 0, top = 0, right = 0, bottom = 0) {
    if (left || top || right || bottom) {
      this.tile = new PureNinePatch(texture, left, top, right, bottom, this.getTransform());
    }
    else {
      this.tile = new PureSprite(texture, this.getTransform());
    }
    this.tile.displayObject.eventMode = "dynamic";
    if (!GameConstant.AUTO_PLAY) {
      this.tile.displayObject.on("pointerdown", this.onPointerDown.bind(this));
      this.tile.displayObject.on("pointerup", this.onPointerUp.bind(this));
      this.tile.displayObject.on("pointerupoutside", this.onPointerUp.bind(this));
    }

    this.parent.addChild(this.tile.displayObject);
  }

  updateTileTransform(transform) {
    Util.copyObject(transform, this.tile.transform);
    this.tile.transform.setup(this);
    this.tile._updateTransform();
  }

  getTransform() {
    return new PureTransform({
      container : this,
      alignment : Alignment.FULL,
    });
  }

  /**
   * @param {(tile: Tile, event: PIXI.interaction.InteractionEvent) => void} callback
   */
  registerOnPointerDownCallback(callback) {
    this.emitter.once("pointerdown", callback);
  }

  /**
   * @param {(tile: Tile, event: PIXI.interaction.InteractionEvent) => void} callback
   */
  registerOnPointerUpCallback(callback) {
    this.emitter.once("pointerup", callback);
  }

  /**
   * @param {(tile: Tile) => void} callback
   */
  registerOnRemoveCallback(callback) {
    this.emitter.once("remove", callback);
  }

  onPointerDown(event) {
    if (!this.isTouched) {
      this.isPointerDown = true;
      this.emitter.emit("pointerdown", this, event);
    }
  }

  onPointerUp() { }

  get x() {
    return super.x;
  }

  set x(value) {
    let offset = value - super.x;
    super.x = value;
    if (this.tile) {
      this.tile.displayObject.x += offset;
    }
  }

  get y() {
    return super.y;
  }

  set y(value) {
    let offset = value - super.y;
    super.y = value;
    if (this.tile) {
      this.tile.displayObject.y += offset;
    }
  }
}
