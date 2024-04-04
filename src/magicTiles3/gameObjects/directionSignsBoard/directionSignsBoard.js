import { Container, Sprite } from "pixi.js"
import { AssetSelector } from "../../assetSelector";
import { CollisionTag } from "../../../physics/aabb/collisionTag";
import { SignItem } from "../../ui/signItem";
import { DirectionSignsBoardEvent } from "./directionSignsBoardEvent";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { DataManager } from "../../data/dataManager";

export class DirectionSignsBoard extends Container {
  constructor() {
    super();
    this.directionSignBoxes = [];
    this._config();
    this._initBoard();
    this._initDirectionSignBoxes();
    this.on(DirectionSignsBoardEvent.HandleAfterAddSign, (tag) => {
      this.directionSignBoxes.forEach((box) => {
        box.onUnChosen();
        if (box.tag == tag) {
          box.decreaseNumOfSigns();
        }
      })
    })
  }

  _config() {

  }

  _initBoard() {
    this.board = new Sprite(AssetSelector.getDirectionSignsBoardTexture());
    this.board.anchor.set(0.5);
    this.addChild(this.board);
  }

  _initDirectionSignBoxes() {
    //turn right box
    this.turnRightSignBox = new SignItem(CollisionTag.TurnRightSign);
    this.turnRightSignBox.pivot.set(0.5);
    this.addChild(this.turnRightSignBox);
    this.directionSignBoxes.push(this.turnRightSignBox);

    //turn left box
    this.turnLeftSignBox = new SignItem(CollisionTag.TurnLeftSign);
    this.turnLeftSignBox.on("chosen", () => {})
    this.turnLeftSignBox.pivot.set(0.5);
    this.addChild(this.turnLeftSignBox);
    this.directionSignBoxes.push(this.turnLeftSignBox);

    //turn back box
    this.turnBackSignBox = new SignItem(CollisionTag.TurnBackSign);
    this.addChild(this.turnBackSignBox);
    this.directionSignBoxes.push(this.turnBackSignBox);

    this.directionSignBoxes.forEach((box) => {
      box.on("chosen", (tag) => {
        this.directionSignBoxes.forEach((otherBox) => {
          if (otherBox.tag != tag) {
            otherBox.onUnChosen();
          }
        })
        this.emit(DirectionSignsBoardEvent.ItemChoose, tag);
        console.log("choose:", tag);
      })

      box.on("unchosen", (tag) => {
        this.emit(DirectionSignsBoardEvent.ItemUnChoose, tag);
        console.log("unchoose:", tag);
      })
    })
  }

  setNumOfSignItems(numOfTurnRightSignItems, numOfTurnLeftSignItems, numOfTurnBackSignItems) {
    this.directionSignBoxes.forEach((box) => {
      box.reset();
    });
    
    this.turnRightSignBox.setNumOfSigns(numOfTurnRightSignItems);
    this.turnLeftSignBox.setNumOfSigns(numOfTurnLeftSignItems);
    this.turnBackSignBox.setNumOfSigns(numOfTurnBackSignItems);    
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
    DataManager.getLevelData().width > 60 ? this.showHorizontalDirectionSignBoard() : this.showVerticalDirectionSignBoard();
    this.resize();
  }

  showVerticalDirectionSignBoard() {
    this.board.rotation = Math.PI / 2;

    this.turnRightSignBox.x = -this.turnRightSignBox.width / 2;
    this.turnRightSignBox.y = -this.board.width / 2 + 50;

    this.turnLeftSignBox.x = -this.turnLeftSignBox.width / 2;
    this.turnLeftSignBox.y = -this.turnLeftSignBox.height / 2;

    this.turnBackSignBox.x = -this.turnBackSignBox.width / 2;
    this.turnBackSignBox.y = this.board.width / 2 - 50 - this.turnBackSignBox.height;
  }

  showHorizontalDirectionSignBoard() {
    this.board.rotation = 0;

    this.turnRightSignBox.x = -this.board.width / 2 + 50;
    this.turnRightSignBox.y = -this.turnRightSignBox.height / 2;

    this.turnLeftSignBox.x = -this.turnLeftSignBox.width / 2;
    this.turnLeftSignBox.y = -this.turnLeftSignBox.height / 2;

    this.turnBackSignBox.x = this.board.width / 2 - 50 - this.turnBackSignBox.width;
    this.turnBackSignBox.y = -this.turnBackSignBox.height / 2;
  }

  resize() {
    this.x = GameResizer.width * 1/2 - this.width/2 - 30;
    this.y = GameResizer.height * 1/2 - this.height/2 - 20;
  }
}