#!/usr/bin/env sh
#shell script that is executed in a busybox to download our web applicaation to our nginx container

DESTINATION_FOLDER="./target" 
DOWNLOAD_SUCCESS_FILE=success.txt # when this file exists the data is aleady on the volume and we do nothing

if [ -f DOWNLOAD_SUCCESS_FILE ]
then
    echo "$DOWNLOAD_SUCCESS_FILE alredy exists, skip download of $ARCHIVE_URL_TO_DOWNLOAD"
    exit 0
fi

rm -rf $DESTINATION_FOLDER
mkdir -p $DESTINATION_FOLDER

cd $DESTINATION_FOLDER
wget -O dist.tgz $ARCHIVE_URL_TO_DOWNLOAD
cd ..
