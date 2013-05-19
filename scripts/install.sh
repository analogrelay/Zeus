#!/bin/bash

npm install mocha -g
npm install coffee-script -g
npm install coffee-coverage -g
npm install jake -g

pushd zeus
npm link
npm install
popd

pushd zeus-cli
npm link zeus
npm install
popd
