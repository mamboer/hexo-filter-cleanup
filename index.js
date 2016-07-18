/* global hexo */
'use strict';

const assign = require('object-assign');

//module.exports = function (hexo) {
    if(hexo.env.debug === true) return;
    if (false === hexo.config.hasOwnProperty('filter_cleanup') || true === hexo.config.filter_cleanup) {

        // HTML Useref
        hexo.config.html_useref = assign({
            enable: true,
            exclude: [],
            concat: true
        }, hexo.config.html_useref);

        // HTML minifier
        hexo.config.html_minifier = assign({
            enable: true,
            exclude: [],
            ignoreCustomComments: [/^\s*more/],
            removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true,
        }, hexo.config.html_minifier);

        // Css minifier
        hexo.config.css_minifier = assign({
            enable: true,
            exclude: ['*.min.css']
        }, hexo.config.css_minifier);

        // Js minifier
        hexo.config.js_minifier = assign({
            enable: true,
            mangle: true,
            output: {},
            compress: {},
            exclude: ['*.min.js']
        }, hexo.config.js_minifier, {
                fromString: true
            });

        // Image minifier
        hexo.config.image_minifier = assign({
            enable: true,
            interlaced: false,
            multipass: false,
            optimizationLevel: 3,
            pngquant: false,
            webp: true,
            webpQuality: 75,
            gifslice: true,
            jpegtran: true,
            jpegrecompress: false,
            jpegrecompressQuality: 'medium',
            optipng: true,
            svgo: true,
            progressive: false
        }, hexo.config.image_minifier);


        let filter = require('./lib/filter');

        hexo.extend.filter.register('after_render:html', filter.userefHTML);

        hexo.extend.filter.register('after_render:html', filter.optimizeHTML);

        hexo.extend.filter.register('after_render:css', filter.optimizeCSS);

        hexo.extend.filter.register('after_render:js', filter.optimizeJS);

        hexo.extend.filter.register('after_generate', filter.optimizeImage);
    }
//}
