# Adjust Clock

Adjusts clock continually in the background to counter clock drift.

## Usage

First you need to determine the clock drift of your watch in PPM (parts per million).

For example if you measure that your watch clock is too fast by 5 seconds in 24 hours,
then PPM is `5 / (24*60*60) * 1000000 = 57.9`.

Then set PPM in settings and this widget will continually adjust the clock by that amount.

## Settings

See **Basic logic** below for more details.

- **PPM x 10** - change PPM in steps of 10
- **PPM x 1** - change PPM in steps of 1
- **PPM x 0.1** - change PPM in steps of 0.1
- **Update Interval** - How often to update widget and clock error.
- **Threshold** - Threshold for adjusting clock.
  When clock error exceeds this threshold, clock update is attempted.
- **Save State** - If `On` clock error state is saved to file when widget exists, if needed.
- **Debug Log** - If `On` some debug information is logged to file `widadjust.log`.

## Display

Widget shows clock error in milliseconds and PPM.

## Basic logic

- Internal clock error counter is updated periodically (**Update Interval**)
  according to **PPM**.
- If clock error exceeds **Threshold** then clock update is attempted.
- `setTime` can only set time to full seconds. To set time more accurately
  a short delay is done until next full second, and then `setTime` is used.
- Sometimes this delay can be longer than intented, e.g. if watch is
  busy doing something else. In this case `setTime` after too long delay
  would be inaccurate and so it is skipped and retried again later.
- After skipped `setTime` the next widget update (and new clock update attempt)
  is done using **Update Interval / 4** instead of normal **Update Interval**.

Whenever this widget is restarted (e.g. when going to Launcher)
current clock error progress is by default forgotten and reset to 0.
This can cause significant inaccuracy especially with large **Update Interval** or **Threshold**.
If **Save State** is enabled then clock error progress is saved to file as needed
so that it is not forgotten when widget is restarted.

## Services

Other apps/widgets can use `WIDGETS.adjust.now()` to request current adjusted time.
To support also case where this widget isn't present, the following code can be used:

```
function adjustedNow() {
  return WIDGETS.adjust ? WIDGETS.adjust.now() : Date.now();
}
```
