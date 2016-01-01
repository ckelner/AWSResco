#!/bin/bash
# A real ugly build script
# make sure uglifyjs is installed
echo "Running UglifyJS"
npm install uglify-js -g
uglifyjs js/aws.js js/dom.js js/main.js js/sortable.min.js --compress --mangle toplevel --screw-ie8 --lint --verbose --output main.js
# make sure uglifycss is installed
echo "Running UglifyCSS"
npm install uglifycss -g
uglifycss css/boilerplate.css > main.css
uglifycss css/normalize.css >> main.css
uglifycss css/sortable-theme-bootstrap.css >> main.css
uglifycss css/main.css >> main.css
