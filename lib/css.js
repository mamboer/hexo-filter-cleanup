/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const cleanCSS      = require('clean-css');
const pkg           = require('../package.json');


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

    var log = hexo.log || console.log;
    // var result = MoreCSS.compress(str, options.radical);
    // var saved = ((str.length - result.length) / str.length * 100).toFixed(2);
    // log.log('update Optimize CSS: %s [ %s saved]', path, saved + '%');
    // return result;

    return new Promise(function (resolve, reject) {
        new cleanCSS(options).minify(str, function (err, result) {
            if (err) return reject(err);
            let saved = ((str.length - result.styles.length) / str.length * 100).toFixed(2);
            resolve(result.styles);
            log.log('%s(CSS): %s [ %s saved]', pkg.name, path, saved + '%');
        });
    });

};