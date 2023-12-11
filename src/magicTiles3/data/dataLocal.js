import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Debug } from "../../helpers/debug";
import { DataManager } from "./dataManager";
import { UserData } from "./userData";

export const DataLocalEvent = Object.freeze({
  Initialize: "initialized",
});

export const DataLocalState = Object.freeze({
  Loaded   : "loaded",
  Loading  : "loading",
  Unloaded : "unloaded",
});

export class DataLocal {
  static init() {
    if (!window.indexedDB) {
      Debug.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      return;
    }
    this.state = DataLocalState.Unloaded;
    this.dbName = GameConstant.INDEXEDDB_NAME;
    this.dbVersion = GameConstant.INDEXEDDB_VERSION;
    this.db = null;
    this.totalLoad = 0;
    this.totalData = 5;
    var request = window.indexedDB.open(this.dbName, this.dbVersion);
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains(GameConstant.INDEXEDDB_STORE_NAME)) {
        this.db.createObjectStore(GameConstant.INDEXEDDB_STORE_NAME);
      }
    };
    this.state = DataLocalState.Loading;
    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.getCurrency();
      this.getCurrentLevel();
      this.getListSongUnlock();
      this.getInventoryUserData();
      this.getCurrentSkin();
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static checkLoad() {
    this.totalLoad++;
    if (this.totalLoad >= this.totalData) {
      this.state = DataLocalState.Loaded;
      DataManager.init();
      // Game.emit(DataLocalEvent.Initialize);
    }
  }

  static getCurrentLevel() {
    this.getData(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.currentSong = null;
        this.addData(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY, this.currentSong);
      }
      else {
        this.currentSong = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getListSongUnlock() {
    this.getData(GameConstant.INDEXEDDB_LIST_SONG_UNLOCK_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.listSongUnlock = [];
        this.addData(GameConstant.INDEXEDDB_LIST_SONG_UNLOCK_KEY, this.listSongUnlock);
      }
      else {
        this.listSongUnlock = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getInventoryUserData() {
    this.getData(GameConstant.INDEXEDDB_INVENTORY_USER_DATA).then((value) => {
      if (typeof (value) === "undefined") {
        this.inventoryUserData = [GameConstant.PLAYER_DEFAULT_SKIN];
        this.addData(GameConstant.INDEXEDDB_INVENTORY_USER_DATA, this.inventoryUserData);
      }
      else {
        this.inventoryUserData = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getCurrentSkin() {
    this.getData(GameConstant.INDEXEDDB_CURRENT_SKIN).then((value) => {
      if (typeof (value) === "undefined") {
        this.currentSkin = GameConstant.PLAYER_DEFAULT_SKIN;
        this.addData(GameConstant.INDEXEDDB_CURRENT_SKIN, this.currentSkin);
      }
      else {
        this.currentSkin = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getCurrency() {
    this.getData(GameConstant.INDEXEDDB_CURRENCY_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.currency = GameConstant.PLAYER_DEFAULT_CURRENCY;
        this.addData(GameConstant.INDEXEDDB_CURRENCY_KEY, this.currency);
      }
      else {
        this.currency = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static addData(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.add(value, key);
    request.onsuccess = () => {
      Debug.log("add success");
    };
    request.onerror = (err) => {
      Debug.error("add error", err);
    };
  }

  static getData(key) {
    return new Promise((resolve, reject) => {
      const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
      let request = userData.get(key);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  static updateCurrentSongData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      this.currentSong = data;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
      UserData.currentSong = data;
      requestUpdate.onsuccess = () => {
        Debug.log("update success");
      };
      requestUpdate.onerror = (err) => {
        Debug.error("update error", err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateListSongUnlockData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_LIST_SONG_UNLOCK_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_LIST_SONG_UNLOCK_KEY);
      requestUpdate.onsuccess = () => {
        UserData.listSongUnlock = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_LIST_SONG_UNLOCK_KEY } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_LIST_SONG_UNLOCK_KEY } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateCurrencyData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CURRENCY_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CURRENCY_KEY);
      requestUpdate.onsuccess = () => {
        UserData.currency = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_CURRENCY_KEY } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_CURRENCY_KEY } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateCurrentSkinData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CURRENT_SKIN);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CURRENT_SKIN);
      requestUpdate.onsuccess = () => {
        UserData.currentSkin = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_CURRENT_SKIN } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_CURRENT_SKIN } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateInventoryUserData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_INVENTORY_USER_DATA);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_INVENTORY_USER_DATA);
      requestUpdate.onsuccess = () => {
        UserData.inventoryData = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_INVENTORY_USER_DATA } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_INVENTORY_USER_DATA } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateDataByKey(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(key);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = parseFloat(value.toFixed(1));
      var requestUpdate = userData.put(data, key);
      requestUpdate.onsuccess = () => {
        Debug.log(`update ${ key } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ key } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }
}
