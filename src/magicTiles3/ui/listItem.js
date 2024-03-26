import { ScrollView } from "../../pureDynamic/core/scrollView/scrollView";
import { DataLocal } from "../data/dataLocal";
import { DataManager } from "../data/dataManager";
import { UserData } from "../data/userData";
import { ItemEvent, LevelItem } from "./levelItem";

export const ListItemEvent = Object.freeze({
  ItemListSelected  : "itemListSelected",
});

export class ListItem extends ScrollView {
  constructor (width = 0, height = 0) {
    super({
      width                   : width,
      height                  : height,
      background              : 0x000000,
      elementsMargin          : 50,
      vertPadding             : 0,
      horPadding              : 0,
      disableDynamicRendering : true,
    });

    this._create();
    this._initLevelItems();
  }

  _create () {
    this.itemList = [];
    this.background.alpha = 0;
    this.levelData = DataManager.levelData;
  }

  _initLevelItems() {
    this.levelData.forEach((data) => {
      let item = new LevelItem(data);
      this.itemList.push(item);
      this.addItem(item);

      item.on(ItemEvent.Selected, () => {
        this.emit(ListItemEvent.ItemListSelected);
      });
    });
  }

  show() {
    this.visible = true;
    this.scrollTop();
    this.updateLevelItems();
  }

  hide() {
      this.visible = false;
  }

  updateLevelItems() {
    for (let i = 0; i < this.levelData.length; i++) {
      this.itemList[i].updateData(this.levelData[i]);
    }
  }
 
}