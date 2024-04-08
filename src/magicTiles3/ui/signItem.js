import { Easing } from "@tweenjs/tween.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Sprite, Text, Texture, Container, Graphics } from "pixi.js";
import { Game } from "../../game";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { Util } from "../../helpers/utils";
import { AssetSelector } from "../assetSelector";
import { GameConstant } from "../../gameConstant";

export class SignItem extends Container {
  constructor(tag) {
    super();
    this.score = 0;
    this.tag = tag;
    this.chosen = false;
    this.canChoose = true;
    this._initBackground();
    this._initDirectionSignSprite();
    this._initNumberText();
    this._initAnimation();
    this.resize();
    Util.registerOnPointerTap(this, this._onClick.bind(this));

  }

  update() {
    if (!GameStateManager.isState(GameState.Playing)) {
      return;
    }

    this.dt = Game.app.ticker.deltaMS / 1000;
  }

  playAnimation() {
    
  }


  stopAnimation() {
    
  }

  resize() { 
   
  }

  _initBackground() {
    this.background = new Sprite(Texture.WHITE);
    this.background.width = GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10;
    this.background.height = GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10;
    this.addChild(this.background);

    this.frame = new Graphics();
    this.frame.lineStyle(5, 0x484848, 1);
    this.frame.drawRect(0, 0, GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10, GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10);
    this.addChild(this.frame);
  }

  _initDirectionSignSprite() {
    this.directionSignSprite = new Sprite(AssetSelector.getDirectionSignTextureByTag(this.tag));
    this.directionSignSprite.x = 5;
    this.directionSignSprite.y = 5;
    this.directionSignSprite.width = GameConstant.DIRECTION_SIGN_ITEM_SIZE - 20;
    this.directionSignSprite.height = GameConstant.DIRECTION_SIGN_ITEM_SIZE - 20;
    this.addChild(this.directionSignSprite);
  }

  _initShowNumber() {

  }

  _initNumberText(initialNumber = 10) {
    this.numberText = new Text(`${initialNumber}`, {
      fontFamily: "UTM_Bebas",
      fontSize: 35,
      fill: "#000000",
      align: "right",
      stroke: "#000000",
      strokeThickness: 1,
      fontWeight: "bold",
    })
    this.numberText.anchor.set(1);
    this.numberText.x = this.background.width - 5;
    this.numberText.y = this.background.height;
    // this.numberText.tint = "#7f7f7f"
    this.addChild(this.numberText);
  }

  _initAnimation() {

  }

  _onClick() {
    if (!this.canChoose) {
      return;
    }
    if (this.chosen) {    
      this.onUnChosen();
      this.emit("unchosen", this.tag);
      return;
    } else {
      this.onChosen();
      this.emit("chosen", this.tag);
      return;
    }
  }

  setNumOfSigns(num) {
    this.score = num;
    this.numberText.text = `${num}`;

    if (this.score == 0) {
      this.deActive();
    }
  }

  onChosen() {
    this.frame.clear();
    this.frame.lineStyle(5, 0xD21404, 1);
    this.frame.drawRect(0, 0, GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10, GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10);
    this.chosen = true;
  }

  onUnChosen() {
    this.frame.clear();
    this.frame.lineStyle(5, 0x484848, 1);
    this.frame.drawRect(0, 0, GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10, GameConstant.DIRECTION_SIGN_ITEM_SIZE + 10);
    this.chosen = false;
  }

  decreaseNumOfSigns() {
    if (this.score <= 0) {
      return;
    }
    this.score--;
    this.numberText.text = `${this.score}`;
    if (this.score == 0) {
      this.deActive();
    }
  }

  deActive() {
    this.canChoose = false;
    this.background.tint = 0x7f7f7f;
    this.directionSignSprite.tint = 0x7f7f7f;
  }

  reset() {
    this.background.tint = 0xffffff;
    this.directionSignSprite.tint = 0xffffff;
    this.canChoose = true;
    this.score = 0;
    this.numberText.text = `${this.score}`;
    this.onUnChosen();
  }
}