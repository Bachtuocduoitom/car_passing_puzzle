import { Sprite, TextStyle, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { SoundManager } from "../../soundManager";
import { AssetSelector } from "../assetSelector";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameSetting } from "../gameSetting";
import { PureRect } from "../../pureDynamic/PixiWrapper/pureRect";

export class TutorialScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TUTORIAL);
  }

  create() {
    super.create();
    this._initBg();
    this._initTextFrame();
    this._initSongName();
    this._initSongAuthor();
    this._initTileStatic();
    this._initTxtStart();
    this.resize();
  }

  show() {
    super.show();
    this.resize();
  }

  resize() {
    super.resize();
    this._onResizeTileStatic();
    this._onResizeTxtStart();
  }

  hide() {
    super.hide();
  }

  _initBg() {
    this.root.fill(this, 0x000000, 0.01);
    this.root.graphics.eventMode = "dynamic";
    this.root.graphics.on("pointerdown", this.startGame.bind(this));
  }

  _initTileStatic() {
    let texture = AssetSelector.getTileShortTexture();
    this.tileStatic = new Sprite(texture);
    this.addChild(this.tileStatic);
    this.tileStatic.anchor.set(0.5);
  }

  _initTxtStart() {
    let texture = Texture.from("txt_start");
    this.txtStart = new Sprite(texture);
    this.txtStart.anchor.set(0.5);
    this.addChild(this.txtStart);
  }

  updateSongName(songName) {
    this.txtSongName.displayObject.text = songName;
  }

  updateSongAuthor(songAuthor) {
    this.txtSongAuthor.displayObject.text = songAuthor;
  }

  _onResizeTileStatic() {
    let gameWidth = GameConstant.GAME_WIDTH;
    let colWidth = gameWidth / GameConstant.COLUMN_COUNT;
    this.startPos = GameResizer.width / 2 - colWidth * (GameConstant.COLUMN_COUNT / 2);
    var x = (this.startPos + 1 * gameWidth / GameConstant.COLUMN_COUNT);
    this.tileStatic.width = colWidth;
    this.tileStatic.x = x + colWidth / 2;
    this.tileStatic.y = GameSetting.beatPos.value;
    this.tileStatic.height = 400;
  }

  _onResizeTxtStart() {
    this.txtStart.x = this.tileStatic.x;
    this.txtStart.y = this.tileStatic.y;
  }

  _initSongName() {
    let transform = new PureTransform({
      alignment       : Alignment.MIDDLE_CENTER,
      y               : -350,
      useOriginalSize : true,
    });
    let lscTransform = new PureTransform({
      alignment       : Alignment.MIDDLE_CENTER,
      y               : -250,
      useOriginalSize : true,
    });
    let style = new TextStyle({
      fontSize   : 70,
      align      : "center",
      fill       : 0xFFFFFF,
      fontWeight : "bold",
    });
    this.txtSongName = new PureText("Song Name", transform, style, lscTransform, style);
    this.addChild(this.txtSongName.displayObject);
  }

  _initSongAuthor() {
    let transform = new PureTransform({
      alignment       : Alignment.MIDDLE_CENTER,
      y               : -270,
      useOriginalSize : true,
    });
    let lscTransform = new PureTransform({
      alignment       : Alignment.MIDDLE_CENTER,
      y               : -170,
      useOriginalSize : true,
    });
    let style = new TextStyle({
      fontSize   : 45,
      align      : "center",
      fill       : 0xFFFFFF,
      fontWeight : 200,
    });
    this.txtSongAuthor = new PureText("Author", transform, style, lscTransform, style);
    this.addChild(this.txtSongAuthor.displayObject);
  }

  _initTextFrame() {
    let transform = new PureTransform({
      alignment : Alignment.HORIZONTAL_MIDDLE,
      y         : -300,
      height    : 300,
    });
    let lscTransform = new PureTransform({
      alignment : Alignment.HORIZONTAL_MIDDLE,
      y         : -200,
      height    : 300,
    });
    let frame = new PureRect(transform, lscTransform);
    frame.fill(this, 0x000000, 0.35);
  }

  startGame() {
    SoundManager.play("sfx_btn_click");
    GameStateManager.state = GameState.Playing;
  }

  _initScoreText() {
    let transform = new PureTransform({
      alignment       : Alignment.TOP_CENTER,
      y               : 120,
      useOriginalSize : true,
    });
    let style = new PIXI.TextStyle({
      fontSize : 70,
      align    : "center",
      fill     : 0xFFFFFF,
    });
    this.txtScore = new PureText("0", transform, style);
    this.addChild(this.txtScore.displayObject);
  }
}
