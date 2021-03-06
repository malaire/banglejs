# BLE Clock Sync

Syncs clock via Bluetooth LE.

This widget receives current time from [my broadcaster]
and reports clock error to `widadjust` widget
which then adjusts clock according to its settings.

## Settings

- **Scan Interval** - How often to scan for Bluetooth LE broadcast.
- **Scan Count Min** / **Scan Count Max** -
  When scanning for Bluetooth LE broadcast,
  how many results are needed for scan to be successful.
  With smaller values scanning succeeds more often, especially with Bangle.js 1,
  but larger values offer more accuracy as result is average of all values.
- **Debug Log** - Where to log debug messages.
    - `Off`: No debug logging.
    - `Console`: Log to console.
    - `File`: Log to file `widblesync.log`.
      This file is not deleted if widget is removed.
    - `Both`: Log to console and file.

## Display

Widget shows the last time clock sync succeeded or `--:--` if never.

Text is shown in red if latest clock sync failed.

## GitHub

Main repository for this widget is [malaire/banglejs](https://github.com/malaire/banglejs).

Please report any issues or feature requests there.

[my broadcaster]: https://github.com/malaire/banglejs/tree/main/broadcaster
