/* global hexo */
'use strict';

module.exports = {
    userefHTML: require('./useref'),
    optimizeHTML: require('./html'),
    optimizeCSS: require('./css'),
    optimizeJS: require('./js'),
    optimizeImage: require('./img')
};