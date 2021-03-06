# Hexo-filter-cleanup

[![npm version][npm-version-image]][download-url]
[![NPM Dependencies][npm-dep-image]][npm-dep-url]
[![NPM DevDependencies][npm-devdep-image]][npm-devdep-url]
[![npm download][download-image]][download-url]

[npm-version-image]: https://badge.fury.io/js/hexo-filter-cleanup.svg
[npm-dep-image]: https://david-dm.org/mamboer/hexo-filter-cleanup.svg
[npm-dep-url]: https://david-dm.org/mamboer/hexo-filter-cleanup
[npm-devdep-image]: https://david-dm.org/mamboer/hexo-filter-cleanup/dev-status.svg
[npm-devdep-url]: https://david-dm.org/mamboer/hexo-filter-cleanup?type=dev
[download-image]: https://img.shields.io/npm/dm/hexo-filter-cleanup.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/hexo-filter-cleanup

> This project is inspired by [hexo-all-minifier](https://github.com/unhealthy/hexo-all-minifier).

I completely re-wrote this hexo filter plugin because `hexo-all-minifier` has certain issues as below which sucks my hexo project on mac osx platform. Besides that i have added some other cool features like `useref` and `performance` improvements.

- [submodule bug](https://github.com/unhealthy/hexo-all-minifier/issues/12)

All in one. Minifier & Optimization plugin for [Hexo](https://hexo.io).

## Installation

``` bash
$ npm install hexo-filter-cleanup --save
```

or with yarn,

```bash
yarn add hexo-filter-cleanup
```

## Features

Integrate all the official minifier plugins of HEXO and some other optimization plugins:

- [hexo-html-minifier](https://github.com/hexojs/hexo-html-minifier), which is based on [HTMLMinifier](https://github.com/kangax/html-minifier)
- [hexo-clean-css](https://github.com/hexojs/hexo-clean-css), which is based on [clean-css](https://github.com/jakubpawlowicz/clean-css)
- [hexo-uglify](https://github.com/hexojs/hexo-uglify), which is based on [UglifyJS](http://lisperator.net/uglifyjs/)
- [hexo-imagemin](https://github.com/vseventer/hexo-imagemin), which is based on [imagemin](https://github.com/imagemin/imagemin)
- [useref](https://www.npmjs.com/package/useref), let hexo parse build blocks in html files.
- [favicons](https://github.com/haydenbleasel/favicons), generate favicons on the fly.

Thanks for their works.

## Options

``` yaml
hfc_useref:
  enable: true
  concat: true
  exclude: 
```
- **enable** - Enable the plugin. Defaults to `true`.
- **exclude**: Exclude files
- **concat**: concat the referenced files automatically.

----------

``` yaml
hfc_html:
  enable: true
  exclude: 
```
- **enable** - Enable the plugin. Defaults to `true`.
- **exclude**: Exclude files

----------

``` yaml
hfc_css:
  enable: true
  exclude: 
    - '*.min.css'
```
- **enable** - Enable the plugin. Defaults to `true`.
- **exclude**: Exclude files

----------

``` yaml
hfc_js:
  enable: true
  mangle: true
  compress:
  exclude: 
    - '*.min.js'
```
- **enable** - Enable the plugin. Defaults to `true`.
- **mangle**: Mangle file names
- **compress**: Compress [options](https://www.npmjs.com/package/uglify-js#compress-options)
- **exclude**: Exclude files

----------

```yaml
hfc_img:
  enable: true
  interlaced: false
  multipass: false
  optimizationLevel: 2
  pngquant: false
  progressive: false
  webp: true
  webpQuality: 75
  gifslice: true
  jpegtran: true
  jpegrecompress: false
  jpegrecompressQuality: 'medium'
  optipng: true
  svgo: true
```
- **enable** - Enable the plugin. Defaults to `true`.
- **interlaced** - Interlace gif for progressive rendering. Defaults to `false`.
- **multipass** - Optimize svg multiple times until it’s fully optimized. Defaults to `false`.
- **optimizationLevel** - Select an optimization level between 0 and 7. Defaults to `2`.
- **pngquant** - Enable [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant) plugin. Defaults to `false`.
- **progressive** - Lossless conversion to progressive. Defaults to `false`.

```yaml
hfc_favicons:
  enable: true
  src: img/logo.png
  target: img/
  html: true
  opts: false
  icons:
    android: true
    appleIcon: true
    appleStartup: false
    coast: false
    favicons: true
    firefox: false
    opengraph: false
    windows: true
    yandex: false
```
- **enable** - Enable the plugin. Defaults to `true`.
- **src** - Favicon file path.
- **target** - Where we put the generated files. Defaults to `img` folder.
- **html** - Whether generate the html data in the `_data` folder for further usage. Defaults to `true`. See [an example](https://github.com/o2team/o2team.github.io/tree/v2/themes/lattice/layout/_partial/common/favicons.swig).
- **opts** - Extra [favicons configurations](https://github.com/itgalaxy/favicons). Defaults to `false`
- **icons** - Icons configurations.

## Debug Mode

The debug mode will disable all the optimizations.

You can active the debug mode by using hexo's `--debug` switch as below.

```
hexo s --watch --debug
```

Todo: Tests
