import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, Graphics, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
export const LoseScreenEvent = Object.freeze({
  BackHome         : "backHome",
  Replay           : "replay",
});

export class LoseScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOSE);
  }

  create() {
    super.create();
    this.buttonYPosition = 500;
    this.buttons = [];
    this.fxs = [];
    this._initBackground();
    this._initOrangeBoard();
    this._initLevelFailedText();
    this._initButtons();
    this._initFxs();
  }

  show() {
    super.show();
    this._playTextZoomInTween();
  }

  hide() {
    super.hide();
    this._stopStarsZoomInTween();
  }

  _initBackground() {
    let pTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.bg = new PureSprite(Texture.WHITE, pTransform);
    this.addChild(this.bg.displayObject);

    this.bg.displayObject.tint = 0x000000;
    this.bg.displayObject.alpha = 0.75;
  }

  _initOrangeBoard() {
    let boardTexture = Texture.from("spr_transparent");
    let lTransform = new PureTransform({
      alignment               : Alignment.MIDDLE_CENTER,
      x                       : 0,
      y                       : -50,
      width                   : boardTexture.width * 0.6,
      height                  : boardTexture.height * 0.6,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.orangeBoard = new PureSprite(boardTexture, lTransform);
    this.addChild(this.orangeBoard.displayObject);
  }

  _initLevelFailedText() {
    this.levelFailedText = new Text("LEVEL\nFAILED!!!", {
      fontFamily: "Comic Sans MS",
      fontSize: 300,
      fill: "white",
      stroke: "black",
      align: "center",
      lineHeight: 290,
      strokeThickness: 20,
      fontWeight: "bold",
      
    });
    this.levelFailedText.x = 0;
    this.levelFailedText.y = -250;
    this.levelFailedText.rotation = 0.1;
    this.levelFailedText.anchor.set(0.5);
    this.orangeBoard.displayObject.addChild(this.levelFailedText);
  }

  _initButtons() {
    this.homeButton = new Sprite(Texture.from("button_home"));
    this.homeButton.anchor.set(0.5, 0.5);
    this.homeButton.position.set(-200, this.buttonYPosition);
    this.orangeBoard.displayObject.addChild(this.homeButton);
    this.buttons.push(this.homeButton);
    Util.registerOnPointerDown(this.homeButton, this._onBackHome.bind(this));

    this.replayButton = new Sprite(Texture.from("button_replay"));
    this.replayButton.anchor.set(0.5, 0.5);
    // this.restartButton.position.set(-220, 0);
    this.replayButton.position.set(200, this.buttonYPosition);
    this.orangeBoard.displayObject.addChild(this.replayButton);
    this.buttons.push(this.replayButton);
    Util.registerOnPointerDown(this.replayButton, this._onReplay.bind(this));
  }

  _initFxs() {
    this.levelFailedText.scale.set(1.3);
    this.textZoomInTween = Tween.createTween(this.levelFailedText, { scale: {x: 1, y: 1} }, {
      duration : 0.5,
      easing     :  Tween.Easing.Back.Out,
      onStart : () => {
      },
      onComplete : () => {
        
      },
    });

    this.fxs.push(this.textZoomInTween);
  }

  resize() {
    super.resize();
   
  }

  _onBackHome() {
    //play click sound

    this.emit(LoseScreenEvent.BackHome, this);
  }

  _onReplay() {
    //play click sound

    this.emit(LoseScreenEvent.Replay, this);
  }

  _playTextZoomInTween() {
    this.textZoomInTween.start();
  }

  _stopStarsZoomInTween() {
    this.textZoomInTween?.stop();
    this.levelFailedText?.scale.set(1);
  }
 
}
