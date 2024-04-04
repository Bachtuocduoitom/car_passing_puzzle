import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, Sprite, Text, Texture,} from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
import { AssetSelector } from "../assetSelector";
import { Util } from "../../helpers/utils";
import { ListItem, ListItemEvent } from "../ui/listItem";
export const TutorialScreenEvent = Object.freeze({
  BackHome : "backHome",
});

export class TutorialScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TUTORIAL);
    
  }

  create() {
    super.create();
    
    this.textures = AssetSelector.getTutorialTextures();
    this.currentTextureIndex = 0;
    this.textureIndexMax = this.textures.length - 1;
    this._initBackground();
    this._initGreyBox();
    this._initNextButton();
    this._initPreviousButton();
    this._initGotItButton();
    this._initTutorialText();

    this._checkCurrentTexture();
  }

  show() {
    super.show();
    this.currentTextureIndex = 0;
    this.greyBox.displayObject.texture = this.textures[this.currentTextureIndex];
    this._checkCurrentTexture(); 
  }

  hide() {
    super.hide();
    
  }

  resize() {
    super.resize();
  }

  _initBackground() {
    let pTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.bg = new PureSprite(Texture.WHITE, pTransform);
    this.addChild(this.bg.displayObject);

    this.bg.displayObject.tint = 0x000000;
    this.bg.displayObject.alpha = 0.75;

    Util.registerOnPointerDown(this.bg.displayObject, () => { });
  }

  _initGreyBox() {
    let greyBoxTexture = this.textures[this.currentTextureIndex];
    let lTransform = new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      x: 0,
      y: 0,
      width: 1.6 * greyBoxTexture.width,
      height: 1.6 * greyBoxTexture.height,
      usePercent: true,
    });
    this.greyBox = new PureSprite(greyBoxTexture, lTransform);
    this.addChild(this.greyBox.displayObject);

    Util.registerOnPointerDown(this.greyBox.displayObject, () => { });
  }

  _initNextButton() {
    let nextButtonTexture = Texture.from("spr_next_btn");
    let lTransform = new PureTransform({
      alignment: Alignment.MIDDLE_RIGHT,
      x: -200,
      y: 0,
      width: 0.5 * nextButtonTexture.width,
      height: 0.5 * nextButtonTexture.height,
      usePercent: true,
    });
    this.nextButton = new PureSprite(nextButtonTexture, lTransform);
    this.nextButton.displayObject.anchor.set(0.5);
    this.addChild(this.nextButton.displayObject);

    Util.registerOnPointerDown(this.nextButton.displayObject, this._onNext.bind(this));
  }

  _initPreviousButton() {
    let previousButtonTexture = Texture.from("spr_next_btn");
    let lTransform = new PureTransform({
      alignment: Alignment.MIDDLE_LEFT,
      x: 200,
      y: 0,
      width: 0.5 * previousButtonTexture.width,
      height: 0.5 * previousButtonTexture.height,
      usePercent: true,
    });
    this.previousButton = new PureSprite(previousButtonTexture, lTransform);
    this.previousButton.displayObject.anchor.set(0.5);
    this.previousButton.displayObject.rotation = Math.PI;
    this.addChild(this.previousButton.displayObject);

    Util.registerOnPointerDown(this.previousButton.displayObject, this._onPrevious.bind(this));
  }

  _initGotItButton() {
    let textureGotIt = Texture.from("spr_button_blank");
    let pTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_CENTER,
      usePercent : true,
    });
    let lTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_CENTER,
      x          : 0,
      y          : -120,
      width      : 0.4 * textureGotIt.width,
      height     : 0.4 * textureGotIt.height,
      usePercent : true,
    });
    this.gotItButton = new PureSprite(textureGotIt, pTransform, lTransform);
    this.addChild(this.gotItButton.displayObject);

    Util.registerOnPointerDown(this.gotItButton.displayObject, () => {
      this._onClose();
    });

    let textOnButton = new Text("Đã hiểu", {
      fontFamily: "Comic Sans MS",
      fontSize: 160,
      fill: "white",
      align: "center",
      fontWeight: "bold",
      stroke: "black",
    });
    textOnButton.anchor.set(0.5);
    textOnButton.position.set(0, - textureGotIt.height / 2);
    this.gotItButton.displayObject.addChild(textOnButton);  
  }

  _initTutorialText() {
    this.levelText = new Text("Hướng dẫn", {
      fontFamily: "Comic Sans MS",
      fontSize: 70,
      fill: "white",
      stroke: "grey",
      strokeThickness: 25,
      fontWeight: "bold",
      
    });
    this.levelText.x = 0;
    this.levelText.y = -320;
    this.levelText.anchor.set(0.5);
    this.greyBox.displayObject.addChild(this.levelText);
  }

  update(dt) {
    super.update(dt);

  }

  _onClose() {
    this.emit(TutorialScreenEvent.BackHome);
  }
 
  _onNext() {
    if (this.currentTextureIndex < this.textureIndexMax) {
      this.currentTextureIndex++;
      this.greyBox.displayObject.texture = this.textures[this.currentTextureIndex];
      this._checkCurrentTexture();
    }
  }

  _onPrevious() {
    if (this.currentTextureIndex > 0) {
      this.currentTextureIndex--;
      this.greyBox.displayObject.texture = this.textures[this.currentTextureIndex];
      this._checkCurrentTexture();
    }
  }

  _checkCurrentTexture() {
    if (this.currentTextureIndex === 0) {
      this.previousButton.displayObject.visible = false;
      this.nextButton.displayObject.visible = true;
      this.gotItButton.displayObject.visible = false;
    } else if (this.currentTextureIndex === this.textureIndexMax) {
      this.nextButton.displayObject.visible = false;
      this.previousButton.displayObject.visible = true;
      this.gotItButton.displayObject.visible = true;
    } else {
      this.nextButton.displayObject.visible = true;
      this.previousButton.displayObject.visible = true;
      this.gotItButton.displayObject.visible = false;
    }
  }
  
}
