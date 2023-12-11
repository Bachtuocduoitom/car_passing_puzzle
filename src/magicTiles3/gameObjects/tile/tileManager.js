import { AssetSelector } from "../../assetSelector";
import { TileShort } from "./tileShort";
import { PureTransform } from "../../../pureDynamic/core/pureTransform";
import { GameConstant } from "../../../gameConstant";
import { Alignment } from "../../../pureDynamic/core/pureTransformConfig";
import { TileLong } from "./tileLong";
import { Util } from "../../../helpers/utils";
import { Spawner, SpawnerEvent } from "../../../systems/spawners/spawner";
export class TileManager {
  constructor(parent) {
    this.parent = parent;
    this._initTileSpawner();
    this.tileShortTexture = AssetSelector.getTileShortTexture();
    this.touchedTexture = AssetSelector.getTileTouchedTexture();
    this.tileLongTexture = AssetSelector.getTileLongTexture();
    this.holdTexture = AssetSelector.getTileHoldTexture();
    this.tileShortCorners = AssetSelector.getTileShortCorners();
    this.tileLongCorners = AssetSelector.getTileLongCorners();
    this.tileLongColor = AssetSelector.getTileLongColor();
    this.holdCorners = AssetSelector.getTileHoldCorners();
    this.middleTexture = AssetSelector.getTileLongMiddleTexture();
    this.middleCorners = AssetSelector.getTileLongMiddleCorners();

    this.holdScores = [
      { threshold: 0, score: 3 },
      { threshold: 1, score: 6 },
      { threshold: 1.5, score: 9 },
    ];
    /** @type {Array<Tile> } */
    this.tiles = [];
  }

