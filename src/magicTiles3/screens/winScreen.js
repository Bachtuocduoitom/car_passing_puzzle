import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { SongItem, SongItemEvent } from "../ui/songItemUI";
import { DataManager } from "../data/dataManager";
import { Container, Graphics, TextStyle, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Util } from "../../helpers/utils";
export const WinScreenEvent = Object.freeze({
  ItemListSelected : "ItemListSelected",
  ItemListBought   : "ItemListBought",
  BackHome         : "backHome",
});
export class WinScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_WIN);
    this.listSongItem = [];
    this.listActiveStar = [];
    this.earnStar = -1;
  }

  create() {
    super.create();
    this._initBackground();
    this._initScrollBox();
    this.initTextSellect();
    this.updateList(DataManager.songsData);
    this._initBottom();
    this._initStars();
  }

  show() {
    super.show();
    this.updateList(DataManager.songsData);
  }

  _initBackground() {
    let texture = Texture.from("bg_portrait");
    let portraitTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.bg = new PureSprite(texture, portraitTransform);
    this.addChild(this.bg.displayObject);
  }

  initTextSellect() {
    let pTransform = new PureTransform({
      alignment       : Alignment.CUSTOM,
      y               : 100,
      anchorX         : 0.5,
      anchorY         : 0,
      pivotX          : 0.5,
      pivotY          : 0.5,
      useOriginalSize : true,
    });
    let lTransform = new PureTransform({
      alignment       : Alignment.CUSTOM,
      y               : 100,
      anchorX         : 0.5,
      anchorY         : 0,
      pivotX          : 0.5,
      pivotY          : 0.5,
      useOriginalSize : true,
    });
    let style = new TextStyle({
      fontSize   : 70,
      align      : "center",
      fill       : 0xFFFFFF,
      fontWeight : "bold",
    });
    let texture = Texture.from("spr_song_glow");
    this.selectText = new PureSprite(texture, pTransform, lTransform);
    this.selectText.displayObject.scale.set(2, 2);
    this.addChild(this.selectText.displayObject);
    this.txtSongName = new PureText("Song Name", pTransform, style, lTransform, style);
    this.addChild(this.txtSongName.displayObject);
  }


  fillStar() {
    if (this.earnStar >= 0) {
      for (let i = 0; i < this.earnStar; i++) {
        if (this.listActiveStar[i]) {
          this.listActiveStar[i].displayObject.alpha = 1;
        }
      }
    }
  }

  unFillAllStars() {
    this.earnStar = -1;
    this.listActiveStar.forEach((star) => {
      if (star) {
        star.displayObject.alpha = 0;
      }
    });
  }

  resize() {
    super.resize();
    let boxWidth = GameResizer.width;
    let boxHeight = GameResizer.height * 1.8 / 3;
    this.scrollBox.resize({
      boxWidth,
      boxHeight,
      scrollWidth: boxWidth,
    });
    this.scrollBox.position.set(0, GameResizer.height / 4);
    if (GameResizer.isLandScape()) {
      boxWidth = GameResizer.width;
      boxHeight = GameResizer.height * 1.5 / 3;
      this.scrollBox.resize({
        boxWidth,
        boxHeight,
        scrollWidth: boxWidth,
      });
      this.scrollBox.position.set(0, GameResizer.height / 4);
    }
    this.starGroup.y = GameResizer.height / 9;
    this._onResizeBottom();
  }

  _initStars() {
    this.starGroup = new Container();
    this.starGroup.y = GameResizer.height / 9;
    this.addChild(this.starGroup);

    this.star1 = this.addStar();
    this.star2 = this.addStar();
    this.star3 = this.addStar();
    this.starActive1 = this.addStarActive();
    this.starActive2 = this.addStarActive();
    this.starActive3 = this.addStarActive();

    this.star1.x = this.star2.x - 200;
    this.starActive1.x = this.star2.x - 200;
    this.star3.x = this.star2.x + 200;
    this.starActive3.x = this.star2.x + 200;
  }

  addStar(x) {
    let texture = Texture.from("spr_star_2");
    this.pTransformStar = new PureTransform({
      alignment  : Alignment.TOP_CENTER,
      usePercent : true,
    });
    this.lTransformStar = new PureTransform({
      alignment  : Alignment.TOP_CENTER,
      usePercent : true,
    });
    let star = new PureSprite(texture, this.pTransformStar, this.lTransformStar);
    if (x) {
      star.x = x;
    }
    this.starGroup.addChild(star.displayObject);

    return star;
  }

  addStarActive() {
    let textureActive = Texture.from("spr_star_active");
    let starActive = new PureSprite(textureActive, this.pTransformStar, this.lTransformStar);
    starActive.displayObject.alpha = 0;
    this.listActiveStar.push(starActive);
    this.starGroup.addChild(starActive.displayObject);
    return starActive;
  }

  _initScrollBox() {
    let boxWidth = GameResizer.width;
    let boxHeight = GameResizer.height * 1.8 / 3;
    this.scrollBox = new Scrollbox({
      boxWidth,
      boxHeight,
      divWheel    : Game.app.view,
      interaction : Game.app.renderer.plugins.interaction,
      overflow    : "hidden",
    });
    this.scrollBox.position.set(0, GameResizer.height / 4);
    if (GameResizer.isLandScape()) {
      boxWidth = GameResizer.width;
      boxHeight = GameResizer.height * 1.5 / 3;
      this.scrollBox.resize({
        boxWidth,
        boxHeight,
        scrollWidth: boxWidth,
      });
      this.scrollBox.position.set(0, GameResizer.height / 4);
    }

    this.scrollBox.update();
    this.addChild(this.scrollBox);
  }

  _initSongItem(index) {
    let songItem = new SongItem();
    songItem.y = (songItem.height + 20) * index;
    this.scrollBox.content.addChild(songItem);
    this.scrollBox.update();
    return songItem;
  }

  updateList(data) {
    for (let i = 0; i < data.length; i++) {
      let songItem = this.listSongItem[i] || this.addSongItem(i);
      songItem.enabled = true;
      songItem.updateData(data[i]);
    }
    for (let i = data.length; i < this.listSongItem.length; i++) {
      let item = this.listSongItem[i];
      item.enabled = false;
    }
    this.txtSongName.displayObject.text = DataManager.getSongDataById(UserData.currentSong).name;
  }

  addSongItem(index) {
    let item = this._initSongItem(index);
    this.listSongItem.push(item);

    item.on(SongItemEvent.Selected, (id) => {
      UserData.currentSong = id;
      DataLocal.updateCurrentSongData(id);
      this.emit(WinScreenEvent.ItemListSelected, id);
    });
    item.on(SongItemEvent.Bought, (id) => {
      this.onItemBought(id);
    });

    return item;
  }

  onItemBought(id) {
    this.emit(WinScreenEvent.ItemListBought, id);
  }

  _initBottom() {
    this.bottom = new Container();
    this.bottom.y = GameResizer.height / 2.3;
    if (GameResizer.isLandScape()) {
      this.bottom.y = GameResizer.height / 2.5;
    }
    this.addChild(this.bottom);
    let textureHome = Texture.from("spr_btn_ctn");
    let pTransform = new PureTransform({
      alignment  : Alignment.MIDDLE_CENTER,
      usePercent : true,
    });
    let lTransform = new PureTransform({
      alignment  : Alignment.MIDDLE_CENTER,
      usePercent : true,
    });
    this.buttonHome = new PureSprite(textureHome, pTransform, lTransform);
    this.buttonHome.displayObject.scale.set(1.5, 1.5);
    this.bottom.addChild(this.buttonHome.displayObject);
    Util.registerOnPointerDown(this.buttonHome.displayObject, () => {
      this._onBackHome();
    });
  }

  _onBackHome() {
    this.unFillAllStars();
    this.emit(WinScreenEvent.BackHome, this);
  }

  _onResizeBottom() {
    this.bottom.y = GameResizer.height / 2.3;
    this.buttonHome.displayObject.scale.set(1.5, 1.5);
    if (GameResizer.isLandScape()) {
      this.bottom.y = GameResizer.height / 2.5;
    }
  }
}
