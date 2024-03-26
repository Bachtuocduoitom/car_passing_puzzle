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
export const ChooseLevelsScreenEvent = Object.freeze({
  BackHome : "backHome",
  ChooseLevel : "chooseLevel",
});

export class ChooseLevelsScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_CHOOSE_LEVEL);
    
  }

  create() {
    super.create();
    
    this._initBackground();
    this._initGreyBox();
    this._initLevelText();
  }

  show() {
    super.show();
    this.levelScrollBox.show();
  }

  hide() {
    super.hide();
    this.levelScrollBox.hide();
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

    Util.registerOnPointerDown(this.bg.displayObject, this._onClose.bind(this));
  }

  _initGreyBox() {
    let greyBoxTexture = Texture.from("spr_grey_box");
    let lTransform = new PureTransform({
      alignment: Alignment.MIDDLE_CENTER,
      x: 0,
      y: 0,
      width: 0.6 * greyBoxTexture.width,
      height: 0.6 * greyBoxTexture.height,
      usePercent: true,
    });
    this.greyBox = new PureSprite(greyBoxTexture, lTransform);
    this.addChild(this.greyBox.displayObject);

    Util.registerOnPointerDown(this.greyBox.displayObject, () => { });

    this._initLevelSCrollBox();
  }

  _initLevelSCrollBox() {
    this.levelScrollBox = new ListItem(1500, 950);
    this.levelScrollBox.pivot.set(0.5, 0.5);
    this.levelScrollBox.position.set(-600, -500);
    this.greyBox.displayObject.addChild(this.levelScrollBox);

    this.levelScrollBox.on(ListItemEvent.ItemListSelected, () => {
      this.emit(ChooseLevelsScreenEvent.ChooseLevel);
    });
  }

  _initLevelText() {
    this.levelText = new Text("LEVELS", {
      fontFamily: "Comic Sans MS",
      fontSize: 150,
      fill: "white",
      stroke: "grey",
      strokeThickness: 25,
      fontWeight: "bold",
      
    });
    this.levelText.x = 0;
    this.levelText.y = -this.greyBox.displayObject.height;
    this.levelText.anchor.set(0.5);
    this.greyBox.displayObject.addChild(this.levelText);
  }

  update(dt) {
    super.update(dt);

  }

  _onClose() {
    this.emit(ChooseLevelsScreenEvent.BackHome);
  }
 
}
