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
      case CollisionTag.NoneSign:
        return PIXI.Texture.from("glow_blue");
      default:
        break;
    }
  }

  static getDirectionSignsBoardTexture() {
    return PIXI.Texture.from("spr_gray_frame");
  }

  static getObstacleTexture() {
    return PIXI.Texture.from("spr_stone");
  }

  static getStarTexture() {
    return PIXI.Texture.from("spr_star_active");
  }

  static getGoalTexture() {
    return PIXI.Texture.from("spr_finish_line");
  }

  static getExplosionTextures() {
    return Util.getTexturesContain(`48x48 - ClusterExplosionFrame`);
  }
}