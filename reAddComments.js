#!/usr/bin/env node

var sourceMap = require('source-map'),
    fs = require('fs'),
    us = require('underscore'),
    path = require('path');

//TODO: could be a grunt plugin
//TODO: put this in a function
//TODO: rename code to be more consistant

process.argv.slice(2).forEach(function(mapfile){
  var commented = reAddWithMap(mapfile);
  console.log(commented.code);
  //fs.writeFileSync(commented.generatedFile, commented.code);
});

function reAddWithMap(mappath) {
  var mapfile = fs.readFileSync(mappath, 'utf8');
      mapdict = JSON.parse(mapfile),
      map = new sourceMap.SourceMapConsumer(mapdict);

  var genDir = path.dirname(mappath),
      genPath = path.join(genDir, mapdict.file),
      genLines = fs.readFileSync(genPath, 'utf8').split('\n');
      srcRoot = path.resolve(genDir, mapdict.sourceRoot);

  mapdict.sources.forEach(function(source){
    var srcPath = path.resolve(srcRoot, source);
    var srcLines = fs.readFileSync(srcPath, 'utf8').split('\n');
    addCommentsTo(genLines, srcLines, source);
  });

  return {code: us.flatten(genLines).join('\n'), generatedFile: genPath};
}


//TODO: ignore comments in block comments
function addCommentsTo(generatedLines, sourceLines, sourcePath) {
  for (var csLineNum = 0; csLineNum < sourceLines.length; csLineNum++) {
    var csline = sourceLines[csLineNum];
    var comment_match = csline.match(/#(|#|#[^#].*|[^#{].*)$/);

    if (comment_match === null) continue;
    var comment = comment_match[1];
    var comment_start = comment_match.index;
    var commentIsOnOwnLine = !!csline.match(/^\s*#(|#|#[^#].*|[^#{].*)/);

    var genLine = map.generatedPositionFor({
      source: sourcePath,
      line: csLineNum + 1,         // file lines are 1-indexed
      column: comment_start + 1    // file columns are 1-indexed
    }).line - 1;                   // file lines are 1-indexed

    var firstCommentOnLine = false;
    if (!us.isArray(generatedLines[genLine])) {
      firstCommentOnLine = true;
      generatedLines[genLine] = [generatedLines[genLine]];
    }

    if (firstCommentOnLine && !commentIsOnOwnLine) {
      generatedLines[genLine] += '  //' + comment;
    } else {
      var indent = generatedLines[genLine][0].match(/^(\s*)/)[1];
      generatedLines[genLine].push(indent + '//'+ comment);
    }
  }
}

