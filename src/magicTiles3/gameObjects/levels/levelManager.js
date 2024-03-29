import { Container } from "pixi.js";
import { Game } from "../../../game";
import { Time } from "../../../systems/time/time";
import { LevelEvent } from "./levelEvent";
import { DirectionSignSpawner } from "../directionSigns/directionSignSpawner";

export class LevelManager extends Container {
  constructor() {
    super();
    /** @type {Array<Level>} */
    this.levels = [];
    Game.app.ticker.add(this.update, this);
  }

  start() {
    // this._checkNextLevel();
    this.startLevel(this.currentLevel);
  }

  _checkNextLevel() {
    this.currentLevel = this.levels[this.currentLevelIndex];
    if (this.currentLevel && this.currentLevel.autoStart) {
      this.startLevel(this.currentLevel);
    }
  }

  startNextLevel() {
    this.currentLevel = this.levels[this.currentLevelIndex];
    if (this.currentLevel) {
      this.startLevel(this.currentLevel);
    }
  }

  startLevel(level) {
    level.visible = true;
    level.on(LevelEvent.Complete, this._onLevelComplete, this);
    level.start();
  }

  startLevelPlay() {
    this.currentLevel.startPlay();
  }

  resetLevelPlay() {
    this.currentLevel.reset();
  }

  destroyLevelPlay() {
    this.currentLevel.destroySelf();
    this.removeChild(this.currentLevel);
    this.currentLevel = null;
  }

  afterTrueAnswer() {
    this.currentLevel.handleTrueAnswer();
  }

  afterFalseAnswer() {
    this.currentLevel.handleFalseAnswer();
  }

  _onLevelComplete() {
    Game.onOneLevelPassed();
    if (this.currentLevelIndex + 1 === this.levels.length / 2) {
      Game.onMidwayProgress();
    }

    if (this.currentLevelIndex >= this.levels.length - 1) {
      this.emit(LevelEvent.Complete);
    }
    else {
      this.currentLevelIndex++;
      this._checkNextLevel();
    }
  }


  update() {
    this.currentLevel?.update(Time.dt);
  }

  pause() {
    this.currentLevel?.pause();
  }

  resume() {
    this.currentLevel?.resume();
  }

  addLevel(level) {
    level.visible = false; //hide level
    this.currentLevel = level;
    this.addChild(level);
    this.levels.push(level);
  }

  get currentLevelIndex() {
    return this._currentLevelIndex || 0;
  }

  set currentLevelIndex(value) {
    this._currentLevelIndex = value;
  }
}
