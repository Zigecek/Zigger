#!/bin/bash
npm install pm2@latest -g
npm run install
apt install brew
brew install ffmpeg
pm2 startup
npm run start
pm2 save
