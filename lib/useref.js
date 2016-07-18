/* global hexo */
'use strict';

const Promise       = require('bluebird');
const minimatch     = require('minimatch');

const useref        = require('useref');

const pkg           = require('../package.json');
const cache         = {};

function streamToString(stream) {

    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk.toString());
        });
        stream.on('end', () => {
            resolve(chunks.join(''));
        });
    });
}

let concatAssets = (route, userefObj, log) => {
    if(typeof userefObj === 'undefined') return;
    
    for(let obj in userefObj) {
        let buffers = [];
        userefObj[obj].assets.forEach((val, idx) => {
            val = route.get(route.format(val));
            if(!val) return;
            buffers.push(streamToString(val));
        });

        Promise.all(buffers).then(function(data) {
            log.log('%s(USEREF): %s', pkg.name, obj);
            route.set(route.format(obj), data.join(''));
        });
    }

};

module.exports = function(str, data) {
    let hexo = this,
        options = hexo.config.html_useref,
        route = hexo.route;

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
        log.log('%s(USEREF): %s [cached]', pkg.name, path);
        return cacheData;
    }

    let result = useref(str);
    let str1 = result[0];
    let userefData = result[1];

    if(options.concat) {
        concatAssets(route, userefData.css, log);
        concatAssets(route, userefData.js, log);
    }

    cache[path] = str1;

    return str1;
};
