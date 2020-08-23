#!/bin/bash

REMOTE_USER=shell_is_false
REMOTE_SERVER=hostname.example.com
# Open a port on the remote server for a reverse SSH shell
REMOTE_SSH_PORT=800X
LOCAL_SSH_PORT=22

# Local port forwards
LOCAL_LISTEN_ADDRESS=localhost:7000
REMOTE_SERVICE_ADDRESS=localhost:5432

autossh \
  -o "StrictHostKeyChecking no" \
  -o "UserKnownHostsFile=/dev/null" \
  -R "localhost:${REMOTE_SSH_PORT}:localhost:${LOCAL_SSH_PORT}" \
  -R "${LOCAL_LISTEN}:${REMOTE_SERVICE_ADDRESS}" \
  "${REMOTE_USER}@${REMOTE_SERVER}" -N >> /var/log/tunnel.log &
