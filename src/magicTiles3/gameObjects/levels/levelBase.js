import { Container, Rectangle, Texture } from "pixi.js";
import { LevelEvent } from "./levelEvent";

export class LevelBase extends Container{
  constructor() {
    super();
    this.autoStart = true;
    /** @type {Array<Vehicle>} */
    this.vehicles = [];
  }

  update(dt) {
    this.vehicles.forEach(vehicle => {
      vehicle.update(dt);
    });
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
}