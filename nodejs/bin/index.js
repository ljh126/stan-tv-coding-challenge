#!/usr/bin/env node
const minimist = require('minimist');

const startClientApp = require('../client-app');
const startServerApp = require('../server-app');

const { interval, file } = minimist(process.argv.slice(2));

startServerApp({ interval, file });
startClientApp();
