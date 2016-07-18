/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const htmlMinifier  = require('html-minifier').minify;
const pkg           = require('../package.json');
const cache         = {};


module.exports = function(str, data) {
    let hexo = this,
        options = hexo.config.html_minifier;
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

    let log = hexo.log || console.log;

    // check the cache
    let cacheData = cache[path];
    if(typeof cacheData !== 'undefined') {
        log.log('%s(HTML): %s [cached]', pkg.name, path);
        return cacheData;
    }

    let result = htmlMinifier(str, options);
    let len0 = str.length;
    let saved = len0 ? ((len0 - result.length) / len0 * 100).toFixed(2) : 0;
    log.log('%s(HTML): %s [ %s saved]', pkg.name, path, saved + '%');

    cache[path] = result;

    return result;
};