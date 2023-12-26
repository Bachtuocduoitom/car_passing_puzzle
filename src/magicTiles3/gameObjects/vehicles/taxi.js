import { AssetSelector } from "../../assetSelector";
import { vehicleBase } from "./vehicleBase";

export class Taxi extends vehicleBase {
  constructor() {
    super(AssetSelector.getVehicleRunTextures());
    this._config();
  }

  _config() {
    super._config();
    this.collider.width = this.texture.width/2;
    this.collider.height = this.texture.height/3;
  }
}