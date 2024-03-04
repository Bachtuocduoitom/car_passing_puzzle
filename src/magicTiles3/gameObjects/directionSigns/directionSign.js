import { Graphics, Sprite } from "pixi.js";
import { DirectionSignDirection } from "./directionSignDirection";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { AssetSelector } from "../../assetSelector";
import { GameConstant } from "../../../gameConstant";

export class DirectionSign extends Sprite {
  constructor(tag, direction) {
    super();
    this.texture = AssetSelector.getDirectionSignTextureByTag(tag || "");
    this._config();
    this._initCollider(tag || "");
    this.setDirection(direction || "");
  }

  _config() {
    this.anchor.set(0.5);
    this._initOutline();
    
  }

  setDirection(direction) {
    this.direction = direction;
    this.collider.direction = direction;
    switch (direction) {
      case DirectionSignDirection.LEFT:
        this.rotation = - Math.PI / 2;
        break;
      case DirectionSignDirection.RIGHT:
        this.rotation = Math.PI / 2;
        break;
      case DirectionSignDirection.DOWN:
        this.rotation = Math.PI;
        break;
      case DirectionSignDirection.UP:
        this.rotation = 0;
        break;
      case DirectionSignDirection.NONE:
        break;
      default:
        break;
    }
  }

  setTag(tag) {
    this.texture = AssetSelector.getDirectionSignTextureByTag(tag);
    this._initCollider(tag);
    this.collider.direction = this.direction;
  }

  getTag() {
    return this.collider.tag;
  }

  reset() {
    this.setDirection(DirectionSignDirection.NONE);
    this.hideOutline();

    //remove all listeners to recycle this object
    this.removeAllListeners();
  }
  
  _initOutline() {
    // create graphic to draw outline
    this.outline = new Graphics();
    this.outline.clear();
    this.outline.lineStyle(2, 0xFF0000); // set width and color of the line
    this.outline.drawRect(
      -GameConstant.DIRECTION_SIGN_SIZE * this.anchor.x,
      -GameConstant.DIRECTION_SIGN_SIZE * this.anchor.y,
      GameConstant.DIRECTION_SIGN_SIZE,
      GameConstant.DIRECTION_SIGN_SIZE
    );
    this.hideOutline();
    this.addChild(this.outline);
  }

  showOutline() {
    if (!this.outline.visible) {
      this.outline.visible = true;
    }
  }

  hideOutline() {
    if (this.outline.visible) {
      this.outline.visible = false;
    }
  }

  turnOnOutline() {
    if (this.outline.visible) {
      this.hideOutline();
    } else {
      this.showOutline();
    }
  }

  _initCollider(tag) {
    if (tag == null) {
      return;
    }

    this.collider = new Collider(tag);
    if (tag === CollisionTag.NoneSign) {
      this.collider.enabled = false; //set false to disable collider
    } else {
      this.collider.enabled = true; //set true to enable collider
    }

    this.collider.width = GameConstant.DIRECTION_SIGN_SIZE;
    this.collider.height = GameConstant.DIRECTION_SIGN_SIZE;
    this.addChild(this.collider);
  }

}