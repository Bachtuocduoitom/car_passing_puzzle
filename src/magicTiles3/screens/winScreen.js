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
export const WinScreenEvent = Object.freeze({
  BackHome         : "backHome",
  Replay           : "replay",
  NextLevel        : "nextLevel",
});

export class WinScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_WIN);
  }

  create() {
    super.create();
    this.numOfStars = 5;
    this.tweenDuration = 0.5;
    this.buttonYPosition = 350;
    this.buttonYEndLevelPosition = 720;
    this.stars = [];
    this.buttons = [];
    this.fxs = [];
    this._initBackground();
    this._initOrangeBoard();
    this._initStars();
    this._initTotalScoreText();
    this._initButtons();
    this._initFxs();
  }

  show() {
    super.show();
    this._playStarsZoomInTween();
  }

  hide() {
    super.hide();
    this._stopStarsZoomInTween();
    this._setStarsToInitialScale();
    this._setStarsToInitialTexture();
    this._setStarsToInvisible();
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
    let boardTexture = Texture.from("Box_Orange_Rounded");
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

  _initStars() {
    this.orangeStarTexture = Texture.from("Icon_Large_StarOrange");
    this.grayStarTexture = Texture.from("Icon_Large_StarGray");
    for (let i = 0; i < this.numOfStars; i++) {
      let star = new Sprite(this.orangeStarTexture);
      star.anchor.set(0.5, 0.5);
      this.orangeBoard.displayObject.addChild(star);
      this.stars.push(star);
    }

    
    //set stars position
    this.stars[0].position.set(-450, -250);
    this.stars[1].position.set(-200, -100);
    this.stars[2].position.set(0, -350);
    this.stars[3].position.set(200, -100);
    this.stars[4].position.set(450, -250);

    this._setStarsToInitialScale();
    this._setStarsToInitialTexture();
    this._setStarsToInvisible();
  
  }

  _initTotalScoreText() {
    this.totalScoreText = new Text("Total Score: 0/35", {
      fontFamily: "Comic Sans MS",
      fontSize: 90,
      fill: "white",
      stroke: "black",
      strokeThickness: 10,
      fontWeight: "bold",
    });
    this.totalScoreText.x = -150;
    this.totalScoreText.y = 200;
    this.totalScoreText.anchor.set(0.5);
    this.orangeBoard.displayObject.addChild(this.totalScoreText);
  }

  _initButtons() {
    this.homeButton = new Sprite(Texture.from("button_home"));
    this.homeButton.anchor.set(0.5, 0.5);
    this.homeButton.position.set(-400, this.buttonYPosition);
    this.orangeBoard.displayObject.addChild(this.homeButton);
    this.buttons.push(this.homeButton);
    Util.registerOnPointerDown(this.homeButton, this._onBackHome.bind(this));

    this.replayButton = new Sprite(Texture.from("button_replay"));
    this.replayButton.anchor.set(0.5, 0.5);
    // this.restartButton.position.set(-220, 0);
    this.replayButton.position.set(0, this.buttonYPosition);
    this.orangeBoard.displayObject.addChild(this.replayButton);
    this.buttons.push(this.replayButton);
    Util.registerOnPointerDown(this.replayButton, this._onReplay.bind(this));

    this.continueButton = new Sprite(Texture.from("button_continue"));
    this.continueButton.anchor.set(0.5, 0.5);
    this.continueButton.position.set(400, this.buttonYPosition);
    this.orangeBoard.displayObject.addChild(this.continueButton);
    this.buttons.push(this.continueButton);
    Util.registerOnPointerDown(this.continueButton, this._onNextLevel.bind(this));
  }

  _initFxs() {
    this.star1ZoomInTween = Tween.createTween(this.stars[0], { scale: {x: 1, y: 1} }, {
      duration : this.tweenDuration,
      easing     :  Tween.Easing.Back.Out,
      onStart : () => {
        this.stars[0].visible = true;
      },
    });

    this.star2ZoomInTween = Tween.createTween(this.stars[1], { scale: {x: 0.9, y: 0.9} }, {
      duration : this.tweenDuration,
      easing     :  Tween.Easing.Back.Out,
      onStart : () => {
        this.stars[1].visible = true;
      },
    });

    this.star3ZoomInTween = Tween.createTween(this.stars[2], { scale: {x: 1.2, y: 1.2} }, {
      duration : this.tweenDuration,
      easing     :  Tween.Easing.Back.Out,
      onStart : () => {
        this.stars[2].visible = true;
      },
    });

    this.star4ZoomInTween = Tween.createTween(this.stars[3], { scale: {x: 0.9, y: 0.9} }, {
      duration : this.tweenDuration,
      easing     :  Tween.Easing.Back.Out,
      onStart : () => {
        this.stars[3].visible = true;
      },
    });

    this.star5ZoomInTween = Tween.createTween(this.stars[4], { scale: {x: 1, y: 1} }, {
      duration : this.tweenDuration,
      easing     : Tween.Easing.Back.Out,
      onStart : () => {
        this.stars[4].visible = true;
      },
    });

    this.totalScoreTextZoomInTween = Tween.createTween(this.totalScoreText, { scale: {x: 1, y: 1} }, {
      duration : this.tweenDuration,
      delay : this.tweenDuration * 5,
      easing     : Tween.Easing.Back.Out,
      onStart : () => {
        this.totalScoreText.visible = true;
      },
    });

    this.fxs.push(this.star1ZoomInTween);
    this.fxs.push(this.star2ZoomInTween);
    this.fxs.push(this.star3ZoomInTween);
    this.fxs.push(this.star4ZoomInTween);
    this.fxs.push(this.star5ZoomInTween);
    this.fxs.push(this.totalScoreTextZoomInTween);
    
    this.star1ZoomInTween.chain(this.star2ZoomInTween);
    this.star2ZoomInTween.chain(this.star3ZoomInTween);
    this.star3ZoomInTween.chain(this.star4ZoomInTween);
    this.star4ZoomInTween.chain(this.star5ZoomInTween);
  }

  resize() {
    super.resize();
   
  }

  _onBackHome() {
    //play click sound

    this.emit(WinScreenEvent.BackHome, this);
  }

  _onReplay() {
    //play click sound

    this.emit(WinScreenEvent.Replay, this);
  }

  _onNextLevel() {
    //play click sound

    this.emit(WinScreenEvent.NextLevel, this);
  }

  _setStarsToInitialScale() {
    this.stars[0].scale.set(0.2);
    this.stars[1].scale.set(0.2);
    this.stars[2].scale.set(0.3);
    this.stars[3].scale.set(0.2);
    this.stars[4].scale.set(0.2);
  }

  _setButtonsToInitialPosition() {
    this.homeButton.position.set(-400, this.buttonYPosition);
    this.replayButton.position.set(0, this.buttonYPosition);
    this.continueButton.position.set(400, this.buttonYPosition);
  }

  _setButtonsToLevelEndPosition() {
    this.homeButton.position.set(-400, this.buttonYEndLevelPosition);
    this.replayButton.position.set(0, this.buttonYEndLevelPosition);
    this.continueButton.position.set(400, this.buttonYEndLevelPosition);
  }

  _setStarsToInvisible() {
    this.stars.forEach(star => {
      star.visible = false;
    });
  }

  _setStarsToInitialTexture() {
    this.stars.forEach(star => {
      star.texture = this.grayStarTexture;
    });
  }

  _playStarsZoomInTween() {
    this.star1ZoomInTween?.start();
  }

  _stopStarsZoomInTween() {
    this.fxs.forEach(fx => {
      fx?.stop();
    });
  }

  setTextureForStars(numOfStarCollected) {
    console.log(this.stars);
    for (let i = 0; i < numOfStarCollected; i++) {
      this.stars[i].texture = this.orangeStarTexture;     
    }
  }

  setupForLevelComplete(isLevelEnd, numOfStarCollected) {
    if (isLevelEnd) {
      let totalScore = DataManager.getLevelTotalScore();
      this.totalScoreText.visible = false;
      this.totalScoreText.scale.set(0.5);
      this.totalScoreTextZoomInTween?.start();
      this.totalScoreText.text = `Total Score: ${totalScore}/35`;
      this._setButtonsToLevelEndPosition();
    } else {
      this.totalScoreText.visible = false;
      this._setButtonsToInitialPosition();
    }

    this.setTextureForStars(numOfStarCollected);
  }
}
