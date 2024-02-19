import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { DataManager } from "../data/dataManager";
import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
import { SoundManager } from "../../soundManager";
import { Tween } from "../../systems/tween/tween";

export const QuestionScreenEvent = Object.freeze({
  OnTrueAnswer: "ontrueanswer",
  OnFalseAnswer: "onfalseanswer",
});

export class QuestionScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_QUESTION);
    this.buttons = [];
    this.answers = [];
  }

  create() {
    super.create();
    this._initBackground();
    this._initQuestionTable();
    this._initAnswersCard();
  }

  show() {
    super.show();
    this.resize();
  }

  hide() {
    super.hide();
  }

  _initBackground() {
    let pTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.bg = new PureSprite(Texture.WHITE, pTransform);
    this.addChild(this.bg.displayObject);

    this.bg.displayObject.tint = 0x000000;
    this.bg.displayObject.alpha = 0.75;
  }

  _initQuestionTable() {
    let questionTableTextture = Texture.from("spr_question_vintage_frame");
    let pTransform = new PureTransform({
      alignment               : Alignment.TOP_CENTER,
      x                       : 0,
      y                       : 100,
      usePercent              : true,
      width                   : 0.8,
      height                  : 0.35,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment               : Alignment.TOP_CENTER,
      x                       : 0,
      y                       : 50,
      width                   : questionTableTextture.width * 0.3,
      height                  : questionTableTextture.height * 0.3,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.questionTable = new PureSprite(questionTableTextture, pTransform, lTransform);
    this.addChild(this.questionTable.displayObject);

    this.questionText = new Text("SCORE", {
      fontFamily: "Arial",
      fontSize: 100,
      fill: "black",
      align: "center",
    });
    this.questionText.anchor.set(0.5);
    this.questionText.position.set(0, this.questionTable.displayObject.height);
    this.questionTable.displayObject.addChild(this.questionText);
  }

  _initAnswersCard() {
    let bottomTexture = Texture.from("spr_transparent");
    let pTransform = new PureTransform({
      alignment               : Alignment.BOTTOM_CENTER,
      x                       : 0,
      y                       : -GameResizer.height/6,
      usePercent              : true,
      width                   : 0.33,
      height                  : 0.08,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    let lTransform = new PureTransform({
      alignment              : Alignment.BOTTOM_CENTER,
      x                       : 0,
      y                       : -GameResizer.height/6,
      usePercent              : true,
      width                   : 0.13,
      height                  : 0.1,
      maintainAspectRatioType : MaintainAspectRatioType.MIN,
    });
    this.bottom = new PureSprite(bottomTexture, pTransform, lTransform);
    this.addChild(this.bottom.displayObject);

    let answerTexture = Texture.from("spr_small_answer");
    for(let i=0; i<4; i++) {
      let answerCard = new Sprite(answerTexture);
      answerCard.anchor.set(0.5);
      answerCard.scale.set(0.3);
      this.bottom.displayObject.addChild(answerCard);
      this.answers.push(answerCard);
      Util.registerOnPointerDown(answerCard, this._onAnswer.bind(this, i));
    }
    
  }

  resize() {
    super.resize();
    for(let i=0; i<this.answers.length; i++) {
      switch(i) {
        case 0:
          this.answers[i].position.set(-GameResizer.width/7, 0);
          break;
        case 1:
          this.answers[i].position.set(GameResizer.width/7, 0);
          break;
        case 2:
          this.answers[i].position.set(-GameResizer.width/7, -GameResizer.height/4);
          break;
        case 3:
          this.answers[i].position.set(GameResizer.width/7, -GameResizer.height/4);
          break;
      }
    }
  }

  disableAllButton() {
    this.buttons.forEach(button => {
      button.eventMode = "none";
    });
  }

  enableAllButton() {
    this.buttons.forEach(button => {
      button.eventMode = "static";
    });
  }

  _onAnswer(index) {
    this.emit(QuestionScreenEvent.OnTrueAnswer);
  }


}
