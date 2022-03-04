(() => {
  // ======================================================================
  // CONST

  const SETTINGS_FILE = 'widblesync.json';

  // Interval between scan sequences, in milliseconds.
  const DEFAULT_SCAN_INTERVAL = 600000;
  const MIN_SCAN_INTERVAL     = 60000;

  // How long to scan for time broadcast, in milliseconds.
  const SCAN_TIMEOUT = 3 * 1000;

  // Number of successful scans in scan sequence.
  const SCAN_COUNT = 10;

  const SERVICE_UUID = '56A9BAE4-DE7E-490B-AEE3-C87326C10C66';

  // Widget width.
  const WIDTH = 16;

  // ======================================================================
  // VARIABLES

  let settings;

  let clockError = 0;

  // Clock delta count/max/sum of current/previous scan sequence.
  let deltaCount;
  let deltaMax;
  let deltaSum;

  let failCount = null;

  // ======================================================================
  // FUNCTIONS

  function draw() {
    g.reset().setFont('6x8').setFontAlign(0, 0);
    g.clearRect(this.x, this.y, this.x + WIDTH - 1, this.y + 23);

    if (failCount === null) {
      g.drawString('-', this.x + WIDTH/2, this.y + 12);
    } else if (failCount === 0) {
      g.setColor('#00F');
      g.drawString('OK', this.x + WIDTH/2, this.y + 12);
    } else {
      g.setColor('#F00');
      g.drawString(failCount, this.x + WIDTH/2, this.y + 12);
    }
  }

  function beginScanSequence() {
    deltaCount = 0;
    deltaMax = undefined;
    deltaSum = 0;
    scan();
  }

  function scan() {
    NRF.requestDevice({
      filters: [{ services: [ SERVICE_UUID ] }],
      timeout: SCAN_TIMEOUT
    }).then(device => {
      let now = Date.now();
      let delta = now - getReceivedTime(device);

      if (deltaCount == 0 || delta > deltaMax) {
        deltaMax = delta;
      }
      deltaCount++;
      deltaSum += delta;

      if (deltaCount == SCAN_COUNT) {
        clockError = (deltaSum - deltaMax) / (deltaCount - 1);
        failCount = 0;
        if (WIDGETS.adjust) {
          WIDGETS.adjust.setClockError(clockError);
        } else if (Math.abs(clockError) >= SET_TIME_THRESHOLD) {
          setTime((Date.now() - clockError) / 1000);
          clockError = 0;
        }
        WIDGETS.blesync.draw();
      } else {
        setTimeout(scan, 900);
      }
    }).catch(() => {
      failCount++;
      WIDGETS.blesync.draw();
    });
  }

  function getReceivedTime(device) {
      let receivedTime = 0;
      for (n = 0; n < 8; n++) {
        receivedTime *= 256;
        receivedTime += device.manufacturerData[n];
      }
      receivedTime /= 1000;

      // Tweak received time a bit to account for delays in broadcast.
      // - This value has been determined manually.
      receivedTime += 20;

      return receivedTime;
  }

  function loadSettings() {
    settings = Object.assign({
      scanInterval: DEFAULT_SCAN_INTERVAL,
    }, require('Storage').readJSON(SETTINGS_FILE, true) || {});

    settings.scanInterval = Math.max(settings.scanInterval, MIN_SCAN_INTERVAL);
  }

  // ======================================================================
  // MAIN

  loadSettings();

  WIDGETS.blesync = {
    area: 'tr',
    draw: draw,
    width: WIDTH,
  };

  beginScanSequence();
  setInterval(beginScanSequence, SCAN_SEQUENCE_INTERVAL);
})()
