#!/bin/sh
# Run on a development host without OpenWrt services.
set -eu
cd "$(dirname "$0")/.."
functions=$(sed '/^\. \/lib\/functions.sh$/d; /^load_config$/,$d' root/usr/libexec/cqu-autologin)
eval "$functions"
log() { :; }
sleep() { :; }
online() { [ "$v4" -eq 1 ]; }
online6() { [ "$v6" -eq 1 ]; }
login() { logins=$((logins + 1)); }
ubus() { calls="$calls $*"; }
reset() {
	failures=0 failures6=0 logins=0 calls=''
	ipv6_enabled=1 failure_threshold=2 retry_delay=0
	network=wan ipv6_network=wan6
}
reset
v4=1 v6=0
check_connectivity || exit 1
[ -z "$calls" ]
check_connectivity || exit 1
[ "$calls" = ' call network.interface.wan6 down call network.interface.wan6 up' ]
[ "$logins" -eq 0 ]
reset
v4=0 v6=0
check_connectivity || exit 1
check_connectivity || exit 1
[ "$logins" -eq 1 ] && [ -z "$calls" ]
reset
v4=0 v6=1
check_connectivity || exit 1
check_connectivity || exit 1
[ "$logins" -eq 1 ] && [ -z "$calls" ]
reset
v4=1 v6=0
check_connectivity || exit 1
v6=1
check_connectivity || exit 1
[ "$failures6" -eq 0 ] && [ -z "$calls" ]
reset
ipv6_enabled=0 v4=1 v6=0
check_connectivity || exit 1
check_connectivity || exit 1
[ "$failures6" -eq 0 ] && [ -z "$calls" ]
reset
ipv6_network=wan v4=1 v6=0
check_connectivity || exit 1
check_connectivity || exit 1
[ -z "$calls" ]
printf '%s\n' 'Connectivity tests passed'
