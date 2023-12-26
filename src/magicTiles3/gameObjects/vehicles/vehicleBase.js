import { AnimatedSprite } from "pixi.js";
import { VehicleState } from "./vehicleState";
import { VehicleDirection } from "./vehicleDirection";
import { Tween } from "../../../systems/tween/tween";
import { Util } from "../../../helpers/utils";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";

export class vehicleBase extends AnimatedSprite {
  constructor(textures) {
    super(textures);
    
    this.fxs = [];
    this._initCollider();
    this._config();
    Util.registerOnPointerDown(this, this._onClick.bind(this));
  }

  _config() {
    this.anchor.set(0.5);
    this.state = VehicleState.STAY ; // permant set state to RUN need change to STAY later
    this.direction = VehicleDirection.RIGHT;
    this.rotation = -Math.PI / 2;
    this.collider.rotation = this.rotation;
  }

  update(dt) {
    super.update(dt);
    if(this.state == VehicleState.RUN) {
      this._run();
    }
  }

  reset() {

  }

  reInit() {

  }

  onTurnLeft() {
    if(this.state == VehicleState.RUN) { 
      this.state = VehicleState.CHANGEDIRECTION;
      this._turnLeft();
      this.emit("turnLeft");
      console.log("turnLeft");
    }
  } 

  onTurnRight() {
    if(this.state == VehicleState.RUN) {
      this.state = VehicleState.CHANGEDIRECTION;
      this._turnRight();
      this.emit("turnRight");
      console.log("turnRight");
    }
  } 

  onTurnBack() {
    if(this.state == VehicleState.RUN) {
      this.state = VehicleState.CHANGEDIRECTION;
    }
  }

  onObstacleCollide() {
    this.emit("obstacleCollide");
    console.log("obstacleCollide");
  }

  _turnLeft() {
    let prePosX = 0;
    let prePosY = 0;
    let posX = 0;
    let posY = 0;
    let newDirection = "";
    switch(this.direction) {
      case VehicleDirection.UP:
        prePosX = this.x;
        prePosY = (Math.floor(this.y / 32)) * 32;
        posX = prePosX - 80;
        posY = prePosY - 80;
        newDirection = VehicleDirection.LEFT;
        break;
      case VehicleDirection.RIGHT:
        prePosX = (Math.floor(this.x / 32) + 1) * 32;
        prePosY = this.y;
        posX = prePosX + 80;
        posY = prePosY - 80;
        newDirection = VehicleDirection.UP;
        break;
      case VehicleDirection.DOWN:
        prePosX = this.x;
        prePosY = (Math.floor(this.y / 32) + 1) * 32;
        posX = prePosX + 80;
        posY = prePosY + 80;
        newDirection = VehicleDirection.RIGHT;
        break;
      case VehicleDirection.LEFT:
        prePosX = (Math.floor(this.x / 32)) * 32;
        prePosY = this.y;
        posX = prePosX - 80;
        posY = prePosY + 80;
        newDirection = VehicleDirection.DOWN;
        break;
    }

    const preTurnLeftTween = Tween.createTween(this, {x: prePosX, y: prePosY}, {
      duration: 0.05,
    });
    const turnLeftTween = Tween.createTween(this, {rotation: this.rotation - Math.PI / 2, x: posX, y: posY}, {
      duration: 0.5,
      onComplete: () => {
        this.state = VehicleState.RUN;
        this.direction = newDirection;
      }
    });

    preTurnLeftTween.chain(turnLeftTween);
    preTurnLeftTween.start();
    // turnLeftTween.start();
  }

  _turnRight() {
    let prePosX = 0;
    let prePosY = 0;
    let posX = 0;
    let posY = 0;
    let newDirection = "";
    switch(this.direction) {
      case VehicleDirection.UP:
        prePosX = this.x;
        prePosY = (Math.floor(this.y / 32)) * 32;
        posX = prePosX + 80;
        posY = prePosY - 80;
        newDirection = VehicleDirection.RIGHT;
        break;
      case VehicleDirection.RIGHT:
        prePosX = (Math.floor(this.x / 32) + 1) * 32;
        prePosY = this.y;
        posX = prePosX + 80;
        posY = prePosY + 80;
        newDirection = VehicleDirection.DOWN;
        break;
      case VehicleDirection.DOWN:
        prePosX = this.x;
        prePosY = (Math.floor(this.y / 32) + 1) * 32;
        posX = prePosX - 80;
        posY = prePosY + 80;
        newDirection = VehicleDirection.LEFT;
        break;
      case VehicleDirection.LEFT:
        prePosX = (Math.floor(this.x / 32)) * 32;
        prePosY = this.y;
        posX = prePosX - 80;
        posY = prePosY - 80;
        newDirection = VehicleDirection.UP;
        break;
    }

    const preTurnRightTween = Tween.createTween(this, {x: prePosX, y: prePosY}, {
      duration: 0.05,
    });
    const turnRightTween = Tween.createTween(this, {rotation: this.rotation + Math.PI / 2, x: posX, y: posY}, {
      duration: 0.5,
      onComplete: () => {
        this.state = VehicleState.RUN;
        this.direction = newDirection;
      }
    });

    preTurnRightTween.chain(turnRightTween);
    preTurnRightTween.start();
  }

  _run() {
    switch(this.direction) {
      case VehicleDirection.UP:
        this.y -= 5;
        break;
      case VehicleDirection.RIGHT:
        this.x += 5;
        break;
      case VehicleDirection.DOWN:
        this.y += 5;
        break;
      case VehicleDirection.LEFT:
        this.x -= 5;
        break;
    }
  }

  _onClick() {
    this.emit("click");
    console.log("click");
    // this.onTurnLeft();
    this.state = VehicleState.RUN;
    this.collider.enabled = true;
  }

  _initCollider() {
    this.collider = new Collider(CollisionTag.Vehicle);
    this.collider.enabled = false;
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.addChild(this.collider);
  }

  onCollide(collider) {
    if (this.direction != collider.direction) {
      return;
    }
    switch(collider.tag) {
      case CollisionTag.Obstacle:
        this.onObstacleCollide();
        break;
      case CollisionTag.TurnLeftSign:
        this.onTurnLeft();
        break;
      case CollisionTag.TurnRightSign:
        this.onTurnRight();
        break;
      case CollisionTag.TurnBackSign:
        this.onTurnBack();
        break;
    }
  }
  
}