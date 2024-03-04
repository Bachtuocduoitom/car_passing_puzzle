import { Graphics, Sprite } from "pixi.js";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { AssetSelector } from "../../assetSelector";
import { GameConstant } from "../../../gameConstant";

export class PavementBrick extends Sprite {
  constructor(tag = CollisionTag.PavementBrick, texture) {
    super();
    this.texture = texture;
    this._config();
    this._initCollider(tag || "");
  }

  _config() {
  }

  reset() {
    
  }
  
  _initCollider(tag) {
    if (tag == null) {
      return;
    }

    this.collider = new Collider(tag);
    this.collider.enabled = true;
    this.collider.anchor.set(0);
    this.collider.width = this.texture.width;
    this.collider.height = this.texture.height;
    this.addChild(this.collider);
  }

}