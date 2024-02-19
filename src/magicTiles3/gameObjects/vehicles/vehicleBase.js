import { AnimatedSprite } from "pixi.js";
import { VehicleState } from "./vehicleState";
import { VehicleDirection } from "./vehicleDirection";
import { Tween } from "../../../systems/tween/tween";
import { Util } from "../../../helpers/utils";
import { Collider } from "../../../physics/aabb/collider";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { CollisionEvent } from "../../../physics/aabb/collissionEvent";
import { GameConstant } from "../../../gameConstant";
import { VehicleEvent } from "./vehicleEvent";

export class vehicleBase extends AnimatedSprite {
  constructor(textures) {
    super(textures);
    
    this.fxs = [];
    this._initCollider();
    this._config();
    // Util.registerOnPointerDown(this, this._onClick.bind(this));
  }

  _config() {
    this.anchor.set(0.5);
    this.state = VehicleState.STAY ; // permant set state to RUN need change to STAY later
    this.direction = VehicleDirection.RIGHT;
    this.rotation = - Math.PI / 2;
    this.collider.rotation = this.rotation;
    this.velocity = 200;
  }

  update(dt) {
    super.update(dt);
    if(this.state == VehicleState.RUN) {
      this._run(dt);
    }
  }

  reset() {

  }

  reInit() {

  }

  onTurnDirection(collisionTag, collider2) {
    if (this.direction != collider2.direction) {
      return;
    }
    if (this.state == VehicleState.RUN) {
      this.state = VehicleState.CHANGEDIRECTION;
      switch(collisionTag) {
        case CollisionTag.TurnLeftSign:
          this._turnLeft(collider2);
          this.emit("turnLeft");
          console.log("turnLeft");
          break;
        case CollisionTag.TurnRightSign:
          this._turnRight(collider2);
          this.emit("turnRight");
          console.log("turnRight");
          break;
        case CollisionTag.TurnBackSign:
          this._turnBack(collider2);
          this.emit("turnBack");
          console.log("turnBack");
          break;
      }
    }
  }

  onObstacleCollide(collider2) {
    if (this.state == VehicleState.RUN) {
      this.state = VehicleState.ANSWERQUESTION;
      Tween.createCountTween({
        duration: 0.2,
        onComplete: () => {
          this.emit(VehicleEvent.CollideObstacle, collider2);
        },
      }).start();
    }
  }

  onPavementBrickCollide(collider2) {
    if (this.state == VehicleState.RUN) {
      this.state = VehicleState.DEAD;
      Tween.createCountTween({
        duration: 0.2,
        onComplete: () => {
          this._die();
        },
      }).start();
    }
  }

  onContinue() {
    this.state = VehicleState.RUN;
  }

  _turnLeft(collider2) {
    let prePosX = collider2.parent.x;
    let prePosY = collider2.parent.y;
    let posX = 0;
    let posY = 0;
    let newDirection = "";
    switch(this.direction) {
      case VehicleDirection.UP:
        // prePosX = this.x;
        // prePosY = (Math.floor(this.y / GameConstant.TILE_SIZE)) * GameConstant.TILE_SIZE;
        posX = prePosX - 64;
        posY = prePosY - 64;
        newDirection = VehicleDirection.LEFT;
        break;
      case VehicleDirection.RIGHT:
        // prePosX = (Math.floor(this.x / GameConstant.TILE_SIZE) + 1) * GameConstant.TILE_SIZE;
        // prePosY = this.y;
        posX = prePosX + 64;
        posY = prePosY - 64;
        newDirection = VehicleDirection.UP;
        break;
      case VehicleDirection.DOWN:
        // prePosX = this.x;
        // prePosY = (Math.floor(this.y / GameConstant.TILE_SIZE) + 1) * GameConstant.TILE_SIZE + 16;
        posX = prePosX + 64;
        posY = prePosY + 64;
        newDirection = VehicleDirection.RIGHT;
        break;
      case VehicleDirection.LEFT:
        // prePosX = (Math.floor(this.x / GameConstant.TILE_SIZE)) * GameConstant.TILE_SIZE;
        // prePosY = this.y;
        posX = prePosX - 64;
        posY = prePosY + 64;
        newDirection = VehicleDirection.DOWN;
        break;
    }

    const preTurnLeftTween = Tween.createTween(this, {x: prePosX, y: prePosY}, {
      duration: 0.2,
      // onStart: () => {
      //   console.log(this.x, this.y, prePosX, prePosY,collider2.parent.x, collider2.parent.y);
      // },
      // onComplete: () => {
      //   console.log(this.x, this.y, prePosX, prePosY);
      // }
    });
    const turnLeftTween = Tween.createTween(this, {rotation: this.rotation - Math.PI / 2, x: posX, y: posY}, {
      duration: 0.6,
      onComplete: () => {
        this.state = VehicleState.RUN;
        this.direction = newDirection;
      }
    });

    preTurnLeftTween.chain(turnLeftTween);
    preTurnLeftTween.start();
  }

