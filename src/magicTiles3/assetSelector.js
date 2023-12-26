import songData from "../../assets/jsons/songData.json";
import { Util } from "../helpers/utils";
import { CollisionTag } from "../physics/aabb/collisionTag";
import { Tween } from "../systems/tween/tween";
export class AssetSelector {
 
  static getBgTexture() {
    return PIXI.Texture.from("Theme1_Background");
  }
  
  static getVehicleRunTextures() {
    return Util.getTexturesContain(`taxi_idle`);
  }

  static getDirectionSignTextureByTag(tag) {
    switch (tag) {
      case CollisionTag.TurnLeftSign:
        return PIXI.Texture.from("spr_turnLeft");
      case CollisionTag.TurnRightSign:
        return PIXI.Texture.from("spr_turnRight");
      case CollisionTag.TurnBackSign:
        return PIXI.Texture.from("spr_turnBack");
      default:
        break;
    }
  }
}