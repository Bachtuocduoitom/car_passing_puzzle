import { Sprite } from "pixi.js";
import { DirectionSignDirection } from "./directionSignDirection";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { AssetSelector } from "../../assetSelector";

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
      default:
        break;
    }
  }

  reset() {
    this.collider.reset();
    this.setDirection(DirectionSignDirection.UP);

  }

  _initCollider(tag) {
    if (tag == null) {
      return;
    }
    this.collider = new Collider(tag);
    this.collider.enabled = true; //set true to enable collider
    this.collider.width = this.texture.width;
    this.collider.height = this.texture.height;
    this.addChild(this.collider);
  }

}