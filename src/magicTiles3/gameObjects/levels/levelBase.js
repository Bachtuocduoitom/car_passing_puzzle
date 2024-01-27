import { Container, Rectangle, Texture } from "pixi.js";
import { LevelEvent } from "./levelEvent";
import { DirectionSignSpawner } from "../directionSigns/directionSignSpawner";
import { DirectionSignDirection } from "../directionSigns/directionSignDirection";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { DirectionSignsBoard } from "../directionSignsBoard/directionSignsBoard";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { DirectionSignsBoardEvent } from "../directionSignsBoard/directionSignsBoardEvent";

export class LevelBase extends Container{
  constructor(directionSignSpawner, levelData) {
    super();
    this.autoStart = true;
    /** @type {Array<Vehicle>} */
    this.vehicles = [];
    this.noneSigns = [];
    this.givenDirectionSigns = [];
    this.addedDirectionSigns = [];
    this.directionSignSpawner = directionSignSpawner;
    this.levelData = levelData;
    this.typeOfSignOnChosen = null;
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

    this.directionSignsBoard = new DirectionSignsBoard();
    this.directionSignsBoard.zIndex = 100;
    this.directionSignsBoard.x = GameResizer.width * 1/2 - this.directionSignsBoard.width/2 -80;
    this.directionSignsBoard.y = GameResizer.height * 1/2 - this.directionSignsBoard.height/2 - 20;
    this.addChild(this.directionSignsBoard);
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

    if (type == CollisionTag.NoneSign) {
      this.noneSigns.push(directionSign);
      directionSign.on("pointerdown", () => {
        if (this.typeOfSignOnChosen != null) {
          directionSign.setTag(this.typeOfSignOnChosen); // set tag for none sign
          this.addedDirectionSigns.push(directionSign); // add to added list
          this.noneSigns.splice(this.noneSigns.indexOf(directionSign), 1); // remove from none list
          directionSign.hideOutline(); // hide outline
          directionSign.off("pointerdown"); // remove event

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
}