#!/usr/bin/env sh

set -e
export PATH=node_modules/.bin:$PATH

clear
node dist/index.js
