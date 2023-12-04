#!/usr/bin/env bash

set -x

export CMD_PATH=$(cd `dirname $0`; pwd)
cd $CMD_PATH

git_version=$(git rev-parse --short HEAD)

apt-get update -y
apt-get install openssh-client -y 
apt-get install curl -y 
apt-get install rsync -y
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt install nodejs -y
apt-get install build-essential -y
apt install make -y
npm install && npm cache --force clean;
npm run build
cd build/

rsync -avz --progress ./ /var/www/html/bahikhata/dev/app
sudo chmod -R a+rwx /var/www/html/bahikhata/dev/api/images
echo $git_version > /var/www/html/bahikhata/dev/app/deploy_version.txt


cat /var/www/html/bahikhata/dev/app/deploy_version.txt

