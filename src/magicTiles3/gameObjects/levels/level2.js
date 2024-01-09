import { LevelBase } from "./levelBase";
import level2 from "../../../../assets/jsons/level2.json";
import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { Taxi } from "../vehicles/taxi";
import { DirectionSign } from "../directionSigns/directionSign";
import { DirectionSignDirection } from "../directionSigns/directionSignDirection";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { VehicleDirection } from "../vehicles/vehicleDirection";

export class Level2 extends LevelBase {
 constructor(directionSignSpawner) {
    super(directionSignSpawner);
    this._generateMap();
 }

  update(dt) {
    super.update(dt);
    
  }

  _config() {
    super._config();
    this.map.scale.set(1);

    this.mapWidth = level2.width;
    this.mapHeight = level2.height;
    this.tileWidth = level2.tilewidth;
    this.tileHeight = level2.tileheight;
    this.numOfLayers = level2.layers.length;
    this.tileset = level2.tilesets[0].source;
    this.layers = level2.layers;

    this.tilesetTexture = Texture.from("tileset_1");
    this.tilesetTextureSize = {x: 64, y: 64};
  }

  _generateMap() {
    for (let i = 0; i < this.numOfLayers; i++) {    
      if (this.layers[i].name === GameConstant.OBSTACLE_LAYER) {
        this._createDirectionSigns(i);
      } else if (this.layers[i].name === GameConstant.PLAYER_LAYER) {
        this._createVehicle(i);
      } else {
        this._generateMapLayer(i);
      }
    }
  }

  _generateMapLayer(layerIndex) {
    // let tileValue = 0;
    let offSetX = this.mapWidth * this.tileWidth / 2;
    let offSetY = this.mapHeight * this.tileHeight / 2;
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        let tileValue = this.layers[layerIndex].data[row * this.mapWidth + col];
        let tileSprite = new Sprite(this._getTileTexture(tileValue));
        tileSprite.zIndex = layerIndex;
        tileSprite.x = col * this.tileWidth - offSetX;
        tileSprite.y = row * this.tileHeight - offSetY;  
        this.map.addChild(tileSprite);
        
      }
    }
  }

  _createVehicle(layerIndex) {
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        let tileValue = this.layers[layerIndex].data[row * this.mapWidth + col];
        if (tileValue !== 0) {
          this.taxi = new Taxi();
          switch(tileValue) {
            case 1:
              this.taxi.direction = VehicleDirection.RIGHT;
              this.taxi.rotation = - Math.PI / 2;
              break;
            case 2:
              this.taxi.direction = VehicleDirection.DOWN;
              break;
            case 3:
              this.taxi.direction = VehicleDirection.LEFT;
              this.taxi.rotation = Math.PI / 2;
              break;
            case 4:
              this.taxi.direction = VehicleDirection.UP;
              this.taxi.rotation = Math.PI;
              break;
          }
          this.taxi.x = col * this.tileWidth - this.mapWidth * this.tileWidth / 2;
          this.taxi.y = row * this.tileHeight + this.tileHeight/2 - this.mapHeight * this.tileHeight / 2;
          this.taxi.zIndex = layerIndex;
          this.map.addChild(this.taxi);   
          this.vehicles.push(this.taxi);
        }
      }
    }
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
   **/
  _createDirectionSigns(layerIndex) {
    for (let row = 0; row < this.mapHeight; row++) {
      for (let col = 0; col < this.mapWidth; col++) {
        let tileValue = this.layers[layerIndex].data[row * this.mapWidth + col];
        let position = {x: col * this.tileWidth + 32 / 2 - this.mapWidth * this.tileWidth / 2, y: row * this.tileHeight + 32 / 2 - this.mapHeight * this.tileHeight / 2}; 
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
        }       
      }
    }
  }
  
}