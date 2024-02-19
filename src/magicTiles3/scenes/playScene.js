import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { AssetSelector } from "../assetSelector";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameConstant } from "../../gameConstant";
import { GameSetting } from "../gameSetting";
import { GameStateManager, GameState } from "../../pureDynamic/systems/gameStateManager";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { Game } from "../../game";
import { Container, Texture, Point, Sprite, Rectangle } from "pixi.js";
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
import { LevelManager } from "../gameObjects/levels/levelManager";
import { Level1 } from "../gameObjects/levels/level1";
import { DirectionSignSpawner } from "../gameObjects/directionSigns/directionSignSpawner";
import { Level2 } from "../gameObjects/levels/level2";
import level2 from "../../../assets/jsons/level2.json";
import { DirectionSignsBoard } from "../gameObjects/directionSignsBoard/directionSignsBoard";
import { QuestionScreen, QuestionScreenEvent } from "../screens/questionScreen";
import { ObstacleSpawner } from "../gameObjects/obstacles/obstacleSpawner";
import { PlayScreen, PlayScreenEvent } from "../screens/playScreen";
import { LevelEvent } from "../gameObjects/levels/levelEvent";
export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
    this.playTime = 0;
  }

  create() {
    super.create();
    this.ui.addScreens(
      new QuestionScreen(),
      new PlayScreen(),
    );
    this.questionScreen = this.ui.getScreen(GameConstant.SCREEN_QUESTION);
    // this.ui.setScreenActive(GameConstant.SCREEN_QUESTION);
    this.questionScreen.on(QuestionScreenEvent.OnTrueAnswer, () => {
      this._onTrueAnswer();
    });
    this.questionScreen.on(QuestionScreenEvent.OnFalseAnswer, () => {
      this._onFalseAnswer();
    });

    this.playScreen = this.ui.getScreen(GameConstant.SCREEN_PLAY);
    this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
    this.playScreen.on(PlayScreenEvent.Start, this._onStartLevel.bind(this));

    this.loadData();
  
    //this._initBackground();
    this._initGamePlay();
    this.resize();
    GameStateManager.registerOnStateChangedCallback(this._onGameStateChanged.bind(this));
  }

  loadData() {
  
  }

  _initBackground() {
    let texture = Texture.from("bg");
    this.bgPortrait = new PureSprite(texture, new PureTransform({
      alignment               : Alignment.FULL,
      maintainAspectRatioType : MaintainAspectRatioType.NONE,
    }));
    this.addChild(this.bgPortrait.displayObject);
  }

  _initGamePlay() {
    this.gameplay = new Container();
    this.gameplay.sortableChildren = true;
    this.addChild(this.gameplay);

    // this._initGameplayBackground();
    this._initDirectionSignsBoard();
    this._initLevels();
    this._initFx();
  }

  _initGameplayBackground() {
    this.gameplayBackground = new Sprite();
    this.gameplayBackground.anchor.set(0.5);
    this.gameplayBackground.texture = Texture.from("1005");
    this.gameplay.addChild(this.gameplayBackground);
  }

  _initFx() {
    this.fxs = [];
    this.fxContainer = new Container();
    this.fxContainer.zIndex = 100;
    this.gameplay.addChild(this.fxContainer);
  }

  _initDirectionSignsBoard() {
    this.directionSignsBoard = new DirectionSignsBoard();
    this.directionSignsBoard.zIndex = 100;
    this.directionSignsBoard.x = GameResizer.width * 1/2 - this.directionSignsBoard.width/2 -80;
    this.directionSignsBoard.y = GameResizer.height * 1/2 - this.directionSignsBoard.height/2 - 20;
    this.gameplay.addChild(this.directionSignsBoard);
  }

  _initLevels() {
    this.directionSignSpawner = new DirectionSignSpawner(this.gameplay);
    this.obstacleSpawner = new ObstacleSpawner(this.gameplay);
    
    this.levelManager = new LevelManager();
    this.levelManager.zIndex = 10;
    this.gameplay.addChild(this.levelManager);

    // let level1 = new Level1(directionSignSpawner);
    // this.levelManager.addLevel(level1);

    let level2 = new Level2(this.directionSignSpawner, this.obstacleSpawner, this.directionSignsBoard, DataManager.getLevelData());
    level2.on(LevelEvent.OnVehicleCollision, () => {
      this.ui.setScreenActive(GameConstant.SCREEN_QUESTION);
    });
    this.levelManager.addLevel(level2);
    this.levelManager.start();
  }

  show() {
    super.show();
  
  }

  hide() {
    super.hide();
  }

  update(dt) {
    super.update(dt);
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
    
  }

  _restartGame() {
    this.ui.disableAllScreens();
  }

  _onBackHome() {
    this.ui.disableAllScreens();
  }

  _onStartLevel() {
    this.playScreen.hideStartButton();
    this.directionSignsBoard.hide();
    this.levelManager.startLevelPlay();
  }

  _onTrueAnswer() {
    this.ui.setScreenActive(GameConstant.SCREEN_QUESTION, false);
    this.levelManager.afterTrueAnswer();
  }

  _onFalseAnswer() {
    this.levelManager.vehicle.turnLeft();
  }
 
  resize() {
    super.resize();
    
    this.gameplay.x = GameResizer.width / 2;
    this.gameplay.y = GameResizer.height / 2;
  }
 
}
