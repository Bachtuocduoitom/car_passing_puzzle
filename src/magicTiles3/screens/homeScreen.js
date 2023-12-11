import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, Sprite, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
export const HomeScreenEvent = Object.freeze({
  ItemSelected : "ItemSelected",
  ItemBought   : "ItemBought",
});
export class HomeScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_HOME);

  }

  create() {
    super.create();
    this.resize();
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
}
