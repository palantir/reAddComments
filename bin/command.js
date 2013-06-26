#!/usr/bin/env node

var reAdder = require('../lib/reAddComments');

process.argv.slice(2).forEach(function(mapfile){
  var commented = reAdder.reAddWithMapFile(mapfile);
  console.log(commented.code);
  //fs.writeFileSync(commented.generatedFile, commented.code);
});
