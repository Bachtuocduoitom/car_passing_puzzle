import { TileType } from "./tileType";
import { Tile } from "./tile";
export class TileShort extends Tile {
  constructor() {
    super(TileType.Short);
  }

  onPointerDown(event) {
    super.onPointerDown(event);
    if (!this.isTouched) {
      this.isTouched = true;
      this.tile.displayObject.alpha = this.touchedAlpha;
      this.emitter.emit("remove", this);
    }
  }
}
