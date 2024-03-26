import { Container, Sprite, Text, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { DataLocal } from "../data/dataLocal";
import { UserData } from "../data/userData";
import { DataManager } from "../data/dataManager";
import { Util } from "../../helpers/utils";
import { AssetSelector } from "../assetSelector";
import { SoundManager } from "../../soundManager";

export const ItemEvent = Object.freeze({
  Selected   : "selected",
});

export class LevelItem extends PIXI.Container {
  constructor(data = {}) {
    super();
    this.id = data.id || 0;

    
    this._create();
    this.updateData(data);
  }

  _create() {
    this._initLockedCard();
    this._initUnlockedCard();
  }

  _initLockedCard() {
    let texture = Texture.from("spr_lock_item");
    let pTransform = new PureTransform({
      useOriginalSize: true,
    });
    this.lockedCard = new PureSprite(texture, pTransform);
    this.addChild(this.lockedCard.displayObject);

  }

  _initUnlockedCard() {
    let texture = Texture.from("spr_answer_true");
    let pTransform = new PureTransform({
      useOriginalSize: true,
    });
    this.unlockedCard = new PureSprite(texture, pTransform);
    this.addChild(this.unlockedCard.displayObject);

    this._initData();

    Util.registerOnPointerDown(this.unlockedCard.displayObject, () => {
      this.onSelect();
    });
  }

  _initData() {
    this.nameText = new Text("0", {
      fontFamily: "Comic Sans MS",
      fontSize: 90,
      fill: "white",
      stroke: "black",
      strokeThickness: 10,
      fontWeight: "bold",
    });
    this.nameText.x = this.unlockedCard.displayObject.width / 2;
    this.nameText.y = this.unlockedCard.displayObject.height / 2;
    this.nameText.anchor.set(0.5);
    this.unlockedCard.displayObject.addChild(this.nameText);

  }

  updateData(data) {
    this.nameText.text = data.shorthand;

    if (data.isUnlock) {
      this.lockedCard.displayObject.visible = false;
      this.unlockedCard.displayObject.visible = true;
    } else {
      this.lockedCard.displayObject.visible = true;
      this.unlockedCard.displayObject.visible = false;
    }
  }

  resize() {
    
  }


  onSelect() {
    DataManager.updateCurrentLevel(this.id);
    this.emit(ItemEvent.Selected);
  }

  destroy() {
    super.destroy();
    GameResizer.unregisterOnResizeCallback(this.resize, this);
  }

}
