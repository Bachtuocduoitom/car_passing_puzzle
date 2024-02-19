import level1 from "../../../assets/jsons/level1.json";
import level2 from "../../../assets/jsons/level2.json";
import level3 from "../../../assets/jsons/level3.json";
import level4 from "../../../assets/jsons/level4.json";
import level5 from "../../../assets/jsons/level5.json";
import songData from "../../../assets/jsons/songData.json";
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
    this.songsData = songData;
    this.inventoryItemData = inventoryItemData;
    this.currentSong = DataLocal.currentSong;
    UserData.init();
    this.filterInventoryData();
    this.updateListSong();
  }

  static updateListSong() {
    for (let i = 0; i < this.songsData.length; i++) {
      for (let j = 0; j < UserData.listSongUnlock.length; j++) {
        if (this.songsData[i].id === UserData.listSongUnlock[j]) {
          this.songsData[i].isUnlock = true;
          break;
        }
      }
    }
  }

  static filterInventoryData() {
    for (let i = 0; i < this.inventoryItemData.length; i++) {
      for (let j = 0; j < UserData.inventoryData.length; j++) {
        if (this.inventoryItemData[i].key === UserData.inventoryData[j]) {
          this.inventoryItemData[i].isUnlock = true;
          break;
        }
      }
    }
  }


  static getLevelData() {
    return this.levelDatas[1];
  }

  static getSongDataById(id) {
    if (this.levelDatas.length === 0) {
      return null;
    }
    return this.levelDatas.find((song) => song.id === id);
  }

  static nextLevel() {
    this.currentSong = this.songsData.find((song) => song.isUnlock === true);
    DataLocal.currentSong = this.currentSong;
    DataLocal.updateCurrentSongData(this.currentSong.id);
  }

  static getSongAuthor(id) {
    return this.songsData.find((song) => song.id === id).author;
  }
}
