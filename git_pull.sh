#!/bin/bash
cd ~/zigger
git checkout .
git fetch
git pull
npm run install
npm run reload
chmod +x ~/zigger/*.sh