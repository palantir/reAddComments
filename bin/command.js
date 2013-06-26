#!/usr/bin/env node

var reAdder = require('../lib/reAddComments');
process.argv.splice(2).forEach(reAdder.reAddAndWrite);
