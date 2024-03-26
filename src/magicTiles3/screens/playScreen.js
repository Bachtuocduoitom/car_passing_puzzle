import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, Text, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
import { Tween } from "../../systems/tween/tween";
export const PlayScreenEvent = Object.freeze({
  Start       : "start",
  ResetLevel : "resetlevel",
});

export class PlayScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_PLAY);
  }

  create() {
    super.create();
    this._initStartButton();
    this._initResetButton();
    this._createLevelText();
   
  }

  show() {
    super.show();
    this.showLevelText();
    this.hideResetButton();
    this.showStartButton();
  }

  _initStartButton() {
    let startButtonTexture = Texture.from("btn_start");
    let pTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_CENTER,
      x                       : 0,
      y                       : 0,
      usePercent              : true,
      width                   : 0.05,
      height                  : 0.05,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
      
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_CENTER,
      x                       : 0,
      y                       : 0,
      usePercent              : true,
      width                   : 0.15,
      height                  : 0.15,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.startButton = new PureSprite(startButtonTexture, pTransform, lTransform);
    this.addChild(this.startButton.displayObject);
    Util.registerOnPointerDown(this.startButton.displayObject, this._onStart.bind(this));
    this._initStartButtonAnimation();
  }

  _initStartButtonAnimation() {
    this.startButtonTween?.stop();
    this.startButtonTween = Tween.createTween(this.startButton.displayObject, { scale: {x: 0.2, y: 0.2} }, {
      duration : 0.5  ,
      repeat   : Infinity,
      yoyo     : true,
    }).start();
  }

  _initResetButton() {
    let resetButtonTexture = Texture.from("spr_reset_button");
    let pTransform = new PureTransform({
      alignment               : Alignment.TOP_LEFT,
      x                       : 20,
      y                       : 20,
      width                   : resetButtonTexture * 0.05,
      height                  : resetButtonTexture * 0.05,
      
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.TOP_LEFT,
      x                       : 20,
      y                       : 20,
      width                   : resetButtonTexture.width * 0.8,
      height                  : resetButtonTexture.height * 0.8,
    });
    this.resetButton = new PureSprite(resetButtonTexture, pTransform, lTransform);
    this.resetButton.displayObject.visible = false;
    this.addChild(this.resetButton.displayObject);
    Util.registerOnPointerDown(this.resetButton.displayObject, this._onResetLevel.bind(this));
  }
  
  _createLevelText() {
    let texture = Texture.from("spr_transparent");
    let lTransform = new PureTransform({
      alignment: Alignment.TOP_CENTER,
      x: 0,
      y: 40,
    });
    this.anchorSprite = new PureSprite(texture, lTransform);
    this.anchorSprite.displayObject.visible = false;
    this.addChild(this.anchorSprite.displayObject);

    this.levelText = new Text("Level", {
      fontFamily: "Comic Sans MS",
      fontSize: 65,
      fill: "white",
      stroke: "grey",
      strokeThickness: 10,
      fontWeight: "bold",  
    });
    this.levelText.x = 0;
    this.levelText.y = 0;
    this.levelText.anchor.set(0.5);
    
    this.anchorSprite.displayObject.addChild(this.levelText);
  }
  
  resize() {
    super.resize();
    
  } 
  
  _onStart() {
    this.emit(PlayScreenEvent.Start);
  }

  _onResetLevel() {
    this.emit(PlayScreenEvent.ResetLevel);
  }

  hideStartButton() {
    this.startButton.displayObject.visible = false;
  }

  showStartButton() {
    this.startButton.displayObject.visible = true;
  }

  hideResetButton() {
    this.resetButton.displayObject.visible = false;
  }

  showResetButton() {
    this.resetButton.displayObject.visible = true;
  }

  hideLevelText() {
    this.anchorSprite.displayObject.visible = false;
  }

  showLevelText() {
    console.log(DataManager.currentLevel);
    this.levelText.text = `${DataManager.currentLevel}`;
    this.anchorSprite.displayObject.visible = true;
  }
}
