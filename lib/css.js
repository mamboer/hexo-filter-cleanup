/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const cleanCSS      = require('clean-css');
const pkg           = require('../package.json');

const cache         = {};


module.exports = function(str, data) {
    
    let hexo = this,
        options = hexo.config.css_minifier;
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
        log.log('%s(CSS): %s [cached]', pkg.name, path);
        return cacheData;
    }

    return new Promise(function (resolve, reject) {
        new cleanCSS(options).minify(str, function (err, result) {
            if (err) return reject(err);
            let saved = ((str.length - result.styles.length) / str.length * 100).toFixed(2);
            cache[path] = result.styles;
            resolve(result.styles);
            log.log('%s(CSS): %s [ %s saved]', pkg.name, path, saved + '%');
        });
    });

};