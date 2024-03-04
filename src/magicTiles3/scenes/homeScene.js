import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { GameConstant } from "../../gameConstant";
import { SceneManager } from "../../pureDynamic/PixiWrapper/scene/sceneManager";
import { HomeScreen, HomeScreenEvent } from "../screens/homeScreen";
import { GameState, GameStateManager } from "../../pureDynamic/systems/gameStateManager";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { SoundManager } from "../../soundManager";
import { DataManager } from "../data/dataManager";
import { Scrollbox } from "pixi-scrollbox";
import { Game } from "../../game";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { Texture } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { Tween } from "../../systems/tween/tween";
export const HomeSceneEvent = Object.freeze({
  Play : "play",
});
export class HomeScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_HOME);
  }

  resize() {
    super.resize();
  }

  reset() {

  }

  show() {
    super.show();
    
  }

  create() {
    super.create();
    this.ui.addScreens(
      new HomeScreen(),
    );
    this.homeScreen = this.ui.getScreen(GameConstant.SCREEN_HOME);
    this.homeScreen.on(HomeScreenEvent.PlayButtonSelected, () => {
      this.emit(HomeSceneEvent.Play);
    });

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
    let bgLandscapeTexture = Texture.from("background_homeScene");
    let landscapeTransform = new PureTransform({
      alignment: Alignment.FULL,
    });
    this.landscapeBg = new PureSprite(bgLandscapeTexture, landscapeTransform);
    this.addChild(this.landscapeBg.displayObject);
  }

}
