import { Container, Rectangle, Texture } from "pixi.js";
import { LevelEvent } from "./levelEvent";
import { DirectionSignSpawner } from "../directionSigns/directionSignSpawner";
import { DirectionSignDirection } from "../directionSigns/directionSignDirection";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { DirectionSignsBoard } from "../directionSignsBoard/directionSignsBoard";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { DirectionSignsBoardEvent } from "../directionSignsBoard/directionSignsBoardEvent";
import { UserData } from "../../data/userData";
import { DataManager } from "../../data/dataManager";

export class LevelBase extends Container{
  constructor(directionSignSpawner, obstacleSpawner, directionSignsBoard, levelData) {
    super();
    this.autoStart = true;
    /** @type {Array<Vehicle>} */
    this.numOfStarCollected = 0;
    this.vehicles = [];
    this.obstacles = [];
    this.stars = [];
    this.noneSigns = [];
    this.givenDirectionSigns = [];
    this.addedDirectionSigns = [];
    this.directionSignSpawner = directionSignSpawner;
    this.obstacleSpawner = obstacleSpawner;
    this.directionSignsBoard = directionSignsBoard;
    this.levelData = levelData;
    this.levelQuestionsData = DataManager.getLevelQuestionsData();
    this.typeOfSignOnChosen = null;

    //doi tuong vehicle dang va cham
    this.initialCollideWithVehicle = null;
    this._config();
  }

  update(dt) {
    this.vehicles.forEach(vehicle => {
      vehicle.update(dt);
    });
  }

  _config() {
    this.map = new Container();
    this.map.sortableChildren = true;
    this.addChild(this.map);

    
  }

  start() {
    this.emit(LevelEvent.Start);
  }

  complete() {
    this.emit(LevelEvent.Complete);
  }

  pause() {
  }

  resume() {
  }

  _getTileTexture(tileValue) {
    if (tileValue !== 0) {
        const tileIndex = tileValue - 1; //tile indices start from 1 in tilemap editor

        const column = tileIndex % this.tilesetTextureSize.x;
        const row = Math.floor(tileIndex / this.tilesetTextureSize.y);

        const texture = new Texture(this.tilesetTexture, new Rectangle(column * this.tileWidth, 
          row * this.tileHeight, 
          this.tileWidth, 
          this.tileHeight));
        return texture;
    }
    return null; // Return null for empty tiles
  }

  _createDirectionSign(type = null, direction = DirectionSignDirection.RIGHT, position = null, zIndex = 0) {
    let directionSign = this.directionSignSpawner.spawnDirectionSign(type, direction, position);
    directionSign.zIndex = zIndex;
    directionSign.eventMode = "static";

    if (type === CollisionTag.NoneSign) {
      this.noneSigns.push(directionSign);
      directionSign.on("pointerdown", () => {
        //check if type of sign on chosen is Not Null and this direction sign still None Sign
        if (this.typeOfSignOnChosen != null && directionSign.getTag() === CollisionTag.NoneSign) { 
          directionSign.setTag(this.typeOfSignOnChosen); // set tag for none sign

          this.addedDirectionSigns.push(directionSign); // add to added list
          this.noneSigns.splice(this.noneSigns.indexOf(directionSign), 1); // remove from none list
          
          directionSign.hideOutline(); // hide outline
          

          this.directionSignsBoard.emit(DirectionSignsBoardEvent.HandleAfterAddSign, this.typeOfSignOnChosen);
          this.noneSigns.forEach((noneSign) => {
            noneSign.hideOutline();
          });

          this.typeOfSignOnChosen = null; // reset type of sign on chosen
        }
      })
    } else {
      this.givenDirectionSigns.push(directionSign);
    }
    this.map.addChild(directionSign);
  }

  _createObstacle(position = null, zIndex = 0) {
    let obstacle = this.obstacleSpawner.spawnObstacle(position);
    obstacle.zIndex = zIndex;
    this.obstacles.push(obstacle);
    this.map.addChild(obstacle);
  }

  _createStarAtPostion(position = null, zIndex = 0) {
    let star = this.obstacleSpawner.spawnStar(position);
    star.zIndex = zIndex;
    this.stars.push(star);
    this.map.addChild(star);
  }

  handleTrueAnswer() {
    this.vehicles.forEach(vehicle => {
      vehicle.onContinue();
    });
    if (this.initialCollideWithVehicle?.tag == CollisionTag.Star) {
      this.numOfStarCollected++;
      
    }
    this.initialCollideWithVehicle.parent.visible = false;
    this.initialCollideWithVehicle.enabled = false;
    this.initialCollideWithVehicle = null;
  }

  handleFalseAnswer() {
    console.log(this.initialCollideWithVehicle.tag);
    if (this.initialCollideWithVehicle?.tag == CollisionTag.Obstacle) {
      this.vehicles.forEach(vehicle => {
        vehicle.onDie();
        this.emit(LevelEvent.OnVehicleDie);
      });
      this.initialCollideWithVehicle = null;
    } else if (this.initialCollideWithVehicle?.tag == CollisionTag.Star) {
      this.vehicles.forEach(vehicle => {
        vehicle.onContinue();
      });
      this.initialCollideWithVehicle.parent.isSkipped();
      this.initialCollideWithVehicle = null;
    }
    
  }

  getObstacleQuestionData() {
    return this.levelQuestionsData.obstacleQuestion[0];
  }

  getStarQuestionData() {
    return this.levelQuestionsData.starQuestion[0];
  }

  getNumOfStarCollected() {
    return this.numOfStarCollected;
  }
}