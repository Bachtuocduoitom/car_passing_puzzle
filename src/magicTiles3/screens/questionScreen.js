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
import { AnswerBottom4 } from "../ui/answerBottom4";
import { AnswerBottom3 } from "../ui/answerBottom3";
import { AnswerBottom2 } from "../ui/answerBottom2";

export const QuestionScreenEvent = Object.freeze({
  OnTrueAnswer: "ontrueanswer",
  OnFalseAnswer: "onfalseanswer",
});

export class QuestionScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_QUESTION);
    this.bottoms = [];
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
    this.bottoms.forEach(bottom => bottom.hide());
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
      fontSize: 140,
      fill: "black",
      align: "left",
      bold: true,
    });
    this.questionText.anchor.set(0.5);
    this.questionText.position.set(0, this.questionTable.displayObject.height);
    this.questionTable.displayObject.addChild(this.questionText);
  }

  _initAnswersCard() {
    this.bottomAnswers4 = new AnswerBottom4();
    this.addChild(this.bottomAnswers4);
    this.bottoms.push(this.bottomAnswers4);

    this.bottomAnswers3 = new AnswerBottom3();
    this.addChild(this.bottomAnswers3);
    this.bottoms.push(this.bottomAnswers3);

    this.bottomAnswers2 = new AnswerBottom2();
    this.addChild(this.bottomAnswers2);
    this.bottoms.push(this.bottomAnswers2);
    
  }

  resize() {
    super.resize();
    this.bottomAnswers4.resize();
    this.bottomAnswers3.resize();
    this.bottomAnswers2.resize();
  }

  setQuestion(questionData) {
    this.questionText.text = questionData.question;
    this.bottoms.forEach(bottom => bottom.hide());
    switch(questionData.answer.length) {
      case 2:
        this.bottomAnswers2.show();
        this.bottomAnswers2.setQuestion(questionData.answer);
        break;
      case 3:
        this.bottomAnswers3.show();
        this.bottomAnswers3.setQuestion(questionData.answer);
        break;
      case 4:
        this.bottomAnswers4.show();
        this.bottomAnswers4.setQuestion(questionData.answer);
        break;
    }
  }

}
