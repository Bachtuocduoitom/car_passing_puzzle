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
    this.totalData = 3;
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
      this.getCurrentLevel();
      this.getListLevelUnlock();
      this.getListLevelStar();

      // this.getListSongUnlock();
      // this.getInventoryUserData();
      // this.getCurrentSkin();
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
        this.currentLevel = GameConstant.PLAYER_DEFAULT_LEVEL;
        this.addData(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY, this.currentLevel);
      }
      else {
        this.currentLevel = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getListLevelUnlock() {
    this.getData(GameConstant.INDEXEDDB_LIST_LEVEL_UNLOCK_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.listLevelUnlock = GameConstant.PLAYER_DEFAULT_LEVEL_UNLOCK;
        this.addData(GameConstant.INDEXEDDB_LIST_LEVEL_UNLOCK_KEY, this.listLevelUnlock);
      }
      else {
        this.listLevelUnlock = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getListLevelStar() {
    this.getData(GameConstant.INDEXEDDB_LIST_LEVEL_STAR_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.listLevelStar = GameConstant.PLAYER_DEFAULT_LEVEL_STAR;
        this.addData(GameConstant.INDEXEDDB_LIST_LEVEL_STAR_KEY, this.listLevelStar);
      }
      else {
        this.listLevelStar = value;
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

  static updateCurrentLevelData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      this.currentLevel = data;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
      UserData.currentLevel = data;
      requestUpdate.onsuccess = () => {
        Debug.log("update level success");
      };
      requestUpdate.onerror = (err) => {
        Debug.error("update error", err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateListLevelUnlockData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_LIST_LEVEL_UNLOCK_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_LIST_LEVEL_UNLOCK_KEY);
      requestUpdate.onsuccess = () => {
        UserData.listLevelUnlock = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_LIST_LEVEL_UNLOCK_KEY } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_LIST_LEVEL_UNLOCK_KEY } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateListLevelStarData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_LIST_LEVEL_STAR_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_LIST_LEVEL_STAR_KEY);
      requestUpdate.onsuccess = () => {
        UserData.listLevelStar = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_LIST_LEVEL_STAR_KEY } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_LIST_LEVEL_STAR_KEY } error`, err);
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
