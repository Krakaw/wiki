#!/bin/bash

SRC=$1
DEST=$2

if [[ -z $SRC || -z $DEST ]]; then
  echo "$0 source_user destination_user"
  exit 1
fi

if [[ $SRC = $DEST ]]; then
  echo "Source and destination users must be unique"
  exit 1
fi
SRC_GROUPS=$(id -Gn ${SRC} | sed "s/ /,/g" | sed -r 's/\<'${SRC}'\>\b,?//g')
SRC_SHELL=$(awk -F : -v name=${SRC} '(name == $1) { print $7 }' /etc/passwd)

echo "Adding $DEST to $SRC_GROUPS with $SRC_SHELL as their shell"
sudo useradd --groups ${SRC_GROUPS} --shell ${SRC_SHELL} --create-home ${DEST}
echo "Add password for $DEST"
sudo passwd ${DEST}
echo "Done!"
