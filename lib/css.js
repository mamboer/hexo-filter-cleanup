/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const cleanCSS      = require('clean-css');
const pkg           = require('../package.json');
const utils         = require('./utils');

const cache         = {};


module.exports = function(str, data) {
    
    let hexo = this,
        log = hexo.log || console.log,
        options = hexo.config.hfc_css;
    // Return if disabled.
    if (false === options.enable) return;

    let path0 = data.path;

    if(utils.isIgnore(path0)) return str;

    // check the cache
    let cacheData = cache[path0];
    if(typeof cacheData !== 'undefined') {
        return cacheData;
    }

    return new Promise(function (resolve, reject) {
        new cleanCSS(options).minify(str, function (err, result) {
            if (err) return reject(err);
            let saved = ((str.length - result.styles.length) / str.length * 100).toFixed(2);
            cache[path0] = result.styles;
            resolve(result.styles);
            log.log('%s(CSS): %s [ %s saved]', pkg.name, path0, saved + '%');
        });
    });

};