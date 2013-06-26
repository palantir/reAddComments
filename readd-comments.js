#!/usr/bin/env node

var sourceMap = require('source-map'),
    fs = require('fs'),
    us = require('underscore'),
    path = require('path');

//TODO: could be a grunt plugin
//TODO: put this in a function
//TODO: rename code to be more consistant

process.argv.slice(2).forEach(function(mapfile){
  commentedjs = readdWithMap(mapfile);
  console.log(commentedjs);
  //fs.writeFileSync(jspath, commentedjs);
});

function readdWithMap(mappath) {
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

var comment_regex = /#(|[^{#].*|#[^#].*)$/

//TODO: find if comments are on their own line, if so, put them on their own line
//TODO: ignore string interpolations
//TODO: ignore comments in block comments
function addCommentsTo(generatedLines, sourceLines, sourcePath) {
  for (var csLineNum = 0; csLineNum < sourceLines.length; csLineNum++) {
    var csline = sourceLines[csLineNum];
    var comment_start = csline.indexOf('#');

    if (comment_start === -1) continue;
    var comment = csline.slice(comment_start + 1);

    //disable multiline comments -- coffee hanldes them
    if (comment.slice(0,2) === '##') continue;

    var genPosition = map.generatedPositionFor({
      source: sourcePath,
      line: csLineNum + 1,         // file lines are 1-indexed
      column: comment_start + 1    // file columns are 1-indexed
    });
    var genLine = generatedLines[genPosition.line - 1];
    if (!us.isArray(genLine)) {
      generatedLines[genPosition.line - 1] = [genLine + '  //' + comment];
    } else {
      var indent = genLine[0].match(/^(\s*)/)[1];
      generatedLines[genPosition.line - 1].push(indent + '//'+ comment);
    }
  }
}

