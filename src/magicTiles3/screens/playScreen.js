import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
import { Tween } from "../../systems/tween/tween";
export const PlayScreenEvent = Object.freeze({
  Start : "Start",
});

export class PlayScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_PLAY);
  }

  create() {
    super.create();
    this._initStartButton();
   
  }

  show() {
    super.show();
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
  
  
  resize() {
    super.resize();
    
  } 
  
  _onStart() {
    this.emit(PlayScreenEvent.Start);
  }

  hideStartButton() {
    this.startButton.displayObject.visible = false;
  }
}
