/* global hexo */
"use strict";

const minimatch = require("minimatch");
const Promise = require("bluebird");
const md5File = require("md5-file/promise");
const md5Cache = {};
const fileCache = {};

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
    stream.on("data", (chunk) => {
      chunks.push(chunk.toString());
    });
    stream.on("end", () => {
      resolve(chunks.join(""));
    });
  });
}

function isFileChanged(filePath) {
  return md5File(filePath)
    .then((hash1) => {
      let hash = md5Cache[filePath];
      md5Cache[filePath] = hash1;
      if (!hash) {
        return true;
      }
      if (hash === hash1) {
        return false;
      }
      return true;
    })
    .catch((err) => {
      return true;
    });
}

function getFileCache(filePath, defaultData) {
  let cache = fileCache[filePath] || defaultData;
  return cache;
}

function setFileCache(filePath, newData) {
  fileCache[filePath] = newData;
}

module.exports = {
  isIgnore: isIgnore,
  streamToString: streamToString,
  isFileChanged: isFileChanged,
  getFileCache: getFileCache,
  setFileCache: setFileCache,
};