  _turnRight(collider2) {
    let prePosX = collider2.parent.x;
    let prePosY = collider2.parent.y;
    let posX = 0;
    let posY = 0;
    let newDirection = "";
    switch(this.direction) {
      case VehicleDirection.UP:
        // prePosX = this.x;
        // prePosY = (Math.floor(this.y / GameConstant.TILE_SIZE)) * GameConstant.TILE_SIZE;
        // posX = prePosX + 80;
        // posY = prePosY - 80;
        posX = prePosX + 64;
        posY = prePosY - 64;
        newDirection = VehicleDirection.RIGHT;
        break;
      case VehicleDirection.RIGHT:
        // prePosX = (Math.floor(this.x / GameConstant.TILE_SIZE) + 1) * GameConstant.TILE_SIZE;
        // prePosY = this.y;
        posX = prePosX + 64;
        posY = prePosY + 64;
        newDirection = VehicleDirection.DOWN;
        break;
      case VehicleDirection.DOWN:
        // prePosX = this.x;
        // prePosY = (Math.floor(this.y / GameConstant.TILE_SIZE) + 1) * GameConstant.TILE_SIZE;
        posX = prePosX - 64;
        posY = prePosY + 64;
        newDirection = VehicleDirection.LEFT;
        break;
      case VehicleDirection.LEFT:
        // prePosX = (Math.floor(this.x / GameConstant.TILE_SIZE)) * GameConstant.TILE_SIZE;
        // prePosY = this.y;
        posX = prePosX - 64;
        posY = prePosY - 64;
        newDirection = VehicleDirection.UP;
        break;
    }

    const preTurnRightTween = Tween.createTween(this, {x: prePosX, y: prePosY}, {
      duration: 0.2,
      // onStart: () => {
      //   console.log(this.x, this.y, prePosX, prePosY,collider2.parent.x, collider2.parent.y);
      // },
      // onComplete: () => {
      //   console.log(this.x, this.y, prePosX, prePosY);
      // }
    });
    const turnRightTween = Tween.createTween(this, {rotation: this.rotation + Math.PI / 2, x: posX, y: posY}, {
      duration: 0.6,
      onComplete: () => {
        this.state = VehicleState.RUN;
        this.direction = newDirection;
        console.log(this.collider.width, this.collider.height);
      }
    });

    preTurnRightTween.chain(turnRightTween);
    preTurnRightTween.start();
  }

  _turnBack(collider2) {
    let prePosX = collider2.parent.x;
    let prePosY = collider2.parent.y;
    let posX = 0;
    let posY = 0;
    let newDirection = "";
    switch(this.direction) {
      case VehicleDirection.UP:
        // prePosX = this.x;
        // prePosY = (Math.floor(this.y / GameConstant.TILE_SIZE)) * GameConstant.TILE_SIZE - 64;
        posX = prePosX;
        posY = prePosY - 64;
        newDirection = VehicleDirection.DOWN;
        break;
      case VehicleDirection.RIGHT:
        // prePosX = (Math.floor(this.x / GameConstant.TILE_SIZE) + 1) * GameConstant.TILE_SIZE + 64;
        // prePosY = this.y;
        posX = prePosX + 64;
        posY = prePosY;
        newDirection = VehicleDirection.LEFT;
        break;
      case VehicleDirection.DOWN:
        // prePosX = this.x;
        // prePosY = (Math.floor(this.y / GameConstant.TILE_SIZE) + 1) * GameConstant.TILE_SIZE + 64;
        posX = prePosX;
        posY = prePosY + 64;
        newDirection = VehicleDirection.UP;
        break;
      case VehicleDirection.LEFT:
        // prePosX = (Math.floor(this.x / GameConstant.TILE_SIZE)) * GameConstant.TILE_SIZE - 64;
        // prePosY = this.y;
        posX = prePosX - 64;
        posY = prePosY;
        newDirection = VehicleDirection.RIGHT;
        break;
    }

    const preTurnBackTween = Tween.createTween(this, {x: prePosX, y: prePosY}, {
      duration: 0.2,
    });
    const turnBackTween = Tween.createTween(this, {rotation: this.rotation + Math.PI, x: posX, y: posY}, {
      duration: 0.5,
      onComplete: () => {
        this.state = VehicleState.RUN;
        this.direction = newDirection;
      }
    });

    preTurnBackTween.chain(turnBackTween);
    preTurnBackTween.start();
  }

  _run(dt) {
    switch(this.direction) {
      case VehicleDirection.UP:
        this.y -= this.velocity * dt;
        break;
      case VehicleDirection.RIGHT:
        this.x += this.velocity * dt;
        break;
      case VehicleDirection.DOWN:
        this.y += this.velocity * dt;
        break;
      case VehicleDirection.LEFT:
        this.x -= this.velocity * dt;
        break;
    }
  }

  startRun() {
    this.emit("click");
    console.log("click");
    // this.onTurnLeft();
    this.state = VehicleState.RUN;
    this.collider.enabled = true;
  }

  _die() {
    console.log("die");
  }

  _initCollider() {
    this.collider = new Collider(CollisionTag.Vehicle);
    this.collider.enabled = false;
    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
    this.addChild(this.collider);
  }

  onCollide(collider2) {
    switch(collider2.tag) {
      case CollisionTag.Obstacle:
        this.onObstacleCollide(collider2);
        break;
      case CollisionTag.PavementBrick:
        this.onPavementBrickCollide(collider2);
        break;
      case CollisionTag.TurnLeftSign:
        this.onTurnDirection(CollisionTag.TurnLeftSign, collider2);
        break;
      case CollisionTag.TurnRightSign:
        this.onTurnDirection(CollisionTag.TurnRightSign, collider2);
        break;
      case CollisionTag.TurnBackSign:
        this.onTurnDirection(CollisionTag.TurnBackSign, collider2);
        break;
    }
  }
  
  setDirection(direction) {
    this.direction = direction;
  }
}