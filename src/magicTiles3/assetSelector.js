import songData from "../../assets/jsons/songData.json";
import { Tween } from "../systems/tween/tween";
export class AssetSelector {

  /**
   * @returns {Theme} theme
   */
  static get theme() {
    return this.currentTheme ? this.currentTheme : Theme.Theme_3;
  }

  /**
   * @param {Theme} theme
   */
  static set theme(theme) {
    this.currentTheme = theme;
  }

  static getBgTexture() {
    return PIXI.Texture.from("Theme1_Background");
  }

  static getTileShortTexture() {
    return PIXI.Texture.from("Theme1_Tile_Short");
  }

  static getSongName() {
    return this.selectThemeAsset([
      "song_1",
      "song_2",
      "song_3",
    ])
  }

  static getTrackingSongName() {
    return this.selectThemeAsset([
      "how-you-like-that",
      "astronomia",
      "2-phut-hon"
    ]);
  }

  static getSongData() {
    return songData;
  }

  static getTileShortColor() {
    return 0xFFFFFF;
  }

  static getTileShortCorners() {
    return { left: 0, top: 0, right: 0, bottom: 0 };
  }

  /**
   * @returns {particles.Emitter}
   */
  static getTileShortTouchedParticle() {
    return null;
  }

  /**
   * @returns {PIXI.Sprite}
   */
  static getTileShortTouchedEffect() {
    return null;
  }

  /**
   * @returns {number}
   */
  static getTileTouchedAlpha() {
    return 0.3;
  }

  static getTileLongTexture() {
    return PIXI.Texture.from("Theme1_Tile_Long");
  }

  static getTileLongColor() {
    return 0xffffff;
  }

  static getTileLongScoreColor() {
    return 0xffffff;
  }

  static getTileHoldTexture() {
    return PIXI.Texture.from("Theme1_Tile_Hold");
  }

  static getTileTouchedTexture() {
    return null;
  }

  static getTileLongMiddleTexture() {
    return PIXI.Texture.from("Theme1_Tile_Long_Middle");
  }

  static getTileLongMiddleAlpha() {
    return 1;
  }

  static getTileLongCorners() {
    return { left: 0, top: 25, right: 0, bottom: 52 };
  }

  static getTileHoldCorners() {
    return { left: 0, top: 140, right: 0, bottom: 0 };
  }

  static getTileLongMiddleCorners() {
    return { left: 0, top: 0, right: 0, bottom: 50 };
  }

  static getEggTopTexture() {
    return this.selectThemeTexture([
      "spr_egg_top_1",
      "spr_egg_top_2",
      "spr_egg_top_3",
    ])
  }

  static getEggBottomTexture() {
    return this.selectThemeTexture([
      "spr_egg_bottom_1",
      "spr_egg_bottom_2",
      "spr_egg_bottom_3",
    ])
  }

  static getSongNameTexture() {
    return this.selectThemeTexture([
      "spr_song_name_1",
      "spr_song_name_2",
      "spr_song_name_3",
    ])
  }

  static get isTileMiddleBelowHold() {
    return true;
  }

  /**
   * @returns {PIXI.Container}
   */
  static getFxHold() {
    return this.getFxHold_Theme1();
  }

  static getFxHoldOffset() {
    return 5;
  }

  static getFxHold_Theme1() {
    let circle1 = new PIXI.Sprite(PIXI.Texture.from("Effect_Hold"));
    circle1.anchor.set(0.5);
    let tween1 = Tween.createTween(circle1);
    // tween1.from({
    //   scale: { x: 0.3, y: 0.3 }
    // });
    // tween1.to({
    //   scale: { x: 0.6, y: 0.6 }
    // });
    // tween1.time = 500;
    // tween1.loop = true;
    circle1.tween = tween1;

    let circle2 = new PIXI.Sprite(PIXI.Texture.from("Effect_Hold"));
    circle2.anchor.set(0.5);
    let tween2 = Tween.createTween(circle2);
    // tween2.from({
    //   scale: { x: 0, y: 0 }
    // });
    // tween2.to({
    //   scale: { x: 0.8, y: 0.8 }
    // });
    // tween2.time = 1000;
    // tween2.loop = true;
    circle2.tween = tween2;

    let holdTween = new PIXI.Container();
    holdTween.addChild(circle1);
    holdTween.addChild(circle2);
    return holdTween;
  }

  static getTileShortTouchedParticle_Theme3() {
    let particle = new PIXI.ParticleContainer();
    return new particles.Emitter(
      particle,
      [PIXI.Texture.from("Effect_Note")],
      {
        "alpha": {
          "start": 0.7,
          "end": 1
        },
        "scale": {
          "start": 1,
          "end": 0.01,
          "minimumScaleMultiplier": 1
        },
        "color": {
          "start": "#ffffff",
          "end": "#ffffff"
        },
        "speed": {
          "start": 300,
          "end": 30,
          "minimumSpeedMultiplier": 1.5
        },
        "acceleration": {
          "x": 0,
          "y": 0
        },
        "maxSpeed": 0,
        "startRotation": {
          "min": 0,
          "max": 360
        },
        "noRotation": true,
        "rotationSpeed": {
          "min": 0,
          "max": 0
        },
        "lifetime": {
          "min": 0.5,
          "max": 0.7
        },
        "blendMode": "normal",
        "frequency": 0.01,
        "emitterLifetime": 0.3,
        "maxParticles": 10,
        "pos": {
          "x": 0,
          "y": 0
        },
        "addAtBack": false,
        "spawnType": "circle",
        "spawnCircle": {
          "x": 0,
          "y": 0,
          "r": 0
        }
      }
    );
  }

  static getTileShortTouchedEffect_Theme3(isPortrait) {
    let effect = new PIXI.Sprite(PIXI.Texture.from("Theme3_Tile_Short_Effect"));
    effect.anchor.set(0.5);
    let tween = PIXI.tweenManager.createTween(effect);
    let startScale = isPortrait ? { x: 0.8, y: 0.7 } : { x: 1.5, y: 0.8 };
    let endScale = isPortrait ? { x: 1.2, y: 1.1 } : { x: 1.9, y: 1.2 };
    tween.from({
      scale: startScale,
      alpha: 1,
    });
    tween.to({
      scale: endScale,
      alpha: 0.8,
    });
    // Hide effect on tween complete
    tween.on("end", () => {
      effect.alpha = 0;
    })
    tween.time = 400;
    effect.tween = tween;
    return effect;
  }

  /**
   * @param {Array} assets 
   */
  static selectThemeAsset(assets) {
    return assets[this.theme];
  }

  static selectThemeTexture(names) {
    this.temp = this.selectThemeAsset(names);
    if (this.temp) {
      return PIXI.Texture.from(this.temp);
    }
    return null;
  }
}

export const Theme = {
  Theme_1: 0,
  Theme_2: 1,
  Theme_3: 2,
}