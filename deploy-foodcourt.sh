#!/bin/bash

# Inisialisasi NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /home/apps/foodcourt || exit 1
git reset --hard
git pull origin main
yes | composer update --no-interaction
yarn
yarn build
php artisan cache:clear
php artisan view:clear
php artisan config:clear
