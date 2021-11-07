/* global hexo */
"use strict";

const Promise = require("bluebird");
const minimatch = require("minimatch");
const uglifyJS = require("uglify-js");
const uglifyES = require("uglify-es");
const pkg = require("../package.json");
const utils = require("./utils");
let uglify;

module.exports = function (str, data) {
  let hexo = this,
    log = hexo.log || console,
    options = hexo.config.hfc_js;
  // Return if disabled.
  if (false === options.enable) return;

  let path0 = data.path;

  if (utils.isIgnore(path0, options.exclude)) return str;

  // @todo: choose uglify engine by options.engine
  if (typeof options.engine == "string") {
    if (options.engine == "uglify-js") {
      uglify = uglifyJS;
    } else {
      uglify = uglifyES;
    }
  }

  // delete none-uglifyjs options
  delete options.enable;
  delete options.exclude;

  return new Promise(function (resolve, reject) {
    utils.isFileChanged(path0).then((yes) => {
      let rstr = "";
      if (!yes) {
        rstr = utils.getFileCache(path0);
        return resolve(rstr);
      }
      // file was changed
      let result = uglify.minify(str, options);
      // minify fails, use raw code and print warning msg
      if (result.error) {
        log.warn("%s(JS): %s Error: [ %s ], Skip minifying.", pkg.name, path0, result.error);
        return resolve(str);
      }
      let saved = (((str.length - result.code.length) / str.length) * 100).toFixed(2);
      log.log("%s(JS): %s [ %s saved]", pkg.name, path0, saved + "%");

      utils.setFileCache(path0, result.code);
      resolve(result.code);
    });
  });
};
