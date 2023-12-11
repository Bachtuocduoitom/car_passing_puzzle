import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, Graphics, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
export const WinScreenEvent = Object.freeze({
  ItemListSelected : "ItemListSelected",
  ItemListBought   : "ItemListBought",
  BackHome         : "backHome",
});
export class WinScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_WIN);
  }

  create() {
    super.create();
    this._initBackground();
  }

  show() {
    super.show();
  }

  _initBackground() {
    let texture = Texture.from("bg_portrait");
    let portraitTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.bg = new PureSprite(texture, portraitTransform);
    this.addChild(this.bg.displayObject);
  }


  resize() {
    super.resize();
   
  }

}
