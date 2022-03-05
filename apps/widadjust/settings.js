(function(back) {
  const SETTINGS_FILE = 'widadjust.json';
  const STATE_FILE = 'widadjust.state';

  const BIT_DEBUG_LOG_CONSOLE = 1;
  const BIT_DEBUG_LOG_FILE    = 2;
  let debugLogN = [ "Off", "Console", "File", "Both" ];

  const DEFAULT_ADJUST_THRESHOLD = 100;
  let thresholdV = [ 10, 25, 50, 100, 250, 500, 1000 ];

  const DEFAULT_UPDATE_INTERVAL = 60000;
  let intervalV = [  10000,  30000, 60000, 180000, 600000, 1800000, 3600000 ];
  let intervalN = [ "10 s", "30 s", "1 m",  "3 m", "10 m",  "30 m",   "1 h" ];

  let stateFileErased = false;

  let settings = Object.assign({
    advanced: false,
    saveState: true,
    debugLog: 0,
    ppm: 0,
    ppmA: 0,
    ppmB: 0,
    ppmC: 0,
    adjustThreshold: DEFAULT_ADJUST_THRESHOLD,
    updateInterval: DEFAULT_UPDATE_INTERVAL,
  }, require('Storage').readJSON(SETTINGS_FILE, true) || {});

  // convert from boolean used in v0.01
  if (settings.debugLog === false) {
    settings.debugLog = BIT_DEBUG_LOG_CONSOLE;
  } else if (settings.debugLog === true) {
    settings.debugLog = BIT_DEBUG_LOG_CONSOLE | BIT_DEBUG_LOG_FILE;
  }

  if (thresholdV.indexOf(settings.adjustThreshold) == -1) {
    settings.adjustThreshold = DEFAULT_ADJUST_THRESHOLD;
  }

  if (intervalV.indexOf(settings.updateInterval) == -1) {
    settings.updateInterval = DEFAULT_UPDATE_INTERVAL;
  }

  function onPpmChange(v) {
    settings.ppm = v;
    mainMenu['PPM x 10' ].value = v;
    mainMenu['PPM x 1'  ].value = v;
    mainMenu['PPM x 0.1'].value = v;
  }

  let mainMenu = {
    '': { 'title' : 'Adjust Clock' },

    '< Back': () => {
      require('Storage').writeJSON(SETTINGS_FILE, settings);
      back();
    },

    'PPM x 10' : {
      value: settings.ppm,
      format: v => v.toFixed(1),
      step: 10,
      onchange : onPpmChange,
    },

    'PPM x 1' : {
      value: settings.ppm,
      format: v => v.toFixed(1),
      step: 1,
      onchange : onPpmChange,
    },

    'PPM x 0.1' : {
      value: settings.ppm,
      format: v => v.toFixed(1),
      step: 0.1,
      onchange : onPpmChange,
    },

    'Update Interval': {
      value: intervalV.indexOf(settings.updateInterval),
      min: 0,
      max: intervalV.length - 1,
      format: v => intervalN[v],
      onchange: v => {
        settings.updateInterval = intervalV[v];
      },
    },

    'Threshold': {
      value: thresholdV.indexOf(settings.adjustThreshold),
      min: 0,
      max: thresholdV.length - 1,
      format: v => thresholdV[v] + " ms",
      onchange: v => {
        settings.adjustThreshold = thresholdV[v];
      },
    },

    'Save State': {
      value: settings.saveState,
      format: v => v ? 'On' : 'Off',
      onchange: () => {
        settings.saveState = !settings.saveState;
        if (!settings.saveState && !stateFileErased) {
          stateFileErased = true;
          require("Storage").erase(STATE_FILE);
        }
      },
    },

    'Debug Log': {
      value: E.clip(0|settings.debugLog, 0, 3),
      min: 0,
      max: 3,
      format: v => debugLogN[v],
      onchange: v => {
        settings.debugLog = v;
      },
    },

    'Mode': {
      value: settings.advanced,
      format: v => v ? 'Advanced' : 'Basic',
      onchange: () => {
        settings.advanced = !settings.advanced;
      }
    },

    'Advanced PPM': () => { E.showMenu(advancedMenu) },
  };

  function onPpmAChange(v) {
    settings.ppmA = v;
    advancedMenu['A 0.01'  ].value = v;
    advancedMenu['A 0.001' ].value = v;
    advancedMenu['A 0.0001'].value = v;
  }

  function onPpmBChange(v) {
    settings.ppmB = v;
    advancedMenu['B 1'   ].value = v;
    advancedMenu['B 0.1' ].value = v;
    advancedMenu['B 0.01'].value = v;
  }

  function onPpmCChange(v) {
    settings.ppmC = v;
    advancedMenu['C 10' ].value = v;
    advancedMenu['C 1'  ].value = v;
    advancedMenu['C 0.1'].value = v;
  }

  let advancedMenu = {
    '': { 'title' : 'Advanced PPM' },
    '< Back' : () => { E.showMenu(mainMenu); },

    'A 0.01' : {
      value: settings.ppmA,
      format: v => v.toFixed(4),
      step: 0.01,
      onchange : onPpmAChange,
    },

    'A 0.001' : {
      value: settings.ppmA,
      format: v => v.toFixed(4),
      step: 0.001,
      onchange : onPpmAChange,
    },

    'A 0.0001' : {
      value: settings.ppmA,
      format: v => v.toFixed(4),
      step: 0.0001,
      onchange : onPpmAChange,
    },

    'B 1' : {
      value: settings.ppmB,
      format: v => v.toFixed(2),
      step: 1,
      onchange : onPpmBChange,
    },

    'B 0.1' : {
      value: settings.ppmB,
      format: v => v.toFixed(2),
      step: 0.1,
      onchange : onPpmBChange,
    },

    'B 0.01' : {
      value: settings.ppmB,
      format: v => v.toFixed(2),
      step: 0.01,
      onchange : onPpmBChange,
    },

    'C 10' : {
      value: settings.ppmC,
      format: v => v.toFixed(1),
      step: 10,
      onchange : onPpmCChange,
    },

    'C 1' : {
      value: settings.ppmC,
      format: v => v.toFixed(1),
      step: 1,
      onchange : onPpmCChange,
    },

    'C 0.1' : {
      value: settings.ppmC,
      format: v => v.toFixed(1),
      step: 0.1,
      onchange : onPpmCChange,
    },
  };

  E.showMenu(mainMenu);
})
