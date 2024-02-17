#!/bin/bash

NEW_VERSION=$(jq -r '.version' package.json | awk -F. -v OFS=. '{$NF += 1 ; print}')
jq --arg a "$NEW_VERSION" '.version=$a' package.json > package.json.new
mv package.json.new package.json