/* global hexo */
'use strict';

const minimatch             = require('minimatch');
const Promise               = require('bluebird');

let isIgnore = (path0, exclude) => {
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path0 && exclude && exclude.length) {
        for (let i = 0, len = exclude.length; i < len; i++) {
            if (minimatch(path0, exclude[i])) return true;
        }
    }
    return false;
};

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

module.exports = {
    isIgnore: isIgnore,
    streamToString: streamToString
};