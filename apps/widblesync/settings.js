(function(back) {
  const SETTINGS_FILE = 'widblesync.json';

  const DEFAULT_SCAN_INTERVAL = 600000;
  let intervalV = [  60000, 180000, 600000, 1800000, 3600000, 10800000 ];
  let intervalN = [  "1 m",  "3 m", "10 m",  "30 m",   "1 h",    "3 h" ];

  let debugLogN = [ "Off", "Console", "File", "Both" ];

  let settings = Object.assign({
    scanInterval: DEFAULT_SCAN_INTERVAL,
    scanCountMin: 10,
    scanCountMax: 10,
    debugLog: 0,
  }, require('Storage').readJSON(SETTINGS_FILE, true) || {});

  if (intervalV.indexOf(settings.scanInterval) == -1) {
    settings.scanInterval = DEFAULT_SCAN_INTERVAL;
  }

  let mainMenu = {
    '': { 'title' : 'BLE Clock Sync' },

    '< Back': () => {
      require('Storage').writeJSON(SETTINGS_FILE, settings);
      back();
    },

    'Scan Interval': {
      value: intervalV.indexOf(settings.scanInterval),
      min: 0,
      max: intervalV.length - 1,
      format: v => intervalN[v],
      onchange: v => {
        settings.scanInterval = intervalV[v];
      },
    },

    'Scan Count Min': {
      value: E.clip(0|settings.scanCountMin, 1, 10),
      min: 1,
      max: 10,
      onchange: v => {
        settings.scanCountMin = v;
        mainMenu['Scan Count Max'].value =
          Math.max(mainMenu['Scan Count Max'].value, v);
      },
    },

    'Scan Count Max': {
      value: E.clip(0|settings.scanCountMax, 1, 10),
      min: 1,
      max: 10,
      onchange: v => {
        settings.scanCountMax = v;
        mainMenu['Scan Count Min'].value =
          Math.min(mainMenu['Scan Count Min'].value, v);
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
  };

  E.showMenu(mainMenu);
})
