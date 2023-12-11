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
import { NoteSpawnerEvent, NoteSpawnerManager } from "../scripts/components/noteSpanwer";
import { SpawnerEvent } from "../../systems/spawners/spawner";
import { DataManager } from "../data/dataManager";
import { UserData } from "../data/userData";
import { TutorialScreen } from "../screens/tutorialScreen";
import { EndScreen, EndScreenEvent } from "../screens/endScreen";
import { DataLocal } from "../data/dataLocal";
import { TopBarScreen } from "../screens/topbarScreen";
import { WinScreen, WinScreenEvent } from "../screens/winScreen";
import { ResultDefaultFx } from "../gameObjects/effect/resultDefaultFx";
import { PerfectFx } from "../gameObjects/effect/perfectFx";
export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
    this.playTime = 0;
    this.isTrackPlayed = false;
    this.score = 0;
    this.songDelayTime = 0;
    this.totalTiles = 0;
    this.autoPlayTouchOffset = new Point();
    this.autoPlayTouchOffset.y = Util.randomInt(GameConstant.AUTOPLAY_TOUCH_MIN, GameConstant.AUTOPLAY_TOUCH_MAX);
  }

  create() {
    super.create();
    this.ui.addScreens(
      new TutorialScreen(),
      new EndScreen(),
      new WinScreen(),
      new TopBarScreen(),
    );
    this.topBarScreen = this.ui.getScreen(GameConstant.SCREEN_TOP_BAR);
    this.tutorialScreen = this.ui.getScreen(GameConstant.SCREEN_TUTORIAL);
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
    this.endScreen = this.ui.getScreen(GameConstant.SCREEN_LOSE);
    this.endScreen.on(EndScreenEvent.ItemListSelected, this._restartGame, this);
    this.endScreen.on(EndScreenEvent.BackHome, this._onBackHome, this);
    this.endScreen.on(EndScreenEvent.ItemListBought, this.onItemBought, this);

    this.winScreen = this.ui.getScreen(GameConstant.SCREEN_WIN);
    this.winScreen.on(WinScreenEvent.ItemListSelected, this._restartGame, this);
    this.winScreen.on(WinScreenEvent.BackHome, this._onBackHome, this);
    this.winScreen.on(WinScreenEvent.ItemListBought, this.onItemBought, this);

    this.loadData();
    this.initializedBeatPos = GameSetting.beatPos.value; // first beat position use to rearrange tiles on resize
    this.songDelayTime = GameSetting.beatPos.value / GameConstant.SPEED;

    this._initBackgroundPortrait();
    this._initGridContainer();
    this._initGrid();
    this._initGlowLine();
    this._initFxHold();
    this._initFxTouch();
    this._initTileManager();
    this._initNoteSpawner();
    // this._spawnTiles();
    this._initMissedTile();
    this._initScoreText();
    this._initResultFx();
    this._initResultText();
    this._initTapResults();
    this._initProgress();
    // this._initBgFx();
    this.totalTiles = this.tileManager.tiles.length;
    GameStateManager.registerOnStateChangedCallback(this._onGameStateChanged.bind(this));
  }

  loadData() {
    this.song = DataManager.getSongDataById(UserData.currentSong);
    this.songData = this.song.data;
    this.songName = this.song.name;
    if (GameConstant.CHEAT_ONE_NOTE) {
      this.songData = this.songData.slice(0, 2);
    }
    let author = DataManager.getSongAuthor(UserData.currentSong);
    this.tutorialScreen.updateSongName(this.songName);
    this.tutorialScreen.updateSongAuthor(author);
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

  _initResultFx() {
    this.fxs = [];
    this.fireworkContainer = new Container();
    this.addChild(this.fireworkContainer);
  }

  _addFxDefault(x = 0, y = 0, delayTime = 0) {
    let fx = new ResultDefaultFx(delayTime);
    fx.x = x;
    fx.y = y;
    this.fireworkContainer.addChild(fx);
    this.fxs.push(fx);
  }

  _addFxPerfect(x = 0, y = 0, delayTime = 0) {
    let fx = new PerfectFx(delayTime);
    fx.x = x;
    fx.y = y;
    this.fireworkContainer.addChild(fx);
    this.fxs.push(fx);
  }

  _onResizeFx() {
    let scale = 3;
    if (GameResizer.isLandScape()) {
      scale = 4.5;
    }
    this.fxs.forEach((fx) => fx.scale.set(scale));
  }

  update(dt) {
    super.update(dt);
    // this.bgFx.update(dt);
    if (GameStateManager.state === GameState.Playing) {
      this.playTime += dt;
      this.progress.score = this.playTime;
      if (!this.isTrackPlayed && this.playTime >= this.songDelayTime) {
        this.audioId = SoundManager.play(this.songName);
        this.isTrackPlayed = true;
      }

      for (let i = 0; i < this.tileManager.tiles.length; i++) {
        let tile = this.tileManager.tiles[i];
        tile.update(dt);

        // cheat auto play
        if (GameConstant.AUTO_PLAY) {
          if (tile.y + tile.height > GameSetting.beatPos.value + this.autoPlayTouchOffset.y && !tile.isPointerDown) {
            tile.onPointerDown({
              data: {
                global: {
                  y: GameSetting.beatPos.value + this.autoPlayTouchOffset.y,
                },
              },
            });
            this.autoPlayTouchOffset.y = Util.randomInt(GameConstant.AUTOPLAY_TOUCH_MIN, GameConstant.AUTOPLAY_TOUCH_MAX);
          }
          else if (tile.y >= GameSetting.beatPos.value) {
            tile.onPointerUp();
          }
        }

        // check tile out of screen
        if (!tile.isTouched && !tile.isPointerDown && tile.y + tile.height >= GameResizer.height) {
          this._lose();
        }
        else if (tile.isTouched && tile.y > GameResizer.height) {
          // destroy tile
          this.tileManager.tiles.splice(this.tileManager.tiles.indexOf(tile), 1);
          tile.emitter.emit(SpawnerEvent.Despawn);
          i--;
        }
      }
    }
  }

  destroy() {
    super.destroy();
    GameStateManager.unregisterOnStateChangedCallback(this._onGameStateChanged.bind(this));
  }

  onItemBought() {
    this.topBarScreen.updateDiamond(UserData.currency);
  }

  _initBgFx() {
    this.bgFx = new particles.Emitter(
      this.bgPortrait.displayObject,
      PIXI.Texture.from("GlowDot"),
      {
        alpha: {
          start : 0.7,
          end   : 0.4,
        },
        scale: {
          start                  : 0.5,
          end                    : 0.5,
          minimumScaleMultiplier : 1,
        },
        color: {
          start : "#ffffff",
          end   : "#f9d9ff",
        },
        speed: {
          start                  : 60,
          end                    : 30,
          minimumSpeedMultiplier : 1.2,
        },
        acceleration: {
          x : 0,
          y : -10,
        },
        maxSpeed      : 50,
        startRotation : {
          min : -45,
          max : -90,
        },
        noRotation    : true,
        rotationSpeed : {
          min : 0,
          max : 0,
        },
        lifetime: {
          min : 0.5,
          max : 10,
        },
        blendMode       : "normal",
        frequency       : 0.1,
        emitterLifetime : -1,
        maxParticles    : 30,
        pos             : {
          x : 0,
          y : 0,
        },
        addAtBack : false,
        spawnType : "rect",
        spawnRect : {
          x : -GameResizer.width / 2,
          y : GameResizer.height / 4,
          w : GameResizer.height,
          h : 1,
        },
      },
    );
    // this.bgFx.updateSpawnPos(0, GameResizer.height/2);
    this.bgFx.emit = true;
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
    // this.bgFx.emit = true;
    this.noteSpawner.start();
    this.ui.disableAllScreens();
  }

  /**
   * @param {PIXI.interaction.InteractionEvent} event
   */
  _onMiss(event) {
    let pos = event.data.global;
    for (let i = 0; i < this.tileManager.tiles.length; i++) {
      let tile = this.tileManager.tiles[i];
      if (tile.y <= pos.y && tile.y + tile.height >= pos.y) {
        this._showMissedTile(pos, tile.y, tile.height);
        this._lose();
        return;
      }
    }
  }

  _lose() {
    if (GameConstant.CHEAT_IMMORTAL) {
      return;
    }

    Game.onLose();
    this.noteSpawner.stop();
    GameStateManager.state = GameState.Lose;
    // this._addBlurBackground();
    SoundManager.stop(this.songName);
    setTimeout(() => {
      this._loadEndCard();
      this.reInit();
    }, GameConstant.GAME_OVER_DELAY * 1000);
  }

  _win(delay = 0) {
    Game.onWin();
    this.noteSpawner.stop();
    SoundManager.stop(this.songName);
    GameStateManager.state = GameState.Win;
    setTimeout(() => {
      this._loadWinCard();
      this.reInit();
    }, delay * 1000);
  }

  reInit() {
    this.noteSpawner.reset();
    this.tileManager.reset();
    this.bgPortrait.displayObject.eventMode = "none";
    this.progress.score = 0;
    this.progress.currStar = 0;
    this.progressBar.unFillAllStars();
    this.playTime = 0;
    this.isTrackPlayed = false;
    this.missedTile.visible = false;
    this.score = 0;
    this.txtScore.displayObject.text = this.score;
    this.removeChild(this.txtScore.displayObject);
    this.removeChild(this.resultText.displayObject);
    this.removeChild(this.bgResultText.displayObject);
  }

  _loadEndCard() {
    this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
    this.endScreen.fillStar();
    this.ui.setScreenActive(GameConstant.SCREEN_TOP_BAR);
  }

  _loadWinCard() {
    this.ui.setScreenActive(GameConstant.SCREEN_WIN);
    this.winScreen.fillStar();
    this.ui.setScreenActive(GameConstant.SCREEN_TOP_BAR);
  }

  _restartGame() {
    this.ui.disableAllScreens();
    this.loadData();
    this.noteSpawner.songData = this.songData;
    GameStateManager.state = GameState.Tutorial;
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
  }

  _onBackHome() {
    this.ui.disableAllScreens();
    GameStateManager.state = GameState.Home;
    let homeScene = SceneManager.getScene(GameConstant.SCENE_HOME);
    SceneManager.load(homeScene);
    SceneManager.unload(this);
  }

  _initTileManager() {
    this.tiles = new Container();
    this.addChild(this.tiles);

    this.tileManager = new TileManager(this.tiles);
  }

  _initNoteSpawner() {
    let noteSpawnerManagerContainer = new Container();
    this.addChild(noteSpawnerManagerContainer);
    this.noteSpawner = noteSpawnerManagerContainer.addScript(new NoteSpawnerManager({
      tileManager  : this.tileManager,
      songData     : this.songData,
      spawnOffset  : GameConstant.SONG_OFFSET,
      spawnOffsetY : GameConstant.SPAWN_OFF_SET_Y,
      gameSpeed    : GameConstant.SPEED,
      songOffset   : GameConstant.SONG_OFFSET,
      noteParent   : this.grid.container,
    }));
    this.noteSpawner.on(NoteSpawnerEvent.TileUp, this._onTilePointerUp, this);
    this.noteSpawner.on(NoteSpawnerEvent.TileDown, this._onTilePointerDown, this);
    this.noteSpawner.on(NoteSpawnerEvent.TileRemove, this._onTileRemove, this);
  }

  _onTilePointerDown(tile, event) {
    if (this.currentNoteIndex < tile.noteIndex) {
      this.currentNoteIndex = tile.noteIndex;
    }

    this._removeFxTouchRevertTweens();
    if (tile.type === TileType.Long) {
      this._playFxTouch(tile, event);
      this._playFxHold(tile);
    }

    this._checkTapResult(tile);
  }

  _onTilePointerUp(tile) {
    if (tile.type === TileType.Long) {
      this._playFxTouchRevertTween(tile);
      this._checkLastTile(tile);
    }
  }

  _onTileRemove(tile) {
    if (tile.type === TileType.Long) {
      this._playFxTouchRevertTween(tile);
      this._addScore(tile.holdScore);
    }
    this._checkLastTile(tile);
  }

  _checkLastTile(tile) {
    if (tile.isLastNote) {
      this._win(GameConstant.GAME_OVER_DELAY);
    }
  }

  _playFxTouch(tile, event) {
    const fxTouch = tile.isSecondNoteOfDoubleNotes ? this.fxTouch2 : this.fxTouch;
    fxTouch.x = tile.x + tile.width / 2;
    if (event) {
      fxTouch.y = event.data.global.y;
    }
    else {
      fxTouch.y = tile.y;
    }

    this.addChild(fxTouch);

    if (fxTouch.revertTween) {
      fxTouch.revertTween.stop();
    }
    fxTouch.tween.stop();
    fxTouch.tween.start();
  }

  _playFxHold(tile) {
    const fxHold = tile.isSecondNoteOfDoubleNotes ? this.fxHold2 : this.fxHold;
    if (fxHold) {
      tile.initFxHold(fxHold, this.fxHoldOffset);
    }
  }

  _playFxTouchRevertTween(tile) {
    const fxTouch = tile.isSecondNoteOfDoubleNotes ? this.fxTouch2 : this.fxTouch;
    if (fxTouch.tween) {
      fxTouch.tween.stop();
    }
    const tween = Tween.createTween(fxTouch.scale, {
      x: 0, y: 0,
    }, {
      duration : 1,
      easing   : Tween.Easing.Quartic.Out,
    });
    tween.start();
    fxTouch.revertTween = tween;
  }

  resize() {
    super.resize();
    this.grid.draw();

    this._rearrangeTiles();
    this._initTapResults();
    this._onResizeFx();
    this.bgResultText.displayObject.scale.set(0.6);
    this.bgResultText.displayObject.rotation += 5.9;
    this.bgResultText.displayObject.alpha = 0.3;
    this.tweenerMove = { x: this.resultText.displayObject.x, alpha: 0.3 };
    let tweenbg = Tween.createTween(this.tweenerMove, { x: this.tweenerMove.x - 50, alpha: 1 }, {
      duration : 1,
      delay    : 0.1,
      onUpdate : () => {
        this.bgResultText.displayObject.x = this.tweenerMove.x;
        this.bgResultText.displayObject.alpha = this.tweenerMove.alpha;
      },
      easing: Tween.Easing.Back.Out,
    });
    this.bgResultText.tween = tweenbg;
  }

  _rearrangeTiles() {
    let playedHeight = this.playTime * GameConstant.SPEED;
    this.tileManager.tiles.forEach((tile) => {
      tile.y += playedHeight + (GameSetting.beatPos.value - this.initializedBeatPos);
    });
  }

  _initMissedTile() {
    this.missedTile = new PIXI.Sprite(PIXI.Texture.from("spr_square_white"));
    this.missedTile.anchor.set(0);
    this.missedTile.tint = 0xff0000;
    this.missedTile.alpha = 0.5;
    this.missedTile.visible = false;
    this.addChild(this.missedTile);
  }

  /**
   * @param {PIXI.Point} mousePos
   * @param {number} tileY
   * @param {number} tileHeight
   */
  _showMissedTile(mousePos, tileY, tileHeight) {
    let columnWidth = this.grid.colWidth;
    for (let i = -1; i <= GameConstant.COLUMN_COUNT; i++) { // run -1 to column count to check out side of grid on landscape
      var colX = this.grid.startPos + i * columnWidth;
      var nextColX = this.grid.startPos + (i + 1) * columnWidth;
      if (mousePos.x >= colX && mousePos.x <= nextColX) {
        this.missedTile.x = colX;
        this.missedTile.y = tileY;
        this.missedTile.width = columnWidth;
        this.missedTile.height = tileHeight;
        this.missedTile.visible = true;
        return;
      }
    }
  }

  _initBackgroundPortrait() {
    let texture = Texture.from("bg");
    this.bgPortrait = new PureSprite(texture, new PureTransform({
      alignment               : Alignment.FULL,
      maintainAspectRatioType : MaintainAspectRatioType.NONE,
    }));
    this.addChild(this.bgPortrait.displayObject);

    Util.registerOnPointerDown(this.bgPortrait.displayObject, this.onTapBackground.bind(this));
    this.bgPortrait.displayObject.eventMode = "dynamic";
  }

  onTapBackground(event) {
    if (GameConstant.AUTO_PLAY) {
      return;
    }
    this._onMiss(event);
  }

  _initGridContainer() {
    this.gridContainer = new Container();
    this.addChild(this.gridContainer);
  }

  _initGrid() {
    this.grid = new Grid();
    this.gridContainer.addChild(this.grid);
  }

  _initGlowLine() {
    const pTransform = new PureTransform({
      container  : this.root,
      pivotX     : 0.5,
      pivotY     : 1,
      anchorX    : 0.5,
      usePercent : true,
      width      : 1,
      y          : GameConstant.BEAT_POS / GameConstant.GAME_HEIGHT,
    });

    this.glowLine = new PureSprite(PIXI.Texture.from("GlowLine"), pTransform);
    // this.addChild(this.glowLine.displayObject);

    let tween = Tween.createTween(this.glowLine.displayObject);
    /*
     * tween.from({
     *   alpha: 0.8,
     * });
     * tween.to({
     *   alpha: 0,
     * });
     * tween.time = 2000;
     * tween.pingPong = true;
     * tween.loop = true;
     */
    tween.start();
    this.glowLine.tween = tween;
  }

  _initFxHold() {
    this.fxHold = AssetSelector.getFxHold();
    this.fxHold2 = AssetSelector.getFxHold();
    this.fxHoldOffset = AssetSelector.getFxHoldOffset();
  }

  _initFxTouch() {
    this.fxTouch = this._createFxTouch();
    this.fxTouch2 = this._createFxTouch();
  }

  _initScoreText() {
    let transform = new PureTransform({
      alignment       : Alignment.TOP_CENTER,
      y               : 120,
      useOriginalSize : true,
    });
    let style = new PIXI.TextStyle({
      fontSize : 70,
      align    : "center",
      fill     : 0xFFFFFF,
    });
    this.txtScore = new PureText("0", transform, style);
    // this.addChild(this.txtScore.displayObject);
  }

  _addScore(amount) {
    this.score += amount;
    this.txtScore.displayObject.text = this.score;

    if (!this.txtScore.displayObject.parent) {
      this.addChild(this.txtScore.displayObject);
    }
  }

  _initResultText() {
    let transformBg = new PureTransform({
      alignment       : Alignment.TOP_CENTER,
      y               : 160,
      useOriginalSize : true,
    });
    this.bgResultText = new PureSprite(PIXI.Texture.from("spr_effect_shape"), transformBg);
    this.bgResultText.displayObject.scale.set(0.6);
    this.bgResultText.displayObject.rotation += 5.9;
    this.bgResultText.displayObject.alpha = 0.3;

    let transform = new PureTransform({
      alignment       : Alignment.TOP_CENTER,
      y               : 250,
      useOriginalSize : true,
    });
    this.resultText = new PureSprite(PIXI.Texture.from("Text_Perfect"), transform);
    this.resultText.displayObject.scale.set(0.2);
    let tween = Tween.createTween(this.resultText.displayObject.scale, {
      x: 1, y: 1,
    }, {
      duration : 0.2,
      easing   : Tween.Easing.Back.Out,
    });

    this.tweenerMove = { x: this.resultText.displayObject.x, alpha: 0.3 };
    let tweenbg = Tween.createTween(this.tweenerMove, { x: this.tweenerMove.x - 50, alpha: 1 }, {
      duration : 1,
      delay    : 0.1,
      onUpdate : () => {
        this.bgResultText.displayObject.x = this.tweenerMove.x;
        this.bgResultText.displayObject.alpha = this.tweenerMove.alpha;
      },
      easing: Tween.Easing.Back.Out,
    });
    this.bgResultText.tween = tweenbg;
    this.resultText.tween = tween;


  }

  _initTapResults() {
    let beatPos = GameSetting.beatPos.value;
    this.tapResults = [
      new TapResult(TapResultType.Perfect, beatPos - 50, beatPos + 100, 5, PIXI.Texture.from("Text_Perfect")),
      new TapResult(TapResultType.Amazing, beatPos - 200, beatPos + 200, 2, PIXI.Texture.from("Text_Great")),
      new TapResult(TapResultType.Cool, 0, GameResizer.height, 1, PIXI.Texture.from("Text_Cool")),
    ];
  }

  _initProgress() {
    this.progress = new Progress();
    this.songDuration = DataManager.getSongDataById(UserData.currentSong).duration;
    this.progress.maxProgressScore = this.songDuration;
    this.progress.numStars = GameConstant.PROGRESS_STARS;

    this.progressBar = new ProgressBar();
    this.addChild(this.progressBar);

    this.progress.on(ProgressEvent.StarEarned, (curStar) => {
      this.progressBar.fillStar();
      this.endScreen.earnStar = curStar;
      this.winScreen.earnStar = curStar;
    });

    this.progress.on(ProgressEvent.ProgressChanged, (progress) => {
      this.progressBar.updateProgress(progress);
    });
  }

  _checkTapResult(tile) {
    for (let i = 0; i < this.tapResults.length; i++) {
      let result = this.tapResults[i];
      if (result.checkInside(tile.y + tile.height)) {
        this._addScore(result.score);
        this._showTapResult(result);
        return;
      }
    }
  }

  _showTapResult(result) {
    this.fxs.forEach((fx) => {
      this.fireworkContainer.removeChild(fx);
      fx.stop();
    });
    this.resultText.displayObject.texture = result.texture;
    this.resultText.tween.start();
    if (result.type === TapResultType.Perfect) {
      this.bgResultText.tween?.stop();
      this.bgResultText.tween.start();
      if (!this.bgResultText.displayObject.parent) {
        this.addChild(this.bgResultText.displayObject);
      }
      this._addFxPerfect(this.resultText.x, this.resultText.y, 0);
    }
    else {
      this.removeChild(this.bgResultText.displayObject);
      this._addFxDefault(this.resultText.x, this.resultText.y, 0);
    }

    if (!this.resultText.displayObject.parent) {
      this.addChild(this.resultText.displayObject);
    }

  }

  _createFxTouch() {
    const fx = new PIXI.Sprite(PIXI.Texture.from("Effect_Inner"));
    fx.anchor.set(0.5);

    const tween = Tween.createTween({
      scale : { x: 1, y: 1 },
      alpha : 0.5,
    }, {
      scale : { x: 2, y: 2 },
      alpha : 1,
    }, {
      duration : 1,
      easing   : Tween.Easing.Quartic.Out,
      onUpdate : (obj) => {
        fx.scale.set(obj.scale.x, obj.scale.y);
        fx.alpha = obj.alpha;
      },
    });
    fx.tween = tween;
    return fx;
  }

  _removeFxTouchRevertTweens() {
    if (this.fxTouch && this.fxTouch.revertTween) {
      this.fxTouch.revertTween.stop();
      this.fxTouch.scale.set(0);
    }

    if (this.fxTouch2 && this.fxTouch2.revertTween) {
      this.fxTouch.revertTween.stop();
      this.fxTouch2.scale.set(0);
    }
  }

  _addBlurBackground() {
    let bgBlur = new PureRect(new PureTransform({ alignment: Alignment.FULL }));
    bgBlur.fill(this, 0x000000, 0.5);
    bgBlur.graphics.eventMode = "dynamic";
  }

  get currentNoteIndex() {
    return this._currentNoteIndex || 0;
  }

  set currentNoteIndex(value) {
    this._currentNoteIndex = value;
    if (this.currentNoteIndex !== 0
      && this.currentNoteIndex !== this.totalTiles - 1
      && this.currentNoteIndex % Math.floor(this.totalTiles / 10) === 0
    ) {
      Game.onOneLevelPassed();
    }

    if (this.currentNoteIndex === Math.floor(this.totalTiles / 2)) {
      Game.onMidwayProgress();
    }
  }
}
