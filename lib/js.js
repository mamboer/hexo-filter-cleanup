/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const uglifyJS      = require('uglify-js');
const pkg           = require('../package.json');

module.exports = function(str, data) {
    let hexo = this,
        options = hexo.config.js_minifier;
    // Return if disabled.
    if (false === options.enable) return;

    let path = data.path;
    let exclude = options.exclude;
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path && exclude && exclude.length) {
        for (let i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path, exclude[i])) return str;
        }
    }

    let log = hexo.log || console;
    let result = uglifyJS.minify(str, options);
    let saved = ((str.length - result.code.length) / str.length * 100).toFixed(2);
    log.log('%s(JS): %s [ %s saved]', pkg.name, path, saved + '%');

    return result.code;
};