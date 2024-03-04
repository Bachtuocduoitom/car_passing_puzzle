import { Sprite, Text, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { DataLocal } from "../data/dataLocal";
import { UserData } from "../data/userData";
import { DataManager } from "../data/dataManager";
import { Util } from "../../helpers/utils";

export class AnswerUI extends Sprite {
  constructor() {
    super();
    this.texture = Texture.from("spr_small_answer");
    this.correct = false;

    this._initAnswerText();
    GameResizer.registerOnResizeCallback(this.resize, this);
  }

  _initBgAnswer() {
    let texture = Texture.from("spr_small_answer");
    let pTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : texture.width,
      height    : texture.height,
    });

    let lTransform = new PureTransform({
      alignment : Alignment.TOP_CENTER,
      width     : texture.width,
      height    : texture.height,
    });
    this.bgAnswer = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.bgAnswer.displayObject);
  }

  resize() {
    
  }

  destroy() {
    super.destroy();
    GameResizer.unregisterOnResizeCallback(this.resize, this);
  }


  _initAnswerText() {
    this.answerText = new Text("SCORE", {
      fontFamily: "Arial",
      fontSize: 120,
      fill: "black",
      align: "left",
    });
    this.answerText.anchor.set(0.5);
    
    this.addChild(this.answerText);
  }

  setText(text) {
    this.answerText.text = text;
  }


  updateData(data) {
  }
}
