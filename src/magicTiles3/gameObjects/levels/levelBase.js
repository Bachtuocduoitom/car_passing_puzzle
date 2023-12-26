import { Container, Rectangle, Texture } from "pixi.js";
import { LevelEvent } from "./levelEvent";
import { DirectionSignSpawner } from "../directionSigns/directionSignSpawner";
import { DirectionSignDirection } from "../directionSigns/directionSignDirection";

export class LevelBase extends Container{
  constructor(directionSignSpawner) {
    super();
    this.autoStart = true;
    /** @type {Array<Vehicle>} */
    this.vehicles = [];
    this.directionSigns = [];
    this.directionSignSpawner = directionSignSpawner;
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

        const texture = new Texture(this.tilesetTexture, new Rectangle(column * this.tileWidth - 1.2, row * this.tileHeight - 1.2, this.tileWidth, this.tileHeight));
        return texture;
    }
    return null; // Return null for empty tiles
  }

  _createDirectionSign(type = null, direction = DirectionSignDirection.RIGHT, position = null) {
    let directionSign = this.directionSignSpawner.spawnDirectionSign(type, direction, position);
    console.log(directionSign.direction);
    this.directionSigns.push(directionSign);
    this.map.addChild(directionSign);
  }
}