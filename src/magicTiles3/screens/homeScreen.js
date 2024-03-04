import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, Sprite, Texture,} from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
import { AssetSelector } from "../assetSelector";
import { Util } from "../../helpers/utils";
export const HomeScreenEvent = Object.freeze({
  PlayButtonSelected : "PlayButtonSelected",
});

export class HomeScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_HOME);

  }

  create() {
    super.create();
    this.resize();

    this._initPlayButton();
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
    let texturePlay = Texture.from("button_play");
    let pTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_LEFT,
      usePercent : true,
    });
    let lTransform = new PureTransform({
      alignment  : Alignment.BOTTOM_LEFT,
      x          : 200,
      y          : -200,
      usePercent : true,
    });
    this.buttonPlay = new PureSprite(texturePlay, pTransform, lTransform);
    this.buttonPlay.displayObject.scale.set(0.3, 0.3);
    this.addChild(this.buttonPlay.displayObject);

    Util.registerOnPointerDown(this.buttonPlay.displayObject, () => {
      this.emit(HomeScreenEvent.PlayButtonSelected);
    });
  }
}
