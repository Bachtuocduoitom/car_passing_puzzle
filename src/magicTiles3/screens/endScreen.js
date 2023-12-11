import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
export const EndScreenEvent = Object.freeze({
  ItemListSelected : "ItemListSelected",
  ItemListBought   : "ItemListBought",
  BackHome         : "backHome",
});
export class EndScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOSE);
  }

  create() {
    super.create();
    this._initBackground();
   
  }

  show() {
    super.show();
  }

  resize() {
    super.resize();
    
  } 
 
}
