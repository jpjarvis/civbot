#!/bin/bash

cd civapi
node civapi.js > ../civapi.log &
cd ..

cd bot
node bot.js > ../bot.log &
cd ..
