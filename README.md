# reAddComments

> Re-add comments to generated files from their CoffeeScript source files via sourcemap.

## Getting Started

reAddComments a sourcemap (.map) file, looks at the generated JavaScript file and the CoffeeScript source file(s) it's associated with, and adds comments from the sources to the generated file.  If multiple .map are passed in one invocation, reAddComments will process each one individually.  Common usage may be

```bash
reAddComments lib/*.map
```

reAddComments is only as accurate as the sourcemap allows it to be, so it does a good job most of the time, but does occassionally misplace comments.  If you are using it to migrate a code base away from CoffeeScript, you will probably want to look through the files to make sure the comments are in the right place and move the few that wrong.

Comments that start with `#{` are ignored.


## Release History
_(Nothing yet)_

## Authors #

[Jared Pochtar](https://github.com/jaredp)

---

Copyright 2013 Palantir Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
