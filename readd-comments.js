#!/usr/bin/env node

var sourceMap = require('source-map'),
    fs = require('fs'),
    us = require('underscore');

//TODO: get these from the .map's .file/.sources[0]

var cspath = '../samples/a.coffee',
    jspath = '../samples/a.js',
    mappath = '../samples/a.map';

var csfile = fs.readFileSync(cspath, 'utf8'),
    jsfile = fs.readFileSync(jspath, 'utf8'),
    mapfile = fs.readFileSync(mappath, 'utf8');

var cslines = csfile.split('\n'),
    jslines = jsfile.split('\n'),
    map = new sourceMap.SourceMapConsumer(mapfile);

//TODO: find if comments are on their own line, if so, put them on their own line
//TODO: ignore string interpolations
//TODO: ignore comments in block comments
//TODO: *could* be a grunt plugin

var comment_regex = /#(|[^{#].*|#[^#].*)$/

for (var csLineNum = 0; csLineNum < cslines.length; csLineNum++) {
  var csline = cslines[csLineNum];
  var comment_start = csline.indexOf('#');

  if (comment_start === -1) continue;
  var comment = csline.slice(comment_start + 1);

  //disable multiline comments -- coffee hanldes them
  if (comment.slice(0,2) === '##') continue;

  var jsposition = map.generatedPositionFor({
    source: cspath,
    line: csLineNum + 1,         // file lines are 1-indexed
    column: comment_start + 1 // file columns are 1-indexed
  });

  var jsline = jslines[jsposition.line - 1];
  if (!us.isArray(jsline)) {
    jslines[jsposition.line - 1] = [jsline + '  //' + comment];
  } else {
    var indent = jsline[0].match(/^(\s*)/)[1];
    jslines[jsposition.line - 1].push(indent + '//'+ comment);
  }
}

var commentedjs = us.flatten(jslines).join('\n');
console.log(commentedjs);
//fs.writeFileSync(jspath, commentedjs);

