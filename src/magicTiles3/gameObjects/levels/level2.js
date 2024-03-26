import { LevelBase } from "./levelBase";
import level2 from "../../../../assets/jsons/level2.json";
import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { Taxi } from "../vehicles/taxi";
import { DirectionSign } from "../directionSigns/directionSign";
import { DirectionSignDirection } from "../directionSigns/directionSignDirection";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { VehicleDirection } from "../vehicles/vehicleDirection";
import { DirectionSignsBoardEvent } from "../directionSignsBoard/directionSignsBoardEvent";
import { VehicleEvent } from "../vehicles/vehicleEvent";
import { LevelEvent } from "./levelEvent";
import { Util } from "../../../helpers/utils";
import { PavementBrick } from "../obstacles/pavementBrick";
import { Goal } from "../obstacles/goal";

export class Level2 extends LevelBase {
 constructor(directionSignSpawner, obstacleSpawner, directionSignsBoard, levelData) {
    super(directionSignSpawner, obstacleSpawner, directionSignsBoard, levelData);
    this._generateMap();
 }

  update(dt) {
    super.update(dt);
    
  }

  _config() {
    super._config();
    this.map.scale.set(1);

    this.mapWidth = this.levelData.width;
    this.mapHeight = this.levelData.height;
    this.tileWidth = this.levelData.tilewidth;
    this.tileHeight = this.levelData.tileheight;
    this.numOfLayers = this.levelData.layers.length;
    this.tileset = this.levelData.tilesets[0].source;
    this.layers = this.levelData.layers;

    this.tilesetTexture = Texture.from("tileset_1");
    this.tilesetTextureSize = {x: 64, y: 64};

    this.directionSignsBoard.setNumOfSignItems(
      this.levelData.numberOfTurnRightSignItems,
      this.levelData.numberOfTurnLeftSignItems, 
      this.levelData.numberOfTurnBackSignItems,);
  }

  start() {
    super.start();
    this.directionSignsBoard.on(DirectionSignsBoardEvent.ItemChoose, (tag) => {
      this.typeOfSignOnChosen = tag;
      console.log("typeOfSignOnChosen:", this.typeOfSignOnChosen);
      this.noneSigns.forEach((noneSign) => {
        noneSign.showOutline();
      })
    })

    this.directionSignsBoard.on(DirectionSignsBoardEvent.ItemUnChoose, (tag) => {
      this.typeOfSignOnChosen = null;
      this.noneSigns.forEach((noneSign) => {
        noneSign.hideOutline();
      })
    })
  }

  _generateMap() {
    for (let i = 0; i < this.numOfLayers; i++) {    
      if (this.layers[i].name === GameConstant.OBSTACLE_LAYER) {
        this._createDirectionSigns(i);
      } else if (this.layers[i].name === GameConstant.PLAYER_LAYER) {
        //this._createVehicle(i);
      } else if (this.layers[i].name === "Player") {
        this._createCar(i);
      } else if (this.layers[i].name === "Stars") {
        this._createStars(i);
      } else if (this.layers[i].name === "Goal") {
        this._createGoal(i);
      } else {
        this._generateMapLayer(i);
      }
    }
  }

