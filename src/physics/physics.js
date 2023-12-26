import { CollisionDetector } from "./aabb/collisionDetector";
import { CollisionTag } from "./aabb/collisionTag";

export class Physics {
  /**
   * @param {PIXI.Application} app
   */
  static init(app) {
    CollisionDetector.instance.init([
      {
        tag         : CollisionTag.Vehicle,
        collideTags : [CollisionTag.TurnLeftSign, CollisionTag.TurnRightSign, CollisionTag.TurnBackSign, CollisionTag.Obstacle],
      },
      {
        tag         : CollisionTag.TurnLeftSign,
        collideTags : [CollisionTag.Vehicle],
      },
      {
        tag         : CollisionTag.TurnRightSign,
        collideTags : [CollisionTag.Vehicle],
      },
      {
        tag         : CollisionTag.TurnBackSign,
        collideTags : [CollisionTag.Vehicle],
      },
      {
        tag         : CollisionTag.Obstacle,
        collideTags : [CollisionTag.Vehicle],
      },
    ]);

    app.ticker.add(this.update, this);
  }

  static update() {
    CollisionDetector.instance.update();
  }
}
