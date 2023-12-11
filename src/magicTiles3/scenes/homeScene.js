import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { GameConstant } from "../../gameConstant";
import { SceneManager } from "../../pureDynamic/PixiWrapper/scene/sceneManager";
import { HomeScreen, HomeScreenEvent } from "../screens/homeScreen";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { SoundManager } from "../../soundManager";
import { DataManager } from "../data/dataManager";
import SongItem, { SongItemEvent } from "../ui/songItemUI";
import { Scrollbox } from "pixi-scrollbox";
import { Game } from "../../game";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { TopBarScreen } from "../screens/topbarScreen";
export const HomeSceneEvent = Object.freeze({
  ChooseLevel: "ChooseLevel",
});
export class HomeScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_HOME);
    this.listSongItem = [];
  }

  resize() {
    super.resize();
  }

  reset() {

  }

  show() {
    super.show();
    this.homeScreen = this.ui.getScreen(GameConstant.SCREEN_HOME);
    if (this.homeScreen) {
      this.homeScreen.updateList(DataManager.songsData);
      this.topBarScreen.updateDiamond(UserData.currency);
    }
  }

  create() {
    super.create();
    this.ui.addScreens(
      new HomeScreen(),
      new TopBarScreen(),
    );
    this.homeScreen = this.ui.getScreen(GameConstant.SCREEN_HOME);
    this.topBarScreen = this.ui.getScreen(GameConstant.SCREEN_TOP_BAR);
    this.homeScreen.on(HomeScreenEvent.ItemSelected, this.onItemSelected, this);
    this.homeScreen.on(HomeScreenEvent.ItemBought, this.onItemBought, this);

    this.ui.setScreenActive(GameConstant.SCREEN_TOP_BAR);
    this.ui.setScreenActive(GameConstant.SCREEN_HOME);
    this._initBackground();
  }

  update(dt) {
    super.update(dt);
  }

  destroy() {
    super.destroy();
  }

  _initBackground() {
    let bgPortraitTexture = Texture.from("bg_portrait");
    let portraitTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.portraitBg = new PureSprite(bgPortraitTexture, portraitTransform);
    this.addChild(this.portraitBg.displayObject);

    let bgLandscapeTexture = Texture.from("bg_portrait");
    let landscapeTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.landscapeBg = new PureSprite(bgLandscapeTexture, landscapeTransform);
    this.addChild(this.landscapeBg.displayObject);
  }

  displayBackground() {
    this.portraitBg.visible = false;
    this.landscapeBg.visible = false;
    this.bg = GameResizer.isPortrait() ? this.portraitBg : this.landscapeBg;
    this.bg.visible = true;
  }

  onItemSelected(id) {
    UserData.currentSong = id;
    DataLocal.updateCurrentSongData(id);
    GameStateManager.state = GameState.Tutorial;
    this.emit(HomeSceneEvent.ChooseLevel, this);
    SceneManager.unload(this);
  }

  onItemBought(id) {
    this.topBarScreen.updateDiamond(UserData.currency);
  }
}
