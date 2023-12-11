export const ProgressEvent = Object.freeze({
  ScoreChanged    : "progress:scorechanged",
  ProgressChanged : "progress:progresschanged",
  StarEarned      : "progress:starEarned",
});

export class Progress extends PIXI.utils.EventEmitter {
  constructor() {
    super();
    this._score = 0;
    this._progress = 0;
    this.maxProgressScore = 0;
    this.numStars = 0;
    this.currStar = 0;
  }

  _onScoreChanged() {
    this.emit(ProgressEvent.ScoreChanged, this._score);

    this._progress = this.score / this.maxProgressScore;
    this.emit(ProgressEvent.ProgressChanged, this._progress);

    if (Math.floor(this.numStars * this._progress) > this.currStar) {
      this.currStar++;
      this.emit(ProgressEvent.StarEarned, this.currStar);
    }
  }

  get progress() {
    return this._progress;
  }

  get score() {
    return this._score;
  }

  set score(score) {
    this._score = score;
    this._onScoreChanged();
  }
}
