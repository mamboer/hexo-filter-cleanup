/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const uglifyJS      = require('uglify-js');
const pkg           = require('../package.json');
const utils         = require('./utils');
const cache         = {};

module.exports = function(str, data) {
    let hexo = this,
        log = hexo.log || console,
        options = hexo.config.hfc_js;
    // Return if disabled.
    if (false === options.enable) return;

    let path0 = data.path;

    if(utils.isIgnore(path0)) return str;

    // check the cache
    let cacheData = cache[path0];
    if(typeof cacheData !== 'undefined') {
        return cacheData;
    }

    let result = uglifyJS.minify(str, options);
    let saved = ((str.length - result.code.length) / str.length * 100).toFixed(2);
    log.log('%s(JS): %s [ %s saved]', pkg.name, path0, saved + '%');

    cache[path0] = result.code;

    return result.code;
};