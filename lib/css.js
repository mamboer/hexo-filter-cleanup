/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const cleanCSS      = require('clean-css');
const pkg           = require('../package.json');
const utils         = require('./utils');

module.exports = function(str, data) {
    
    let hexo = this,
        log = hexo.log || console.log,
        options = hexo.config.hfc_css;
    // Return if disabled.
    if (false === options.enable) return;

    let path0 = data.path;

    if(utils.isIgnore(path0)) return str;

    return new Promise(function (resolve, reject) {
        new cleanCSS(options).minify(str, function (err, result) {
            if (err) return reject(err);
            let saved = ((str.length - result.styles.length) / str.length * 100).toFixed(2);
            log.log('%s(CSS): %s [ %s saved]', pkg.name, path0, saved + '%');
            resolve(result.styles);
        });
    });

};
