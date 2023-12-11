import { Sprite, Text, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { Util } from "../../helpers/utils";
import { UserData } from "../data/userData";

export class TopBarScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_TOP_BAR);
  }

  create() {
    super.create();
    this._initDiamond();
  }

  show() {
    super.show();
    this.updateDiamond(UserData.currency);
  }

  resize() {
    super.resize();
  }

  hide() {
    super.hide();
  }

  _initDiamond() {
    let texture = Texture.from("item_bg");
    let pTransform = new PureTransform({
      alignment : Alignment.TOP_RIGHT,
      y         : 150,
      x         : 20,
      width     : texture.width,
      height    : texture.height,
    });
    let lTransform = new PureTransform({
      alignment : Alignment.TOP_RIGHT,
      y         : 100,
      x         : 20,
      width     : texture.width * 1.5,
      height    : texture.height * 1.5,
    });
    this.diamondFrame = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.diamondFrame.displayObject);

    let iconDiamond = new Sprite(Texture.from("spr_icon_diamond"));
    iconDiamond.x = -330;
    iconDiamond.y = 5;
    iconDiamond.scale.set(0.65);
    this.diamondFrame.displayObject.addChild(iconDiamond);

    this.txtDiamond = new Text("0000000", {
      fontSize        : 45,
      fill            : 0xffffff,
      stroke          : 0x000000,
      strokeThickness : 2,
      align           : "left",
    });
    this.txtDiamond.x = -200;
    this.txtDiamond.y = 7;
    this.diamondFrame.displayObject.addChild(this.txtDiamond);
  }

  updateDiamond(diamond) {
    this.txtDiamond.text = Util.getCashFormat(diamond);
  }
}
