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
export const HomeScreenEvent = Object.freeze({
  PlayButtonSelected  : "PlayButtonSelected",
  LevelButtonSelected : "LevelButtonSelected",
});

export class HomeScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_HOME);

  }

  create() {
    super.create();
    this.resize();

    this._initPlayButton();
    this._initLevelButton();
  }

  show() {
    super.show();
  }

  resize() {
    super.resize();
    
  }

  update(dt) {
    super.update(dt);

  }

  _initPlayButton() {
    let texturePlay = Texture.from("spr_button_blank");
    let pTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_LEFT,
      usePercent : true,
    });
    let lTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_LEFT,
      x          : 200,
      y          : -380,
      width      : 0.3 * texturePlay.width,
      height     : 0.3 * texturePlay.height,
      usePercent : true,
    });
    this.buttonPlay = new PureSprite(texturePlay, pTransform, lTransform);
    this.addChild(this.buttonPlay.displayObject);

    Util.registerOnPointerDown(this.buttonPlay.displayObject, () => {
      DataManager.updateCurrentLevelToLastUnlockLevel();
      this.emit(HomeScreenEvent.PlayButtonSelected);
    });

    let textOnButton = new Text("Play", {
      fontFamily: "Comic Sans MS",
      fontSize: 190,
      fill: "white",
      align: "center",
      fontWeight: "bold",
      stroke: "black",
    });
    textOnButton.anchor.set(0.5);
    textOnButton.position.set(texturePlay.width / 2, - texturePlay.height / 2);
    this.buttonPlay.displayObject.addChild(textOnButton);
  }

  _initLevelButton() {
    let textureLevel = Texture.from("spr_button_blank");
    let pTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_LEFT,
      usePercent : true,
    });
    let lTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_LEFT,
      x          : 200,
      y          : -200,
      width      : 0.3 * textureLevel.width,
      height     : 0.3 * textureLevel.height,
      usePercent : true,
    });
    this.buttonLevel = new PureSprite(textureLevel, pTransform, lTransform);
    this.addChild(this.buttonLevel.displayObject);

    Util.registerOnPointerDown(this.buttonLevel.displayObject, () => {
      this.emit(HomeScreenEvent.LevelButtonSelected);
    });

    let textOnButton = new Text("Level", {
      fontFamily: "Comic Sans MS",
      fontSize: 190,
      fill: "white",
      align: "center",
      fontWeight: "bold",
      stroke: "black",
    });
    textOnButton.anchor.set(0.5);
    textOnButton.position.set(textureLevel.width / 2, - textureLevel.height / 2);
    this.buttonLevel.displayObject.addChild(textOnButton);
  }
}
