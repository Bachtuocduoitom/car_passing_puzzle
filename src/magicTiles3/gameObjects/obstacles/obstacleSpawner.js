import { Container } from "pixi.js";
import { ContainerSpawner } from "../../../systems/spawners/containerSpawner";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { GameState, GameStateManager } from "../../../pureDynamic/systems/gameStateManager";
import { Game } from "../../../game";
import { Obstacle } from "./obstacle";
import { AssetSelector } from "../../assetSelector";
import { Star } from "./star";

export class ObstacleSpawner extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.scene.addChild(this);
    /** @type {Array<Obstacle>} */
    this.obstacles = [];
    this.ObsSpawner = new ContainerSpawner();
    this.ObsSpawner.init(this._createObstacle.bind(this), 5);

    /** @type {Array<Star>} */
    this.stars = [];
    this.StarSpawner = new ContainerSpawner();
    this.StarSpawner.init(this._createStar.bind(this), 5);

    Game.app.ticker.add(this.update, this);
  }

  update() {
    if (!GameStateManager.isState(GameState.Playing)) {
      return;
    }

    this.obstacles.forEach(obs => obs.update(Game.app.ticker.deltaMS / 1000));
  }

  spawnObstacle(position) {
    let obstacle = this._spawn(this.ObsSpawner);  
   
    if (obstacle) {
      obstacle.x = position.x;
      obstacle.y = position.y;
      return obstacle;
    }
  }

  deSpawnObstacle(obstacle) {
    this._despawn(this.ObsSpawner, obstacle);
  }

  spawnStar(position) {
    let star = this._spawn(this.StarSpawner);
    
    if (star) {
      star.x = position.x;
      star.y = position.y;
      star.zoomInOut();
      return star;
    }
  }

  deSpawnStar(star) {
    this._despawn(this.StarSpawner, star);
  }

  _spawn(spawner) {
    let obstacle = spawner.spawn();
    this.obstacles.push(obstacle);
    return obstacle;
  }

  _despawn(spawner, obstacle) {
    spawner.despawn(obstacle);
    this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
  }

  _createObstacle() {
    let obstacle = new Obstacle(CollisionTag.Obstacle);
    return obstacle;
  }

  _createStar() {
    let star = new Star(CollisionTag.Star);
    return star;
  }
}