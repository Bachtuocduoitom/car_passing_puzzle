import { Graphics, Sprite, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureRect } from "../../pureDynamic/PixiWrapper/pureRect";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameSetting } from "../gameSetting";
export class Grid extends Graphics {
  constructor() {
    super();
    this.beatLine = new Sprite(Texture.from("spr_line"));
    this.beatLine.anchor.set(0.5);
    this.addChild(this.beatLine);
    this.draw();
    this._initContainer();
  }

  draw() {
    this.clear();

    this.beatPos = GameSetting.beatPos.value;
    this.gameWidth = GameConstant.GAME_WIDTH;
    let lineWidth = 2;

    if (GameResizer.isLandScape()) {
      this.gameWidth = GameConstant.GAME_WIDTH * GameConstant.GRID_LANDSCAPE_SCALE;
      lineWidth = 6;
    }
    this.lineStyle(lineWidth, 0xFFFFFF, 1);

    this.colWidth = this.gameWidth / GameConstant.COLUMN_COUNT;
    this.startPos = GameResizer.width / 2 - this.colWidth * (GameConstant.COLUMN_COUNT / 2); // center grid

    for (var i = 0; i <= GameConstant.COLUMN_COUNT; i++) {
      var x = (this.startPos + i * this.gameWidth / GameConstant.COLUMN_COUNT);
      this.moveTo(x, 0);
      this.lineTo(x, GameResizer.height);
    }

    this.beatLine.width = GameResizer.width;
    this.beatLine.x = GameResizer.width / 2;
    this.beatLine.y = this.beatPos;
  }

  _initContainer() {
    let pTransform = new PureTransform({
      alignment : Alignment.VERTICAL_MIDDLE,
      width     : GameConstant.GAME_WIDTH,
    });
    let lTrasnform = new PureTransform({
      alignment : Alignment.VERTICAL_MIDDLE,
      width     : GameConstant.GAME_WIDTH * GameConstant.GRID_LANDSCAPE_SCALE,
    });
    this.container = new PureRect(pTransform, lTrasnform);
  }
}
