/* global hexo */
"use strict";

const assign = require("object-assign");

// only apply to process with hexo
if (typeof hexo == "undefined") {
  return;
}

//module.exports = function (hexo) {
let hexoCommands = (hexo.env.args && hexo.env.args._) || [];
if (hexo.env.debug === true || hexoCommands.includes("clean")) return;
if (false === hexo.config.hasOwnProperty("filter_cleanup") || true === hexo.config.filter_cleanup) {
  // HTML Useref
  hexo.config.hfc_useref = assign(
    {
      enable: true,
      exclude: [],
      concat: true,
    },
    hexo.config.hfc_useref
  );

  // HTML minifier
  hexo.config.hfc_html = assign(
    {
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
    },
    hexo.config.hfc_html
  );

  // Css minifier
  hexo.config.hfc_css = assign(
    {
      enable: true,
      exclude: ["*.min.css"],
    },
    hexo.config.hfc_css
  );

  // Js minifier
  hexo.config.hfc_js = assign(
    {
      enable: true,
      mangle: true,
      compress: {},
      exclude: ["*.min.js"],
    },
    hexo.config.hfc_js,
    {}
  );

  // Image minifier
  hexo.config.hfc_img = assign(
    {
      enable: true,
      exclude: [],
      interlaced: false,
      multipass: false,
      optimizationLevel: 3,
      pngquant: false,
      webp: true,
      webpQuality: 75,
      gifslice: true,
      jpegtran: true,
      jpegrecompress: false,
      jpegrecompressQuality: "medium",
      optipng: true,
      svgo: true,
      progressive: false,
    },
    hexo.config.hfc_img
  );

  // Favicons
  hexo.config.hfc_favicons = assign(
    {
      enable: true,
      src: "img/logo.png",
      html: true,
      target: "img/",
      // extra favicons configs
      opts: false,
      icons: {
        // Create Android homescreen icon. `boolean`
        android: true,
        // Create Apple touch icons. `boolean`
        appleIcon: true,
        // Create Apple startup images. `boolean`
        appleStartup: false,
        // Create Opera Coast icon. `boolean`
        coast: false,
        // Create regular favicons. `boolean`
        favicons: true,
        // Create Firefox OS icons. `boolean`
        firefox: false,
        // Create Facebook OpenGraph. `boolean`
        opengraph: false,
        // Create Windows 8 tiles. `boolean`
        windows: true,
        // Create Yandex browser icon. `boolean`
        yandex: false,
      },
    },
    hexo.config.hfc_favicons
  );

  let filter = require("./lib");

  hexo.extend.filter.register("after_render:css", filter.optimizeCSS);
  hexo.extend.filter.register("after_render:js", filter.optimizeJS);
  hexo.extend.filter.register("after_init", filter.genFavicons);
  hexo.extend.filter.register("after_generate", filter.optimizeImage);
  hexo.extend.filter.register("after_generate", filter.userefHTML);
  hexo.extend.filter.register("after_generate", filter.optimizeHTML);
}
//}
