import { Sprite } from "pixi.js";
import { DirectionSignDirection } from "./directionSignDirection";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { AssetSelector } from "../../assetSelector";

export class DirectionSign extends Sprite {
  constructor(tag, direction) {
    super();
    this.texture = AssetSelector.getDirectionSignTextureByTag(tag);
    this.setDirection(direction);
    this._initCollider(tag);
    this._config();
  }

  _config() {
    this.anchor.set(0.5);
    this.collider.rotation = this.rotation;
    this.collider.width = this.texture.width;
    this.collider.height = this.texture.height;
  }

  setDirection(direction) {
    this.direction = direction;
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
    this.collider = new Collider(tag);
    this.collider.direction = this.direction;
    this.collider.enabled = true; //set true to enable collider
    this.addChild(this.collider);
  }

}