  _generateMapLayer(layerIndex) {
    let offSetX = this.mapWidth * this.tileWidth / 2;
    let offSetY = this.mapHeight * this.tileHeight / 2;
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        let tileValue = this.layers[layerIndex].data[row * this.mapWidth + col];
        let tileSprite;
        if (tileValue == "2847" || tileValue == "2845" 
          || tileValue == "2593" || tileValue == "2587" 
          || tileValue == "2463" || tileValue == "2461" 
          || tileValue == "2721" || tileValue == "2715") {
          //generate pavement brick tile
          tileSprite = new PavementBrick(CollisionTag.PavementBrick, this._getTileTexture(tileValue));
          this.tileBrick.push(tileSprite);
        } else {
          //generate normal tile
          tileSprite = new Sprite(this._getTileTexture(tileValue));
        }
        tileSprite.zIndex = layerIndex;
        tileSprite.scale.set(1.05); //set scale to fill empty spaces
        tileSprite.x = col * this.tileWidth - offSetX;
        tileSprite.y = row * this.tileHeight - offSetY;  
        this.map.addChild(tileSprite);
        
      }
    }
  }

  _createCar(layerIndex) {
    this.taxi = new Taxi();
    let carData = this.layers[layerIndex].objects[0];
    let position = {x: carData.x + this.tileWidth/2 - this.mapWidth * this.tileWidth / 2, 
                    y: carData.y + this.tileHeight/2 - 32 - this.mapHeight * this.tileHeight / 2};

    this.taxi.setInitialState(position, carData.rotation, layerIndex);

    //collide with obstacle
    this.taxi.on(VehicleEvent.CollideObstacle, (collider2) => {
      this.initialCollideWithVehicle = collider2;
      this.emit(LevelEvent.OnVehicleCollisionWithObstacle);
    });

    //collide with pavementBrick
    this.taxi.on(VehicleEvent.CollidePavementBrick, (collider2) => {
      this.initialCollideWithVehicle = collider2;
      this.emit(LevelEvent.OnVehicleDie);
    });

    //collide with star
    this.taxi.on(VehicleEvent.CollideStar, (collider2) => {
      this.initialCollideWithVehicle = collider2;
      this.emit(LevelEvent.OnVehicleCollisionWithStar);
    });

    //collide with goal
    this.taxi.on(VehicleEvent.CollideGoal, (collider2) => {
      this.emit(LevelEvent.OnVehicleCollisionWithGoal, this.numOfStarCollected);
    });

    //complete die
    this.taxi.on(VehicleEvent.CompleteDie, () => {
      this.emit(LevelEvent.LevelFail);
    });

    this.map.addChild(this.taxi);
    this.vehicles.push(this.taxi);
    console.log("vehicles:", this.vehicles);
  }

  _createStars(layerIndex) {
    for (let i = 0; i < this.layers[layerIndex].objects.length; i++) {
      let starData = this.layers[layerIndex].objects[i];
      let position = {x: starData.x + this.tileWidth/2 - this.mapWidth * this.tileWidth / 2, 
                      y: starData.y + this.tileHeight/2 - 32 - this.mapHeight * this.tileHeight / 2};
      this._createStarAtPostion(position, layerIndex);
    }
  }

  _createGoal(layerIndex) {
    let goalData = this.layers[layerIndex].objects[0];
    this.goal = new Goal(CollisionTag.Goal);
    this.goal.x = goalData.x + this.tileWidth/2 - this.mapWidth * this.tileWidth / 2;
    this.goal.y = goalData.y + this.tileHeight/2 - 32 - this.mapHeight * this.tileHeight / 2;
    this.goal.zIndex = layerIndex;
    this.map.addChild(this.goal);
  }


  /**
   * code for directionSigns:
   * 11: turn right - direction right
   * 12: turn right - direction down
   * 13: turn right - direction left
   * 14: turn right - direction up
   * 21: turn left - direction right
   * 22: turn left - direction down
   * 23: turn left - direction left
   * 24: turn left - direction up
   * 31: turn back - direction right
   * 32: turn back - direction down
   * 33: turn back - direction left
   * 34: turn back - direction up
   * 41: none - direction right
   * 42: none - direction down
   * 43: none - direction left
   * 44: none - direction up
   **/
  _createDirectionSigns(layerIndex) {
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        let tileValue = this.layers[layerIndex].data[row * this.mapWidth + col];
        let position = {x: col * this.tileWidth + 32 / 2 - this.mapWidth * this.tileWidth / 2, 
                        y: row * this.tileHeight + 32 / 2 - this.mapHeight * this.tileHeight / 2}; 
        switch (tileValue) {
          case 0:
            break;
          case 11:
            this._createDirectionSign(CollisionTag.TurnRightSign, DirectionSignDirection.RIGHT, position, layerIndex);
            break;
          case 12:
            this._createDirectionSign(CollisionTag.TurnRightSign, DirectionSignDirection.DOWN, position, layerIndex);
            break;
          case 13:
            this._createDirectionSign(CollisionTag.TurnRightSign, DirectionSignDirection.LEFT, position, layerIndex);
            break;
          case 14:
            this._createDirectionSign(CollisionTag.TurnRightSign, DirectionSignDirection.UP, position, layerIndex);
            break;
          case 21:
            this._createDirectionSign(CollisionTag.TurnLeftSign, DirectionSignDirection.RIGHT, position, layerIndex);
            break;
          case 22:
            this._createDirectionSign(CollisionTag.TurnLeftSign, DirectionSignDirection.DOWN, position, layerIndex);
            break;
          case 23:
            this._createDirectionSign(CollisionTag.TurnLeftSign, DirectionSignDirection.LEFT, position, layerIndex);
            break;
          case 24:
            this._createDirectionSign(CollisionTag.TurnLeftSign, DirectionSignDirection.UP, position, layerIndex);
            break;
          case 31:
            this._createDirectionSign(CollisionTag.TurnBackSign, DirectionSignDirection.RIGHT, position, layerIndex);            
            break;
          case 32:
            this._createDirectionSign(CollisionTag.TurnBackSign, DirectionSignDirection.DOWN, position, layerIndex);            
            break;
          case 33:
            this._createDirectionSign(CollisionTag.TurnBackSign, DirectionSignDirection.LEFT, position, layerIndex);            
            break;
          case 34:
            this._createDirectionSign(CollisionTag.TurnBackSign, DirectionSignDirection.UP, position, layerIndex);            
            break;
          case 41:
            this._createDirectionSign(CollisionTag.NoneSign, DirectionSignDirection.RIGHT, position, layerIndex);
            break;
          case 42:
            this._createDirectionSign(CollisionTag.NoneSign, DirectionSignDirection.DOWN, position, layerIndex);
            break;
          case 43:
            this._createDirectionSign(CollisionTag.NoneSign, DirectionSignDirection.LEFT, position, layerIndex);
            break;
          case 44:
            this._createDirectionSign(CollisionTag.NoneSign, DirectionSignDirection.UP, position, layerIndex);
            break;
          case 51:
            this._createObstacle(position, layerIndex);
            break;
        }       
      }
    }
  }

  startPlay() {
    this.vehicles.forEach((vehicle) => {
      vehicle.startRun();
    })
    this.directionSignsBoard.hide();
    this.noneSigns.forEach((noneSign) => {
      noneSign.hideOutline();
    })
  }

  reset() {
    this.numOfStarCollected = 0;
    this.typeOfSignOnChosen = null;
    this.initialCollideWithVehicle = null;

    this.vehicles.forEach((vehicle) => {
      vehicle.resetInitialState();
    });

    this.obstacles.forEach((obstacle) => {
      obstacle.resetInitialState();
    });

    this.stars.forEach((star) => {
      star.resetInitialState();
    });

    for (let i = this.addedDirectionSigns.length - 1; i >= 0; i--) {
      let addedDirectionSign = this.addedDirectionSigns[i];
      addedDirectionSign.setTag(CollisionTag.NoneSign);
      addedDirectionSign.hideOutline();
      this.addedDirectionSigns.splice(i, 1);
      this.noneSigns.push(addedDirectionSign);
    }

    //Reset directionSignsBoard
    this.directionSignsBoard.setNumOfSignItems(
      this.levelData.numberOfTurnRightSignItems,
      this.levelData.numberOfTurnLeftSignItems, 
      this.levelData.numberOfTurnBackSignItems,);

      this.directionSignsBoard.show();
  }

  destroySelf() {
    this.vehicles.forEach((vehicle) => {
      vehicle.reset();
      this.map.removeChild(vehicle);
    });

    this.obstacles.forEach((obstacle) => {
      obstacle.reset();
      this.obstacleSpawner.deSpawnObstacle(obstacle);
      // this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
    });

    this.stars.forEach((star) => {
      star.reset();
      this.obstacleSpawner.deSpawnStar(star);
      // this.stars.splice(this.stars.indexOf(star), 1);
    });

    for (let i = this.addedDirectionSigns.length - 1; i >= 0; i--) {
      let addedDirectionSign = this.addedDirectionSigns[i];
      addedDirectionSign.setTag(CollisionTag.NoneSign);
      this.addedDirectionSigns.splice(i, 1);
      this.noneSigns.push(addedDirectionSign);
    }

    for (let i = this.noneSigns.length - 1; i >= 0; i--) {
      let noneSign = this.noneSigns[i];
      noneSign.hideOutline();
      noneSign.reset();
      this.directionSignSpawner.despawnDirectionSign(noneSign);
      this.noneSigns.splice(i, 1);
    }

    this.givenDirectionSigns.forEach((givenDirectionSign) => {
      givenDirectionSign.reset();
      this.directionSignSpawner.despawnDirectionSign(givenDirectionSign);
      this.givenDirectionSigns.splice(this.givenDirectionSigns.indexOf(givenDirectionSign), 1);
    });

    this.tileBrick.forEach((tile) => {
      tile.removeCollider();
      this.map.removeChild(tile);
    });

    this.emit(LevelEvent.Complete);
    this.removeAllListeners();
  }
  
}