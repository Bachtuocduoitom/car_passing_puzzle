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
      new WinScreen(),
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
    this.playScreen.on(PlayScreenEvent.Start, this._onStartLevel.bind(this));
    this.playScreen.on(PlayScreenEvent.ResetLevel, this._resetLevel.bind(this));

    this.winScreen = this.ui.getScreen(GameConstant.SCREEN_WIN);
    this.ui.setScreenActive(GameConstant.SCREEN_WIN);
    this.ui.setScreenActive(GameConstant.SCREEN_WIN, false);
    this.winScreen.on(WinScreenEvent.NextLevel, this._onNextLevel.bind(this));
    this.winScreen.on(WinScreenEvent.Replay, this._restartGame.bind(this));
    this.winScreen.on(WinScreenEvent.BackHome, this._onBackHome.bind(this));


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
    this._initBlackScreen();
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

  _initBlackScreen() {
    let texture = Texture.WHITE;
    this.blackScreen =  new PureSprite(texture, new PureTransform({
      alignment               : Alignment.FULL,
      maintainAspectRatioType : MaintainAspectRatioType.NONE,
    }));
    this.blackScreen.displayObject.tint = 0x000000;
    this.blackScreen.displayObject.zIndex = 200;
    this.addChild(this.blackScreen.displayObject);
  }

  _initFx() {
    this.fxs = [];
    this.fxContainer = new Container();
    this.fxContainer.zIndex = 100;
    this.gameplay.addChild(this.fxContainer);

    this._initChangeSceneFx();
  }

  _initDirectionSignsBoard() {
    this.directionSignsBoard = new DirectionSignsBoard();
    this.directionSignsBoard.zIndex = 100;
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
    // this._newLevel();
    
  }

  _newLevel() {
    let level2 = new Level2(this.directionSignSpawner, this.obstacleSpawner, this.directionSignsBoard, DataManager.getLevelData());

    //level emit vehicle collision with obstacle
    level2.on(LevelEvent.OnVehicleCollisionWithObstacle, (collider) => {
      this.playScreen.hideResetButton();
      this.ui.setScreenActive(GameConstant.SCREEN_QUESTION);
      this.questionScreen.setQuestion(level2.getObstacleQuestionData());
    });

    //level emit vehicle collision with star
    level2.on(LevelEvent.OnVehicleCollisionWithStar, (collider) => {
      this.playScreen.hideResetButton();
      this.ui.setScreenActive(GameConstant.SCREEN_QUESTION);
      this.questionScreen.setQuestion(level2.getStarQuestionData());
    });

    //level emit vehicle collision with goal
    level2.on(LevelEvent.OnVehicleCollisionWithGoal, (numOfStarCollected) => {
      this.winScreen.setTextureForStars(numOfStarCollected);
      this.ui.setScreenActive(GameConstant.SCREEN_WIN);

    });

    level2.on(LevelEvent.OnVehicleDie, () => {
      this.playScreen.hideResetButton();
    });

    level2.on(LevelEvent.Complete, () => {
      this._win();
    });

    level2.on(LevelEvent.LevelFail, () => {
      this._lose();
    });

    this.levelManager.addLevel(level2);
    this.levelManager.start();

    this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
  }

  show() {
    super.show();
    
    this._playChangeSceneInFx();
    this._newLevel();
    this.directionSignsBoard.show();
    this.playScreen.showStartButton();
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

    this.ui.setScreenActive(GameConstant.SCREEN_WIN);
    Game.onLose();
    GameStateManager.state = GameState.Lose;
  }

  _win(delay = 0) {
    Game.onWin();
    GameStateManager.state = GameState.Win;
  }

  reInit() {  
    this.levelManager.destroyLevelPlay();
  }

  _restartGame() {
    Tween.createTween(this.blackScreen.displayObject, { alpha: 1 }, {
      duration    : 0.2,
      delay       : 0.1,
      onComplete  : () => {
        this.ui.disableAllScreens();
        // this.ui.setScreenActive(GameConstant.SCREEN_WIN, false);
        this.levelManager.resetLevelPlay();
        
        this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
        this.playScreen.showStartButton();

        this._playChangeSceneInFx();
      }
    }).start();
  }

  _onBackHome() {
    this._playChangeSceneOutFx(this._loadHomeScene.bind(this));
  }

  _loadHomeScene() {
    this.ui.disableAllScreens();
    this.reInit();
    GameStateManager.state = GameState.Home;
    let homeScene = SceneManager.getScene(GameConstant.SCENE_HOME);
    SceneManager.load(homeScene);
    SceneManager.unload(this);
  }

  _onNextLevel() {
    
    this._loadNextLevel();

  }

  _loadNextLevel() {
    
    Tween.createTween(this.blackScreen.displayObject, { alpha: 1 }, {
      duration    : 0.2,
      delay       : 0.1,
      onComplete  : () => {
        this.ui.disableAllScreens();
        this.reInit();
        this._newLevel();
        this.directionSignsBoard.show();
        this.playScreen.showStartButton();

        this._playChangeSceneInFx();
      }
    }).start();
  }

  _onStartLevel() {
    this.playScreen.hideStartButton();
    this.playScreen.showResetButton();

    this.levelManager.startLevelPlay();
  }

  _resetLevel() {
    this.playScreen.showStartButton();
    this.playScreen.hideResetButton();

    this.levelManager.resetLevelPlay();
  }

  _onTrueAnswer() {
    this.ui.setScreenActive(GameConstant.SCREEN_QUESTION, false);
    this.playScreen.showResetButton();
    this.levelManager.afterTrueAnswer();
  }

  _onFalseAnswer() {
    this.ui.setScreenActive(GameConstant.SCREEN_QUESTION, false);
    this.playScreen.showResetButton();
    this.levelManager.afterFalseAnswer();
  }
 
  resize() {
    super.resize();
    
    this.gameplay.x = GameResizer.width / 2;
    this.gameplay.y = GameResizer.height / 2;

    this.directionSignsBoard.x = GameResizer.width * 1/2 - this.directionSignsBoard.width/2 -80;
    this.directionSignsBoard.y = GameResizer.height * 1/2 - this.directionSignsBoard.height/2 - 20;
  }

  _initChangeSceneFx() {
    this.changeSceneInFx = Tween.createTween(this.blackScreen.displayObject, { alpha: 0 }, {
      duration    : 0.2,
      delay       : 0.1,
      onComplete  : () => {
      }
    });

    this.fxs.push(this.changeSceneInFx);
  }

  _playChangeSceneInFx() {
    this.blackScreen.displayObject.alpha = 1;
    this.changeSceneInFx.start();
  }

  _playChangeSceneOutFx(callBackFunction) {
    Tween.createTween(this.blackScreen.displayObject, { alpha: 1 }, {
      duration    : 0.3,
      delay       : 0.1,
      onComplete  : () => {
        callBackFunction();
      }
    }).start();
  }
 
}
