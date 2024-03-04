import { Graphics, Sprite } from "pixi.js";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { AssetSelector } from "../../assetSelector";
import { GameConstant } from "../../../gameConstant";

export class Goal extends Sprite {
  constructor(tag = CollisionTag.Goal) {
    super();
    this.texture = AssetSelector.getGoalTexture();
    this._config();
    this._initCollider(tag || "");
  }

  _config() {
    this.anchor.set(0.5);  
    this.scale.set(0.25);
  }

  reset() {
    // this.collider.enabled = false;
  }
  
  _initCollider(tag) {
    if (tag == null) {
      return;
    }

    this.collider = new Collider(tag);
    this.collider.enabled = true;
    this.collider.width = this.width;
    this.collider.height = this.height;
    this.addChild(this.collider);
  }

}