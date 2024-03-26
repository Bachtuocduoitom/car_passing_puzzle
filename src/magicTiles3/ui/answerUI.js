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
    this.texture = Texture.from("spr_answer_normal");
    this.correct = false;

    this._initAnswerText();
    GameResizer.registerOnResizeCallback(this.resize, this);
  }

  resize() {
    
  }

  reset() {
    this.texture = Texture.from("spr_answer_normal");
  }

  destroy() {
    super.destroy();
    GameResizer.unregisterOnResizeCallback(this.resize, this);
  }


  _initAnswerText() {
    this.answerText = new Text("1", {
      fontFamily: "Arial",
      fontSize: 90,
      fill: "black",
      align: "left",
      bold: true,
      wordWrap: true,
      wordWrapWidth: this.texture.width * 0.8,
    });
    this.answerText.anchor.set(0.5);
    
    this.addChild(this.answerText);
  }

  setText(text) {
    this.answerText.text = text;
  }


  updateData(data) {
  }

  onTrueAnswer() {
    this.texture = Texture.from("spr_answer_true");
  }

  onFalseAnswer() {
    this.texture = Texture.from("spr_answer_false");
  }
}
