import { Graphics, Sprite } from "pixi.js";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { AssetSelector } from "../../assetSelector";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../systems/tween/tween";

export class Star extends Sprite {
  constructor(tag = CollisionTag.Star) {
    super();
    this.texture = AssetSelector.getStarTexture();
    this._config();
    this._initCollider(tag || "");
  }

  _config() {
    this.anchor.set(0.5);  
    this.scale.set(0.2);
  }

  reset() {
    //stop zoom in out
    this.zoomInOutTween?.stop();

    this.collider.enabled = true;
    this.tint = 0xffffff;
    this.visible = true;
    this.scale.set(0.2);

    //remove all listeners to recycle this object
    this.removeAllListeners();
  }

  resetInitialState() {
    //stop zoom in out
    this.zoomInOutTween?.stop();

    this.collider.enabled = true;
    this.tint = 0xffffff;
    this.visible = true;
    this.scale.set(0.2);

    //start zoom in out
    this.zoomInOut();
  }

  isSkipped() {
    this.tint = "#7f7f7f";
    this.collider.enabled = false;
  }

  zoomInOut() {
    this.zoomInOutTween = Tween.createTween(this, { scale: {x: 0.15, y: 0.15} }, {
      duration : 0.8,
      repeat   : Infinity,
      yoyo     : true,
    }).start();
  }
  
  _initCollider(tag) {
    if (tag == null) {
      return;
    }

    this.collider = new Collider(tag);
    this.collider.enabled = true;
    this.collider.width = this.texture.width;
    this.collider.height = this.texture.height;
    this.addChild(this.collider);
  }

}