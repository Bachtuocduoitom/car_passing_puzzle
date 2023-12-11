import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { AssetSelector } from "../assetSelector";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameConstant } from "../../gameConstant";
import { TileManager } from "../gameObjects/tile/tileManager";
import { TileType } from "../gameObjects/tile/tileType";
import { GameSetting } from "../gameSetting";
import { GameStateManager, GameState } from "../../pureDynamic/systems/gameStateManager";
import { TapResult, TapResultType } from "../gameObjects/tapResult";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { Game } from "../../game";
import { Grid } from "../gameObjects/grid";
import { Container, Texture, Point } from "pixi.js";
import { Progress, ProgressEvent } from "../gameObjects/progress/progress";
import { ProgressBar } from "../gameObjects/progress/progressBar";
import { Util } from "../../helpers/utils";
import { SoundManager } from "../../soundManager";
import { Tween } from "../../systems/tween/tween";
import { PureRect } from "../../pureDynamic/PixiWrapper/pureRect";
import { SceneManager } from "../../pureDynamic/PixiWrapper/scene/sceneManager";
import { SpawnerEvent } from "../../systems/spawners/spawner";
import { DataManager } from "../data/dataManager";
import { UserData } from "../data/userData";
import { EndScreen, EndScreenEvent } from "../screens/endScreen";
import { DataLocal } from "../data/dataLocal";
import { WinScreen, WinScreenEvent } from "../screens/winScreen";
import { ResultDefaultFx } from "../gameObjects/effect/resultDefaultFx";
import { PerfectFx } from "../gameObjects/effect/perfectFx";
export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
    this.playTime = 0;
  }

  create() {
    super.create();
    this.ui.addScreens(
    );

    this.loadData();
  
    this._initBackgroundPortrait();
    GameStateManager.registerOnStateChangedCallback(this._onGameStateChanged.bind(this));
  }

  loadData() {
  
  }

  show() {
    super.show();
    this.tutorialScreen = this.ui.getScreen(GameConstant.SCREEN_TUTORIAL);
    if (this.tutorialScreen) {
      this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
      this.loadData();
    }
  }

  hide() {
    super.hide();
  }

  update(dt) {
    super.update(dt);
    // this.bgFx.update(dt);
    if (GameStateManager.state === GameState.Playing) {
      this.playTime += dt;
    }
  }

  destroy() {
    super.destroy();
    GameStateManager.unregisterOnStateChangedCallback(this._onGameStateChanged.bind(this));
  }

  _onGameStateChanged(state, prevState) {
    if (state === GameState.Playing && prevState === GameState.Tutorial) {
      this._onStart();
    }

    if (state === GameState.Lose) {
      // SoundManager.stop();
    }

    if (state === GameState.Paused && prevState === GameState.Playing) {
      // SoundManager.pause();
    }

    if (state === GameState.Playing && prevState === GameState.Paused) {
      if (this.audioId !== undefined) {
        // SoundManager.resume(this.audioId);
      }
    }
  }

  _onStart() {
    this.bgPortrait.displayObject.eventMode = "dynamic";
  }

  _lose() {
    if (GameConstant.CHEAT_IMMORTAL) {
      return;
    }
    Game.onLose();
    GameStateManager.state = GameState.Lose;
  }

  _win(delay = 0) {
    Game.onWin();
    GameStateManager.state = GameState.Win;
  }

  reInit() {  
    this.bgPortrait.displayObject.eventMode = "none";
  }

  _restartGame() {
    this.ui.disableAllScreens();
  }

  _onBackHome() {
    this.ui.disableAllScreens();
  }

 
  resize() {
    super.resize();
    
  }

  _initBackgroundPortrait() {
    let texture = Texture.from("bg");
    this.bgPortrait = new PureSprite(texture, new PureTransform({
      alignment               : Alignment.FULL,
      maintainAspectRatioType : MaintainAspectRatioType.NONE,
    }));
    this.addChild(this.bgPortrait.displayObject);
    this.bgPortrait.displayObject.eventMode = "dynamic";
  }
}
