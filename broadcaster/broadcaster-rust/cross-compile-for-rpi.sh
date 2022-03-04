#!/usr/bin/env bash

# - cross-compiles for Raspberry Pi
# - tested on Debian 11

# SETUP
#
# rustup target add armv7-unknown-linux-gnueabihf
# sudo dpkg --add-architecture armhf
# sudo apt-get update
# sudo apt-get install gcc-arm-linux-gnueabihf libdbus-1-dev:armhf

set -euo pipefail

export CARGO_TARGET_ARMV7_UNKNOWN_LINUX_GNUEABIHF_LINKER=arm-linux-gnueabihf-gcc
export PKG_CONFIG_ALLOW_CROSS=1
export PKG_CONFIG_LIBDIR_armv7_unknown_linux_gnueabihf=/usr/lib/arm-linux-gnueabihf/pkgconfig

cargo build --release --target armv7-unknown-linux-gnueabihf
