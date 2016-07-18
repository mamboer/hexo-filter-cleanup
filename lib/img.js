/* global hexo */
'use strict';

const Promise           = require('bluebird');
const minimatch         = require('minimatch');

const imagemin          = require('imagemin');
const webpmin           = require('imagemin-webp');
const pngquant          = require('imagemin-pngquant');
const gifsicle          = require('imagemin-gifsicle');
const jpegtran          = require('imagemin-jpegtran');
const optipng           = require('imagemin-optipng');
const svgo              = require('imagemin-svgo');
const jpegrecompress    = require('imagemin-jpeg-recompress');

const streamToArray     = require('stream-to-array');

const streamToArrayAsync = Promise.promisify(streamToArray);
const pkg               = require('../package.json');


module.exports = function() {
    // Init.
    let hexo = this,
        options = hexo.config.image_minifier,
        route = hexo.route;

    // Return if disabled.
    if (false === options.enable) return;

    // Filter routes to select all images.
    let routes = route.list().filter(function (path) {
        return minimatch(path, '**/*.{gif,jpg,png,svg,webp}', { nocase: true });
    });

    let log = hexo.log || console;
    // Retrieve image contents, and minify it.
    return Promise.map(routes, function (path) {
        // Retrieve and concatenate buffers.
        let stream = route.get(path);
        return streamToArrayAsync(stream)
            .then(function (arr) {
                return Buffer.concat(arr);
            }).then(function (buffer) {
                // Create the Imagemin instance.
                let imageminOption = {
                    plugins: []
                };

                if (options.gifsicle) {
                    imageminOption.plugins.push(gifsicle({ interlaced: options.interlaced }));
                }

                if (options.jpegtran) {
                    imageminOption.plugins.push(jpegtran({ progressive: options.progressive }));
                }

                if (options.optipng) {
                    imageminOption.plugins.push(optipng({ optimizationLevel: options.optimizationLevel }));
                }

                if (options.svgo) {
                    imageminOption.plugins.push(svgo({ multipass: options.multipass }));
                }

                if (options.webp) {
                    imageminOption.plugins.push(webpmin({quality: options.webpQuality}));
                }

                // Add additional plugins.
                if (options.pngquant) { // Lossy compression.
                    imageminOption.plugins.push(pngquant());
                }

                if (options.jpegrecompress) {
                    imageminOption.plugins.push(jpegrecompress({quality: options.jpegrecompressQuality}));
                }

                return imagemin.buffer(buffer, imageminOption)
                    .then(function (newBuffer) {
                        let length = buffer.length;
                        if (newBuffer && length > newBuffer.length) {
                            let saved = ((length - newBuffer.length) / length * 100).toFixed(2);
                            log.log('%s(IMG): %s [ %s saved]', pkg.name, path, saved + '%');
                            route.set(path, newBuffer); // Update the route.
                        }
                    });
            });
    });
};