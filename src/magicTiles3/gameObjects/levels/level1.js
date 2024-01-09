import { LevelBase } from "./levelBase";
import level1 from "../../../../assets/jsons/level1.json";
import { Container, Rectangle, Sprite, Texture } from "pixi.js";
import { Taxi } from "../vehicles/taxi";
import { DirectionSign } from "../directionSigns/directionSign";
import { DirectionSignDirection } from "../directionSigns/directionSignDirection";
import { CollisionTag } from "../../../physics/aabb/collisionTag";

export class Level1 extends LevelBase {
 constructor(directionSignSpawner) {
    super(directionSignSpawner);
    this._generateMap();
    this._createVehicles();
    this._createDirectionSigns();
 }

  update(dt) {
    super.update(dt);
    
  }

  _config() {
    super._config();
    this.map.scale.set(1.5);

    this.mapWidth = level1.width;
    this.mapHeight = level1.height;
    this.tileWidth = level1.tilewidth;
    this.tileHeight = level1.tileheight;
    this.numOfLayers = level1.layers.length;
    this.tileset = level1.tilesets[0].source;
    this.layers = level1.layers;

    this.tilesetTexture = Texture.from("tileset_1");
    this.tilesetTextureSize = {x: 64,y: 64};
  }

  _generateMap() {
    for (let i = 0; i < this.numOfLayers; i++) {
      this._generateMapLayer(i);
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

  _createVehicles() {
    this.taxi = new Taxi();
    this.taxi.x = 4 * this.tileWidth - this.mapWidth * this.tileWidth / 2;
    this.taxi.y = 5 * this.tileHeight + this.tileHeight/2 - this.mapHeight * this.tileHeight / 2;
    this.taxi.zIndex = 5;
    this.map.addChild(this.taxi);
    this.vehicles.push(this.taxi);
  }

  _createDirectionSigns() {
    // this.directionSign = new DirectionSign();
    // this.directionSign.x = 9 * this.tileWidth + this.directionSign.width /2 - this.mapWidth * this.tileWidth / 2;
    // this.directionSign.y = 5 * this.tileHeight + this.directionSign.height / 2 - this.mapHeight * this.tileHeight / 2;
    // console.log(this.directionSign.x, this.directionSign.y);
    // this.directionSign.zIndex = 4;
    // this.map.addChild(this.directionSign);
    
    // 32 is width and height of direction sign texture
    let position1 = {x: 9 * this.tileWidth + 32 /2 - this.mapWidth * this.tileWidth / 2, y: 5 * this.tileHeight + 32 / 2 - this.mapHeight * this.tileHeight / 2};
    let position2 = {x: 11 * this.tileWidth + 32 /2 - this.mapWidth * this.tileWidth / 2, y: 9   * this.tileHeight + 32 / 2 - this.mapHeight * this.tileHeight / 2};
    this._createDirectionSign(CollisionTag.TurnRightSign, DirectionSignDirection.RIGHT, position1);
    this._createDirectionSign(CollisionTag.TurnBackSign, DirectionSignDirection.DOWN, position2);
  }
  
}