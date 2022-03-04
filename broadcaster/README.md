# ble-current-time-broadcaster

Bluetooth LE current time broadcaster for `widblesync` widget.

## Contents

- `broadcaster-rust`
    - Broadcaster written in Rust. Linux only.

## Installing as service

This has been tested in Debian 11.

- [Install Rust]
- copy this repository and go to `broadcaster-rust` directory
- run `sudo apt-get install bluez libdbus-1-dev`
- run `cargo build --release`
- copy `ble-current-time-broadcaster` from `target/release` to `/usr/local/bin`
- copy `ble-current-time-broadcaster.service` to `/lib/systemd/system`
- run following:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ble-current-time-broadcaster
sudo systemctl start  ble-current-time-broadcaster
```

### Raspberry Pi OS

Broadcaster also works in Raspberry Pi OS (Debian 11 based),
but cross-compiling can be a bit tricky.

If there is interest I can consider providing pre-compiled binary
and/or some notes on cross-compiling.

[Install Rust]: https://www.rust-lang.org/tools/install
