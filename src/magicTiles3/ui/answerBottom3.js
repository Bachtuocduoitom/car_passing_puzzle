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
import { AnswerUI } from "./answerUI";
import { QuestionScreenEvent } from "../screens/questionScreen";

export class AnswerBottom3 extends Container {
  constructor() {
    super();
    this.numberOfAnswer = 3;
    this.answers = [];
    this._initAnswersCard();
  }

  show() {
    this.visible = true;
    this.resize();
  }

  hide() {
    this.visible = false;
    this.answers.forEach(answer => answer.reset());
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

    for(let i = 0; i < this.numberOfAnswer; i++) {
      let answerCard = new AnswerUI();
      answerCard.setText((i+1).toString());
      answerCard.anchor.set(0.5);
      answerCard.scale.set(0.8);
      this.bottom.displayObject.addChild(answerCard);
      this.answers.push(answerCard);
      Util.registerOnPointerDown(answerCard, this._onAnswer.bind(this, i));
    }
    
  }

  resize() {
    for(let i = 0; i < this.numberOfAnswer; i++) {
      switch(i) {
        case 0:
          // this.answers[i].position.set(-GameResizer.width/6, -GameResizer.height/4);
          this.answers[i].position.set(-GameResizer.width/4, 40);
          break;
        case 1:
          this.answers[i].position.set(0, 40);
          break;
        case 2:
          this.answers[i].position.set(GameResizer.width/4, 40);
          break;
      }
    }
  }

  _onAnswer(index) {
    if (this.answers[index].correct) {
      this.answers[index].onTrueAnswer();

      Tween.createCountTween({
        duration: 0.5,
        onComplete: () => {
          this.parent.emit(QuestionScreenEvent.OnTrueAnswer);
        },
      }).start();
    } else {
      this.answers[index].onFalseAnswer();

      Tween.createCountTween({
        duration: 0.5,
        onComplete: () => {
          this.parent.emit(QuestionScreenEvent.OnFalseAnswer);
        },
      }).start();
    }
  }

  setQuestion(answerData) {
    for(let i = 0; i < this.numberOfAnswer; i++) {
      this.answers[i].correct = answerData[i].correct;
    }
  }

}
