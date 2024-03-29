#!/bin/bash

echo ""

echo "killing pm2 process..."
pm2 stop ranger-server

echo "move to deploy folder..."
cd /var/www/ranger

echo "updating from github..."
git pull

echo "installing dependencies..."
npm ci

echo "building app..."
npm run build

echo "starting server..."
pm2 start server/ranger-server.mjs