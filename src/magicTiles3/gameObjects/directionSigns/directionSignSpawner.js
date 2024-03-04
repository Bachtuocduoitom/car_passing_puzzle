import { Container } from "pixi.js";
import { DirectionSign } from "./directionSign";
import { ContainerSpawner } from "../../../systems/spawners/containerSpawner";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { DirectionSignDirection } from "./directionSignDirection";

export class DirectionSignSpawner extends Container {
  constructor(scene) {
    super();
    this.scene = scene;
    this.scene.addChild(this);
    /** @type {Array<DirectionSign>} */
    this.directionSigns = [];
    this.turnLeftSignSpawner = new ContainerSpawner();
    this.turnLeftSignSpawner.init(this._createTurnLeftSign.bind(this), 10);

    this.turnRightSignSpawner = new ContainerSpawner();
    this.turnRightSignSpawner.init(this._createTurnRightSign.bind(this), 10);

    this.turnBackSignSpawner = new ContainerSpawner();
    this.turnBackSignSpawner.init(this._createTurnBackSign.bind(this), 10);

    this.noneSignSpawner = new ContainerSpawner();
    this.noneSignSpawner.init(this._createNoneSign.bind(this), 50);

  }

  spawnDirectionSign(type, direction, position) {
    let directionSign = null;
    switch(type) {
      case CollisionTag.TurnLeftSign:
        directionSign = this._spawn(this.turnLeftSignSpawner);
        break;
      case CollisionTag.TurnRightSign:
        directionSign = this._spawn(this.turnRightSignSpawner);
        break;
      case CollisionTag.TurnBackSign:
        directionSign = this._spawn(this.turnBackSignSpawner);
        break;
      case CollisionTag.NoneSign:
        directionSign = this._spawn(this.noneSignSpawner);
        break;
      default:
        directionSign = this._spawn(this.noneSignSpawner);
    }

    if (directionSign) {
      directionSign.setDirection(direction);
      directionSign.position.set(position.x, position.y);
      return directionSign;
    } else {
      return;
    } 
  }

  despawnDirectionSign(directionSign) {
    switch(directionSign.getTag()) {
      case CollisionTag.TurnLeftSign:
        this._despawn(this.turnLeftSignSpawner, directionSign);
        break;
      case CollisionTag.TurnRightSign:
        this._despawn(this.turnRightSignSpawner, directionSign);
        break;
      case CollisionTag.TurnBackSign:
        this._despawn(this.turnBackSignSpawner, directionSign);
        break;
      case CollisionTag.NoneSign:
        this._despawn(this.noneSignSpawner, directionSign);
        break;
      default:
        this._despawn(this.noneSignSpawner, directionSign);
    }
  }

  _spawn(spawner) {
    let directionSign = spawner.spawn();
    this.directionSigns.push(directionSign);
    return directionSign;
  }

  _despawn(spawner, directionSign) {
    spawner.despawn(directionSign);
    this.directionSigns.splice(this.directionSigns.indexOf(directionSign), 1);
  }

  _createTurnLeftSign() {
    let turnLeftSign = new DirectionSign(CollisionTag.TurnLeftSign);
    return turnLeftSign;
  }

  _createTurnRightSign() {
    let turnRightSign = new DirectionSign(CollisionTag.TurnRightSign);
    return turnRightSign;
  }

  _createTurnBackSign() {
    let turnBackSign = new DirectionSign(CollisionTag.TurnBackSign);
    return turnBackSign;
  }

  _createNoneSign() {
    let noneSign = new DirectionSign(CollisionTag.NoneSign);
    return noneSign;
  }
}