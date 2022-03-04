(function(back) {
  const SETTINGS_FILE = 'widblesync.json';

  const DEFAULT_SCAN_INTERVAL = 600000;
  let intervalV = [  60000, 180000, 600000, 1800000, 3600000, 10800000 ];
  let intervalN = [  "1 m",  "3 m", "10 m",  "30 m",   "1 h",    "3 h" ];

  let settings = Object.assign({
    scanInterval: DEFAULT_SCAN_INTERVAL,
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
  };

  E.showMenu(mainMenu);
})
