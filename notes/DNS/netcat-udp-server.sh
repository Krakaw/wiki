#!/bin/bash
# sudo run as root
# nc netcat
# -l listen
# -k wait for more connections
# -u udp
# -v verbose
# 0.0.0.0 listen on all interfaces
# 53 port for DNS
sudo nc -lkuv 0.0.0.0 53
