import { DataLocal } from "./dataLocal";
export class UserData{
  static init() {
    this.currentLevel = DataLocal.currentLevel;
    this.listLevelUnlock = DataLocal.listLevelUnlock;
    this.listLevelStar = DataLocal.listLevelStar;
  }
}