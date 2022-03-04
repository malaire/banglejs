#!/usr/bin/env bash

# Requires `hcitool` and `hciconfig` from BlueZ.
# - For Debian install package `bluez`.

while true
do
    nanoseconds=$(date +%s%N)
    microseconds=${nanoseconds::-3}
    hex=$(printf '%016X' $microseconds)
    echo "$microseconds - $hex"
    sudo hciconfig hci0 leadv 3
    # - SERVICE_UUID     : 0x56A9BAE4_DE7E_490B_AEE3_C87326C10C66
    # - manufacturer data: current time in microseconds, 64 bit big endian
    sudo hcitool -i hci0 cmd 0x08 0x0008 1E \
        11 07 66 0C C1 26 73 C8 E3 AE 0B 49 7E DE E4 BA A9 56 \
        0B FF FF FF ${hex:0:2} ${hex:2:2} ${hex:4:2} ${hex:6:2} ${hex:8:2} ${hex:10:2} ${hex:12:2} ${hex:14:2}
    sleep 0.1
    sudo hciconfig hci0 noleadv
    sleep 0.9
done
