#!/bin/bash

PREFIX="IPTables Dropped: "

# Create a chain to log the traffic and drop it
iptables -N LOG_DROP
# Log
iptables -A LOG_DROP -j LOG --log-prefix "$PREFIX" --log-level 6
# Drop
iptables -A LOG_DROP -j DROP

# Give the chain a name
LIMIT_CHAIN="LIMIT_CHAIN"
# Specify a protocol
LIMIT_PROTOCOL="udp"
# Specify a port
LIMIT_PORT=53535
# Give the limit a name
LIMIT_NAME="dns-connect"
# Time period for limit
LIMIT_SECONDS=60
# Hits per time period
LIMIT_HIT_COUNT=10

iptables -N "$LIMIT_CHAIN"
iptables -A "$LIMIT_CHAIN" -p "$LIMIT_PROTOCOL" --dport "$LIMIT_PORT" -m state --state NEW -m recent --set --name "$LIMIT_NAME"
iptables -A "$LIMIT_CHAIN" -p "$LIMIT_PROTOCOL" --dport "$LIMIT_PORT" -m state --state NEW -m recent --rcheck --seconds "$LIMIT_SECONDS" --hitcount "$LIMIT_HIT_COUNT" --name"$LIMIT_NAME" -j LOG_DROP
iptables -I FORWARD -j "$LIMIT_CHAIN"

