#!/bin/bash
# A real ugly build script
# make sure uglifyjs is installed
echo "Running UglifyJS"
npm install uglify-js -g
uglifyjs js/dev/aws.js js/dev/dom.js js/dev/main.js --compress --mangle toplevel --screw-ie8 --lint --verbose --output js/prod/main.js
# make sure uglifycss is installed
echo "Running UglifyCSS"
npm install uglifycss -g
uglifycss css/dev/boilerplate.css > css/prod/main.css
uglifycss css/dev/normalize.css >> css/prod/main.css
uglifycss css/dev/sortable-theme-bootstrap.css >> css/prod/main.css
uglifycss css/dev/main.css >> css/prod/main.css
