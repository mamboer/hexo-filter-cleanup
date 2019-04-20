/* global hexo */
'use strict';

const Promise               = require('bluebird');
const streamToArray         = require('stream-to-array');
const minimatch             = require('minimatch');
const streamToArrayAsync    = Promise.promisify(streamToArray);

const favicons              = require('favicons');
const path                  = require('path');
const fs                    = require('fs-extra');
const assign                = require('object-assign');

const pkg                   = require('../package.json');
const utils                 = require('./utils');
const fsAccess              = Promise.promisify(fs.access);

let genFavs = (path2, cfgs) => {
    return new Promise((resolve, reject) => {
        favicons(path2, cfgs, (err, res) => {
            if(err) return reject(err);
            resolve(res);
        });
    });
};

module.exports = function() {
    let hexo = this,
        route = hexo.route,
        log = hexo.log || console,
        options = hexo.config.hfc_favicons;
    // Return if disabled.
    if (false === options.enable) return;

    let path0 = path.join(hexo.base_dir, 'source', options.src);
    let path1 = path.join(hexo.theme_dir, 'source', options.src);
    let faviconsOpts = assign({icons: options.icons}, options.opts || {});
    if (!faviconsOpts.path) {
        faviconsOpts.path = path.join(hexo.config.root, options.target);
    }
    if (!faviconsOpts.manifestRelativePaths) {
        faviconsOpts.manifestRelativePaths = faviconsOpts.path;
    }

    return fsAccess(path0).then(() => {
        return path0;
    }).catch(err => {
        return fsAccess(path1);
    }).then((path2) => {
        path2 = path2 || path1;
        log.log('%s(FAVICONS): %s', pkg.name, path2);
        return genFavs(path2, faviconsOpts);
    }).then((res) => {
        // write html data
        if (options.html) {
            fs.ensureDirSync(path.join(hexo.base_dir, 'source/_data'));
            fs.writeJSONSync(path.join(hexo.base_dir, 'source/_data/favicons.json'), res.html);
        }
        // update the routers
        let imgs = res.images || [];
        return Promise.map(imgs, (obj, idx) => {
            log.log('%s(FAVICONS): %s [generated]', pkg.name, obj.name);
            route.set(options.target + obj.name, obj.contents);
        });
    }).catch(err => {
        log.log('%s(FAVICONS): error [ %s ]', pkg.name, err);
    });
};