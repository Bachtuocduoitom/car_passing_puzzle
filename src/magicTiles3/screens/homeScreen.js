import { Scrollbox } from "pixi-scrollbox";
import { GameConstant } from "../../gameConstant";
import { UIScreen } from "../../pureDynamic/PixiWrapper/screen/uiScreen";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { Game } from "../../game";
import { SongItem, SongItemEvent } from "../ui/songItemUI";
import { DataManager } from "../data/dataManager";
import { Container, Sprite, Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
import { Time } from "../../systems/time/time";
export const HomeScreenEvent = Object.freeze({
  ItemSelected : "ItemSelected",
  ItemBought   : "ItemBought",
});
export class HomeScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_HOME);
    this.listSongItem = [];
  }

  create() {
    super.create();
    this._initMusicDisc();
    this._initScrollBox();
    this.updateList(DataManager.songsData);
    this.initTextSellect();
    this.resize();
    this.play();
  }

  show() {
    super.show();
  }

  resize() {
    super.resize();
    let boxWidth = GameResizer.width;
    let boxHeight = GameResizer.height * 0.5;
    let scrollX = 0;
    let scrollY = GameResizer.height / 2.5;
    let x = 0;
    let y = -GameResizer.height / 2.5;
    this.discOutline2.displayObject.scale.set(1.6, 1.6);
    this.discOutline1.displayObject.scale.set(1.7, 1.7);
    this.icon.displayObject.scale.set(2, 2);
    this.mask2.displayObject.scale.set(1.4, 1.4);
    if (GameResizer.isLandScape()) {
      x = -GameResizer.width / 5;
      y = -200;
      this.scrollBox.position.set(0, GameResizer.height / 3);
      this.discOutline2.displayObject.scale.set(3.2, 3.2);
      this.discOutline1.displayObject.scale.set(3.4, 3.4);
      this.icon.displayObject.scale.set(4, 4);
      this.mask2.displayObject.scale.set(2.8, 2.8);
      scrollX = GameResizer.width * 0.2;
      scrollY = y + GameResizer.height / 2.5;
    }
    this.circleGroup.x = x;
    this.circleGroup.y = y;
    this.iconGroup.y = y;
    this.iconGroup.x = x;
    this.scrollBox.resize({
      boxWidth,
      boxHeight,
      scrollWidth: boxWidth,
    });
    this.scrollBox.position.set(scrollX, scrollY);
  }

  _initMusicDisc() {
    this.circleGroup = new Container();
    this.addChild(this.circleGroup);

    let texture = Texture.from("spr_music_disc");
    let pTransform = new PureTransform({
      alignment  : Alignment.MIDDLE_CENTER,
      usePercent : true,
      y          : 200,
    });

    let lTransform = new PureTransform({
      alignment  : Alignment.MIDDLE_CENTER,
      usePercent : true,
      y          : 200,
    });
    this.circle1 = new PureSprite(texture, pTransform, lTransform);
    this.circle1.displayObject.alpha = 0.2;
    this.circleGroup.addChild(this.circle1.displayObject);

    this.circle2 = new PureSprite(texture, pTransform, lTransform);
    this.circle2.displayObject.alpha = 0.2;
    this.circleGroup.addChild(this.circle2.displayObject);

    let durationScale = 1;
    let durationAlpha = 1;
    let tweenerScale = { x: 1, y: 1 };
    this.tweenScale1 = Tween.createTween(tweenerScale, { x: 6, y: 6 }, {
      duration : durationScale,
      yoyo     : true,
      onUpdate : () => {
        this.circle1.displayObject.scale.set(tweenerScale.x, tweenerScale.y);
      },
      onStart: () => {
        this.tweenDelay1.start();
      },
    });
    this.tweenDelay1 = Tween.createCountTween({
      duration   : 0.1,
      onComplete : () => {
        this.tweenAlpha1.start();
      },
    });
    let tweener = { alpha: 0.2 };
    this.tweenAlpha1 = Tween.createTween(tweener, { alpha: 0 }, {
      duration : durationAlpha,
      yoyo     : true,
      onUpdate : () => {
        this.circle1.displayObject.alpha = tweener.alpha;
      },
      onComplete: () => {
        this.tweenScale1.start();
      },
    });
    let tweenerScale2 = { x: 1, y: 1 };
    this.tweenScale2 = Tween.createTween(tweenerScale2, { x: 6, y: 6 }, {
      duration : durationScale,
      yoyo     : true,
      onUpdate : () => {
        this.circle2.displayObject.scale.set(tweenerScale2.x, tweenerScale2.y);
      },
      onStart: () => {
        this.tweenDelay2.start();
      },
    });
    this.tweenDelay2 = Tween.createCountTween({
      duration   : 0.1,
      onComplete : () => {
        this.tweenAlpha2.start();
      },
    });
    let tweener2 = { alpha: 0.2 };
    this.tweenAlpha2 = Tween.createTween(tweener2, { alpha: 0 }, {
      duration : durationAlpha,
      yoyo     : true,
      onUpdate : () => {
        this.circle2.displayObject.alpha = tweener2.alpha;
      },
      onComplete: () => {
        this.tweenScale2.start();
      },
    });
    this.iconGroup = new Container();
    this.addChild(this.iconGroup);

    let textureIcon = Texture.from("1005");
    let textCircle =  Texture.from("spr_music_disc");
    this.mask2 = new PureSprite(textCircle, pTransform, lTransform);
    this.iconGroup.addChild(this.mask2.displayObject);

    this.iconGroup.mask = this.mask2.displayObject;
    this.icon = new PureSprite(textureIcon, pTransform, lTransform);
    this.iconGroup.addChild(this.icon.displayObject);

    let textureOutLine1 = Texture.from("spr_music_disc_circle");
    this.discOutline1 = new PureSprite(textureOutLine1, pTransform, lTransform);
    this.discOutline1.displayObject.alpha = 0.3;

    let textureOutLine2 = Texture.from("spr_music_disc_mask");
    this.discOutline2 = new PureSprite(textureOutLine2, pTransform, lTransform);
    this.discOutline2.displayObject.alpha = 0.3;

    this.circleGroup.addChild(this.discOutline1.displayObject);
    this.circleGroup.addChild(this.discOutline2.displayObject);
  }

  initTextSellect() {
    let texture = Texture.from("spr_txt_select_song");
    let pTransform = new PureTransform({
      alignment : Alignment.CUSTOM,
      y         : 100,
      anchorX   : 0.5,
      anchorY   : 0,
      pivotX    : 0.5,
      pivotY    : 0.5,
      width     : texture.width,
      height    : texture.height,
    });
    let lTransform = new PureTransform({
      alignment : Alignment.CUSTOM,
      y         : 300,
      anchorX   : 0.7,
      anchorY   : 0,
      pivotX    : 0.5,
      pivotY    : 0.5,
      width     : texture.width * 1.5,
      height    : texture.height * 1.5,
    });
    this.selectText = new PureSprite(texture, pTransform, lTransform);
    this.addChild(this.selectText.displayObject);
  }

  update(dt) {
    super.update(dt);
    this.icon.displayObject.rotation -= 2 * Time._dt;
  }

  play() {
    this.tweenScale1.start();
    Tween.createCountTween({
      duration   : 0.5,
      onComplete : () => {
        this.tweenScale2.start();
      },
    }).start();
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
    this.scrollBox.position.set(0, GameResizer.height / 3);
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
  }

  addSongItem(index) {
    let item = this._initSongItem(index);
    this.listSongItem.push(item);

    item.on(SongItemEvent.Selected, (id) => {
      this.emit(HomeScreenEvent.ItemSelected, id);
    });
    item.on(SongItemEvent.Bought, (id) => {
      this.onItemBought(id);
    });

    return item;
  }

  onItemBought(id) {
    this.emit(HomeScreenEvent.ItemBought, id);
  }
}