  reset() {
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      const tile = this.tiles[i];
      tile.parent.removeChild(tile.tile.displayObject);
      tile.emitter.emit(SpawnerEvent.Despawn);
    }
    this.tiles = [];
  }

  _initTileSpawner() {
    this.tileShortSpawner = new Spawner();
    this.tileShortSpawner.init(() => {
      return new TileShort();
    }, 10);
    this.tileLongSpawner = new Spawner();
    this.tileLongSpawner.init(() => {
      return new TileLong();
    }, 10);
  }

  createTileShort(container, xIndex, y, height) {
    const transform = new PureTransform({
      container,
      alignment  : Alignment.TOP_LEFT,
      usePercent : true,
      x          : xIndex / GameConstant.COLUMN_COUNT,
      y          : y,
      width      : 1 / GameConstant.COLUMN_COUNT,
      height     : height,
    });
    const corners = this.tileShortCorners;
    const tile = this.tileShortSpawner.spawn();
    tile.setDisplay(this.parent, transform);
    tile.touchedAlpha = AssetSelector.getTileTouchedAlpha();
    tile.initSprite(this.tileShortTexture, corners.left, corners.top, corners.right, corners.bottom);
    tile.emitter.emit(SpawnerEvent.Spawn);
    tile.emitter.once(SpawnerEvent.Despawn, () => {
      tile.reset();
      this.tileShortSpawner.despawn(tile);
    });

    this.tiles.push(tile);
    return tile;
  }

  createTileLong(container, xIndex, y, height, duration) {
    let corners = this.tileLongCorners;

    const transform = new PureTransform({
      container,
      alignment  : Alignment.TOP_LEFT,
      usePercent : true,
      x          : xIndex / GameConstant.COLUMN_COUNT,
      y          : y,
      width      : 1 / GameConstant.COLUMN_COUNT,
      height     : height,
    });
    const tile = this.tileLongSpawner.spawn();
    tile.setDisplay(this.parent, transform);
    tile.touchedAlpha = AssetSelector.getTileTouchedAlpha();
    tile.initSprite(this.tileLongTexture, corners.left, corners.top, corners.right, corners.bottom);
    tile.emitter.emit(SpawnerEvent.Spawn);
    tile.emitter.once(SpawnerEvent.Despawn, () => {
      this.tileLongSpawner.despawn(tile);
      tile.reset();
      tile.onDespawn();
      tile.parent.removeChild(tile.tile);
    });
    tile.initTxtHoldScore(this.getTileLongScore(duration));
    tile.tile.displayObject.tint = AssetSelector.getTileLongColor();

    if (this.holdTexture) {
      corners = this.holdCorners;
      tile.initHoldSprite(this.holdTexture, corners.left, corners.top, corners.right, corners.bottom);
    }

    if (this.middleTexture) {
      corners = this.middleCorners;
      tile.initMiddleSprite(this.middleTexture, AssetSelector.isTileMiddleBelowHold, corners.left, corners.top, corners.right, corners.bottom);
      tile.middle.displayObject.alpha = AssetSelector.getTileLongMiddleAlpha();
    }

    this.tiles.push(tile);
    return tile;
  }


  /**
   * @param {Array} songData
   */
  createTilePosition(songData) {
    const previousTileSpawnIndex = {
      value            : Util.randomInt(0, 3),
      timeAppear       : -1,
      afterDoubleValue : null,
    };

    this.tilePositions = [];
    const dataLength = songData.length;
    for (let i = 0; i < dataLength; i++) {
      let isDoubleNote = false;
      if (i + 1 < dataLength) {
        isDoubleNote = Math.abs(songData[i + 1].t - songData[i].t) < GameConstant.DOUBLE_NOTE_RANGE; // first note of double note
      }

      const tilePositionData = this.getSpawnPosition(songData[i].t - GameConstant.SONG_OFFSET, previousTileSpawnIndex, isDoubleNote);
      tilePositionData.index = i;
      tilePositionData.duration = songData[i].d;
      this.tilePositions.push(tilePositionData);
      // console.log(tilePositionData.y);
    }
  }

  /**
   * Generate (x, y) position base on data read from json file.
   * @param {number} timeAppear time in second that the tile should be appeared.
   * @param {number} previousPos position index of previous position, this used to avoid generating 2 continuous tiles with the same place.
   * @param {boolean} isDoubleNote is this tile is first note of a pair of double note.
   * @returns {Point} Position in x and y coordinate
   */
  getSpawnPosition(timeAppear, previousPos, isDoubleNote) {
    let xIndex = 0;
    let isSecondNoteOfDoubleNotes = false;

    if (previousPos.afterDoubleValue !== null) { // this note is placed after a double note
      xIndex = previousPos.afterDoubleValue;
      previousPos.afterDoubleValue = null;
    }
    else {
      if (Math.abs(timeAppear - previousPos.timeAppear) <= GameConstant.DOUBLE_NOTE_RANGE) { // second note of a double note
        isSecondNoteOfDoubleNotes = true;
        switch (previousPos.value) {
        case 0:
          xIndex = 2;
          previousPos.afterDoubleValue = Util.randomFromList([1, 3]);
          break;
        case 1:
          xIndex = 3;
          previousPos.afterDoubleValue = Util.randomFromList([0, 2]);
          break;
        case 2:
          xIndex = 0;
          previousPos.afterDoubleValue = Util.randomFromList([1, 3]);
          break;
        case 3:
          xIndex = 1;
          previousPos.afterDoubleValue = Util.randomFromList([0, 2]);
          break;
        default:
          break;
        }
      }
      else {
        // normal note
        if (isDoubleNote) {
          if (previousPos.value === 0 || previousPos.value === 2) {
            xIndex = Util.randomFromList([1, 3]);
          }
          else {
            xIndex = Util.randomFromList([0, 2]);
          }
        }
        else {
          xIndex = Util.getRandomIntExclude(0, 3, previousPos.value);
        }
      }
    }

    previousPos.value = xIndex;
    previousPos.timeAppear = timeAppear;

    const y = -GameConstant.SPEED * timeAppear;
    return { xIndex: xIndex, y, isSecondNoteOfDoubleNotes };
  }

  getTileLongScore(duration) {
    for (let i = this.holdScores.length - 1; i >= 0; i--) {
      const holdScore = this.holdScores[i];
      if (duration >= holdScore.threshold) {
        return holdScore.score;
      }
    }
    return 0;
  }
}
