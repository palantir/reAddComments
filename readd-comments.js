#!/usr/bin/env node

var sourceMap = require('source-map'),
    fs = require('fs'),
    us = require('underscore'),
    path = require('path');

//TODO: could be a grunt plugin
//TODO: put this in a function
//TODO: rename code to be more consistant

process.argv.slice(2).forEach(function(mapfile){
  commentedjs = reAddWithMap(mapfile);
  console.log(commentedjs);
  //fs.writeFileSync(jspath, commentedjs);
});

function reAddWithMap(mappath) {
  var mapfile = fs.readFileSync(mappath, 'utf8');
      mapdict = JSON.parse(mapfile),
      map = new sourceMap.SourceMapConsumer(mapdict);

  var jsdir = path.dirname(mappath),
      jspath = path.join(jsdir, mapdict.file),
      jslines = fs.readFileSync(jspath, 'utf8').split('\n');
      srcroot = path.resolve(jsdir, mapdict.sourceRoot);

  mapdict.sources.forEach(function(source){
    var srcpath = path.resolve(srcroot, source);
    var srclines = fs.readFileSync(srcpath, 'utf8').split('\n');
    addCommentsTo(jslines, srclines, source);
  });

  return us.flatten(jslines).join('\n');
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

