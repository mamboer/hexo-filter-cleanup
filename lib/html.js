/* global hexo */
"use strict";

const Promise = require("bluebird");
const streamToArray = require("stream-to-array");
const minimatch = require("minimatch");
const streamToArrayAsync = Promise.promisify(streamToArray);

const htmlMinifier = require("html-minifier").minify;
const pkg = require("../package.json");
const utils = require("./utils");
const Hexo = require("hexo");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");

const checkHTML = function (html) {
  let doc = dom.window.document.createElement("div");
  doc.innerHTML = html;
  let valid = doc.innerHTML === html;
  //console.log(valid, doc.innerHTML, html);
  return valid;
};

module.exports = function () {
  /**
   * @type {Hexo}
   */
  let hexo = this,
    route = hexo.route,
    log = hexo.log || console,
    options = hexo.config.hfc_html;
  // Return if disabled.
  if (false === options.enable) return;

  // Filter routes to select all html files.
  let routes = route.list().filter(function (path0) {
    let choose = minimatch(path0, "**/*.{htm,html}", { nocase: true });
    if (typeof options.exclude != "undefined") {
      choose = choose && !utils.isIgnore(path0, options.exclude);
    }
    if (typeof hexo.config.skip_render != "undefined") {
      // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
      choose = choose && !utils.isIgnore(path0, hexo.config.skip_render);
    }
    return choose;
  });

  // Retrieve html contents, and minify it.
  return Promise.map(routes, function (path0) {
    // Retrieve and concatenate buffers.
    let stream = route.get(path0);
    return streamToArrayAsync(stream)
      .then(function (arr) {
        return arr.join("");
      })
      .then(function (str) {
        let result = htmlMinifier(str, options);
        let len0 = str.length;
        let saved = len0 ? (((len0 - result.length) / len0) * 100).toFixed(2) : 0;
        log.log("%s(HTML): %s [ %s saved]", pkg.name, path0, saved + "%");
        route.set(path0, result);
        return result;
      });
  });
};
