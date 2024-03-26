import level1 from "../../../assets/jsons/level1.json";
import level2 from "../../../assets/jsons/level2.json";
import level3 from "../../../assets/jsons/level3.json";
import level4 from "../../../assets/jsons/level4.json";
import level5 from "../../../assets/jsons/level5.json";
import level6 from "../../../assets/jsons/level6.json";
import level7 from "../../../assets/jsons/level7.json";
import level2_1 from "../../../assets/jsons/level2-1.json";
import levelData from "../../../assets/jsons/levelData.json";
import question from "../../../assets/jsons/question.json";
import { DataLocal } from "./dataLocal";
import { UserData } from "./userData";
import inventoryItemData from "../../../assets/jsons/inventoryItemData.json";
export class DataManager {
  static init() {
    this.levelDatas = [];
    this.levelDatas.push(level1);
    this.levelDatas.push(level2);
    this.levelDatas.push(level3);
    this.levelDatas.push(level4);
    this.levelDatas.push(level5);
    this.levelDatas.push(level6);
    this.levelDatas.push(level7);
    this.levelDatas.push(level2_1);
    this.levelData = levelData;
    this.inventoryItemData = inventoryItemData;
    this.levelQuestionsDatas =[];
    this.levelQuestionsDatas.push(question);
    this.currentLevel = DataLocal.currentLevel;
    UserData.init();
    this.updateListLevelUnlock();
    this.updateListLevelStar();
  }

  static updateListLevelUnlock() {
    for (let i = 0; i < this.levelData.length; i++) {
      for (let j = 0; j < UserData.listLevelUnlock.length; j++) {
        if (this.levelData[i].id === UserData.listLevelUnlock[j]) {
          this.levelData[i].isUnlock = true;
          break;
        }
      }
    }
  }

  static updateListLevelStar() {
    for (let i = 0; i < UserData.listLevelStar.length; i++) {
      if (this.levelData[i].isUnlock) {
        this.levelData[i].star = UserData.listLevelStar[i];
      }
    }
  }

  static updateNextLevel() {
    let nextLevel = DataManager.getNextLevel();
    if (nextLevel && !DataLocal.listLevelUnlock.includes(nextLevel)) {
      DataLocal.listLevelUnlock.push(nextLevel);
      DataLocal.updateListLevelUnlockData(DataLocal.listLevelUnlock);
      
      DataManager.updateListLevelUnlock();
    }
  }

  static updateStarLevel(star) {
    let index = this.levelData.findIndex((level) => level.id === this.currentLevel);
    if (index != -1 && (star > DataLocal.listLevelStar[index] || DataLocal.listLevelStar[index] === undefined)) {
      DataLocal.listLevelStar[index] = star;
      DataLocal.updateListLevelStarData(DataLocal.listLevelStar);

      DataManager.updateListLevelStar();
    }
  }

  static updateCurrentLevel(id) {
    this.currentLevel = id;
    DataLocal.updateCurrentLevelData(this.currentLevel);
  }

  static updateCurrentLevelToLastUnlockLevel() {
    this.currentLevel = DataLocal.listLevelUnlock[DataLocal.listLevelUnlock.length - 1];
    DataLocal.updateCurrentLevelData(this.currentLevel);
  }

  static getLevelData() {
    return this.levelDatas.find((level) => level.name === this.currentLevel);
  }

  static getLevelQuestionsData() {
    return this.levelQuestionsDatas[0];
  }

  static getLevelDataById(id) {
    if (this.levelDatas.length === 0) {
      return null;
    }
    return this.levelDatas.find((level) => level.id === id);
  }

  static getLevelTotalScore() {
    let totalScore = 0;
    let index = this.levelData.findIndex((level) => level.id === this.currentLevel);;
    if (index != -1) {
      for (let i = index; i > index - 7; i--) {
        totalScore += this.levelData[i].star;
      }
    }
    return totalScore;
  }

  static checkCurrentLevelIsEndLevel() {
    let index = this.levelData.findIndex((level) => level.id === this.currentLevel);
    if (this.levelData[index].isEndLevel) {
      return true;
    }
    return false;
  }

  static nextLevel() {
    this.currentLevel = DataManager.getNextLevel();
    DataLocal.updateCurrentLevelData(this.currentLevel);
  }

  static getNextLevel() {
    for (let i = 0; i < this.levelData.length; i++) {
      if (this.levelData[i].id === this.currentLevel) {
        if (i + 1 < this.levelData.length) {
          return this.levelData[i + 1].id;
        }
      }
    }
    return null;
  }
}
