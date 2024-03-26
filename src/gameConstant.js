export const GameConstant = Object.freeze({
  DEBUG_ON                : true,
  DEBUG_FILL_RECTS        : false,
  DEBUG_DRAW_COLLIDER     : false,
  AUTO_PLAY               : false,
  CHEAT_IMMORTAL          : false,
  SKIP_TUTORIAL           : false,
  CHEAT_ONE_NOTE          : false,
  GAME_WIDTH              : 720,
  GAME_HEIGHT             : 1280,
  BG_COLOR                : 0x63c5da,
  GAME_LIFE               : 1,
  SOUND_ENABLED           : true,
  SHOW_BUTTON_SOUND       : false,
  SHOW_GAME_TAG           : false,
  TEXTURE_GAME_TAG        : "spr_game_title",

  ORIENTATION_PORTRAIT   : "portrait",
  ORIENTATION_LANDSCAPES : "landscapes",

  PLATFORM_ANDROID : "Android",
  PLATFORM_IOS     : "iOS",

  SCENE_TUTORIAL    : "Tutorial",
  SCENE_PLAY        : "Play",
  SCENE_PAUSE       : "Pause",
  SCENE_END         : "End",
  SCENE_SELECT_SONG : "SelectSong",
  SCENE_SNOW        : "Snow",
  SCENE_LOADING     : "Loading",
  SCENE_HOME        : "Home",

  SCREEN_HOME           : "HomeScreen",
  SCREEN_CHOOSE_LEVEL   : "ChooseLevelsScreen",
  SCREEN_LOADING        : "LoadingScreen",
  SCREEN_PLAY           : "PlayScreen",
  SCREEN_TUTORIAL       : "TutorialScreen",
  SCREEN_LOSE           : "LoseScreen",
  SCREEN_WIN            : "WinScreen",
  SCREEN_TOP_BAR        : "TopBarScreen",
  SCREEN_QUESTION       : "QuestionScreen",

  OBSTACLE_LAYER       : "Obstacle Layer",
  PLAYER_LAYER         : "Player Layer",

  DIRECTION_SIGN_SIZE : 32,
  DIRECTION_SIGN_BAR_WIDTH  : 682,
  DIRECTION_SIGN_BAR_HEIGHT : 150,

  DIRECTION_SIGN_ITEM_SIZE : 100,

  TILE_SIZE : 32, 

  PROGRESS_STARS       : 3,
  GRID_LANDSCAPE_SCALE : 1,
  AUTOPLAY_TOUCH_MIN   : -50,
  AUTOPLAY_TOUCH_MAX   : 50,

  EXPLOSION_ANIMATION_SPEED : 0.2,

  COLUMN_COUNT       : 4,
  BEAT_POS           : 1300,
  SPEED              : 1700,
  SKIP_HOLD_DURATION : 0.3,
  DOUBLE_NOTE_RANGE  : 0.005,
  GAME_OVER_DELAY    : 1,
  TILE_HEIGHT_MAX    : Infinity,
  GAME_LIST_SPEED    : 100,
  GAME_LIST_SPACING  : 40,
  GAME_ICON_RADIUS   : 16,
  SONG_OFFSET        : 0,
  SONG_DURATION      : 26,
  MISS_REVERT_TIME   : 1,
  MUSIC_OFFSET       : 1,

  NOTE_HEIGHT     : 400,
  GAME_SPEED_STEP : 250,

  INDEXEDDB_NAME                  : "car-passing",
  INDEXEDDB_VERSION               : 2,
  INDEXEDDB_STORE_NAME            : "userData",
  INDEXEDDB_CURRENT_LEVEL_KEY     : "currentLevel",
  INDEXEDDB_LIST_LEVEL_UNLOCK_KEY : "unlocks",
  INDEXEDDB_LIST_LEVEL_STAR_KEY   : "stars",
  PLAYER_DEFAULT_LEVEL            : "level 1-1",
  PLAYER_DEFAULT_LEVEL_UNLOCK     : ["level 1-1"],
  PLAYER_DEFAULT_LEVEL_STAR       : [0],
});
