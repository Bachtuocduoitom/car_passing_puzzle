import { Graphics, Sprite } from "pixi.js";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { AssetSelector } from "../../assetSelector";
import { GameConstant } from "../../../gameConstant";

export class Obstacle extends Sprite {
  constructor(tag = CollisionTag.Obstacle) {
    super();
    this.texture = AssetSelector.getObstacleTexture();
    this._config();
    this._initCollider(tag || "");
  }

  _config() {
    this.anchor.set(0.5);  
    // this.scale.set(0.4);
  }

  reset() {
    this.collider.enabled = true;
    this.visible = true;
    
    //remove all listeners to recycle this object
    this.removeAllListeners();
  }

  resetInitialState() {
    this.collider.enabled = true;
    this.visible = true;
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