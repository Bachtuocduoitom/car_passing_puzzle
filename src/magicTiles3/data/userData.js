import { DataLocal } from "./dataLocal";
export class UserData{
  static init() {
    this.currentSong = DataLocal.currentSong;
    this.currency = DataLocal.currency;
    this.listSongUnlock = DataLocal.listSongUnlock;
    this.inventoryData = DataLocal.inventoryUserData;
    this.currentSkin = DataLocal.currentSkin;
  }
}