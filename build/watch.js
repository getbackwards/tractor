'use strict';

// Config:
var config = require('./config');

// Utilities:
var gulp = require('gulp');

module.exports = watch;

console.log(config.serverDir);

function watch (reportTaskDone) {
    gulp.watch(config.serverDir + '/**/*', ['test-server']);
    gulp.watch(config.appDir + '/**/*', ['test-client']);
    gulp.watch(config.stylesDir + '/**/*', ['styles']);
    gulp.watch(config.imagesDir + '/**/*', ['images']);
    gulp.watch(config.src + 'index.html', ['markup']);
    reportTaskDone();
}
