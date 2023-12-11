export class TapResult {
  /**
   * @class TapResult 
   * @param {number} type ResultType 
   * @param {number} rangeMin Min position Y for checking 
   * @param {number} rangeMax Max position Y for checking 
   * @param {number} score score 
   * @param {PIXI.Texture} texture
   */
  constructor(type, rangeMin, rangeMax, score, texture) {
    this.type = type;
    this.rangeMin = rangeMin;
    this.rangeMax = rangeMax;
    this.score = score;
    this.texture = texture;
  }

  /**
   * @summary Check if Y position inside rangeMin and rangeMax
   * @param {number} y Position Y
   */
  checkInside(y) {
    return y >= this.rangeMin && y <= this.rangeMax;
  }
}

export const TapResultType = Object.freeze({
  Perfect: 0,
  Amazing: 1,
  Cool: 2,
});