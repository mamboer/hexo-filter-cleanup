/* global hexo */
'use strict';

const Promise               = require('bluebird');
const minimatch             = require('minimatch');

const useref                = require('useref');
const path                  = require('path');
const _                     = require('lodash');
const streamToArray         = require('stream-to-array');
const streamToArrayAsync    = Promise.promisify(streamToArray);

const pkg                   = require('../package.json');
const utils                 = require('./utils');


let concatAssetsForPath = (hexo, rpath, assets) => {
    let log = hexo.log || console.log;
    let route = hexo.route;
    let rpath1 = path.join(hexo.theme_dir, 'source', rpath);

    return Promise.map(assets, (val) => {
        val = route.get(route.format(val));
        if(!val) return Promise.resolve('');
        return utils.streamToString(val);
    }).then(function(data) {

        if (route._exists(rpath)) {
            return {
                url: rpath,
                path: rpath1
            };
        }

        data = data.join('');
        log.log('%s(USEREF): %s', pkg.name, rpath);
        route.set(rpath, data);
        return {
            url: rpath,
            path: rpath1
        };
    });
};

let concatAssets = (hexo, userefObj) => {
    if(typeof userefObj === 'undefined') return Promise.resolve(false);
    let concats = [];
    for (let obj in userefObj) {
        concats.push(concatAssetsForPath(hexo, hexo.route.format(obj), userefObj[obj].assets));
    }
    return Promise.all(concats);
};

module.exports = function() {
    let hexo = this,
        options = hexo.config.hfc_useref,
        route = hexo.route,
        log = hexo.log || console.log;

    // extend route object
    route._exists = function(path0) {
        var robj = this.routes[this.format(path0)];
        if (robj) return true;
        return false;
    };

    // Return if disabled.
    if (false === options.enable) return;

    // Filter routes to select all html files.
    let routes = route.list().filter(function (path0) {
        let choose = minimatch(path0, '**/*.{htm,html}', { nocase: true }) && !utils.isIgnore(path0, options.exclude);
        return  choose;
    });

    
    // Retrieve html contents, and minify it.
    return Promise.map(routes, function (path0) {
        // Retrieve and concatenate buffers.
        let stream = route.get(path0);
        return streamToArrayAsync(stream)
            .then(function (arr) {
                return arr.join('');
            }).then(function (str) {
                let result = useref(str);
                let str1 = result[0];
                let userefData = result[1];

                if (!(userefData.js || userefData.css)) {
                    return str1;
                }

                //update the router
                route.set(path0, str1);

                if (!options.concat) {
                    return str1;
                }

                // do the concatenation job
                let concatJobs = {
                    'js': concatAssets(hexo, userefData.js), 
                    'css': concatAssets(hexo, userefData.css)
                };
                //save the concat data
                Promise.props(concatJobs);
                return str1;

            });
    });
};