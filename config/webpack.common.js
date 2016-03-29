// ```
// @datatype_void
// david.r.niciforovic@gmail.com
// webpack.common.js may be freely distributed under the MIT license
// ```

var webpack = require('webpack');
var helpers = require('./helpers');

//# Webpack Plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

//# Webpack Constants
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  title: 'Angular 2 MEAN Webpack Starter Kit by @datatype_void',
  baseUrl: '/',
  host: '0.0.0.0',
  port: 8080,
  ENV: ENV,
  HMR: HMR
};

//# Webpack Configuration
//
// See: http://webpack.github.io/docs/configuration.html#cli
var config = {};

// Static metadata for index.html
//
// See: (custom attribute)
config.metadata = METADATA;

// Cache generated modules and chunks to improve performance for multiple incremental builds.
// This is enabled by default in watch mode.
// You can pass false to disable it.
//
// See: http://webpack.github.io/docs/configuration.html#cache
// cache: false,

// The entry point for the bundle
// Our Angular.js app
//
// See: http://webpack.github.io/docs/configuration.html#entry
config.entry = {

  'polyfills': './src/polyfills.ts',
  'vendor': './src/vendor.ts',
  // Our primary Angular 2 application
  'main': './src/main.browser.ts',

};

// Options affecting the resolving of modules.
//
// See: http://webpack.github.io/docs/configuration.html#resolve
config.resolve = {

  // An array of extensions that should be used to resolve modules.
  //
  // See: http://webpack.github.io/docs/configuration.html#resolve-extensions
  extensions: ['', '.ts', '.js', '.scss'],

  // Ensure that root is `src`
  root: helpers.root('src'),

};

// Options affecting the normal modules.
//
// See: http://webpack.github.io/docs/configuration.html#module
config.module = {

  // An array of applied pre and post loaders.
  //
  // See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
  preLoaders: [

    // Tslint loader support for *.ts files
    //
    // See: https://github.com/wbuchwalter/tslint-loader
    // { test: /\.ts$/, loader: 'tslint-loader', exclude: [ helpers.root('node_modules') ] },

    // Source map loader support for *.js files
    // Extracts SourceMaps for source files that as added as sourceMappingURL comment.
    //
    // See: https://github.com/webpack/source-map-loader
    {
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: [
        // these packages have problems with their sourcemaps
        helpers.root('node_modules/rxjs'),
        helpers.root('node_modules/@angular2-material')
      ]
    }

  ],

  // An array of automatically applied loaders.
  //
  // IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
  // This means they are not resolved relative to the configuration file.
  //
  // See: http://webpack.github.io/docs/configuration.html#module-loaders
  loaders: [

    // Typescript loader support for .ts and Angular 2 async routes via .async.ts
    //
    // See: https://github.com/s-panferov/awesome-typescript-loader
    {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      exclude: [/\.(spec|e2e)\.ts$/]
    },

    // Json loader support for *.json files.
    //
    // See: https://github.com/webpack/json-loader
    {
      test: /\.json$/,
      loader: 'json-loader'
    },

    // Raw loader support for *.css files
    // Returns file content as string
    //
    // See: https://github.com/webpack/raw-loader
    {
      test: /\.css$/,
      loader: 'raw-loader'
    },

    // Raw loader support for *.html
    // Returns file content as string
    //
    // See: https://github.com/webpack/raw-loader
    {
      test: /\.html$/,
      loader: 'raw-loader',
      exclude: [helpers.root('src/index.html')]
    },

    // Support for sass imports
    // Add CSS rules to your document:
    // `require("!style!css!sass!./file.scss");`
    {
      test: /\.scss$/,
      loader: 'style!css!autoprefixer-loader?browsers=last 2 versions!sass',
      exclude: [ helpers.root('node_modules') ]
    }

  ]

};

// Add additional plugins to the compiler.
//
// See: http://webpack.github.io/docs/configuration.html#plugins
config.plugins = [

  // Plugin: ForkCheckerPlugin
  // Description: Do type checking in a separate process, so webpack don't need to wait.
  //
  // See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
  new ForkCheckerPlugin(),

  // Plugin: OccurenceOrderPlugin
  // Description: Varies the distribution of the ids to get the smallest id length
  // for often used ids.
  //
  // See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
  // See: https://github.com/webpack/docs/wiki/optimization#minimize
  new webpack.optimize.OccurenceOrderPlugin(true),

  // Plugin: CommonsChunkPlugin
  // Description: Shares common code between the pages.
  // It identifies common modules and put them into a commons chunk.
  //
  // See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
  // See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
  new webpack.optimize.CommonsChunkPlugin({
    name: ['main', 'vendor', 'polyfills'],
    minChunks: Infinity
  }),

  // Plugin: CopyWebpackPlugin
  // Description: Copy files and directories in webpack.
  //
  // Copies project static assets.
  //
  // See: https://www.npmjs.com/package/copy-webpack-plugin
  new CopyWebpackPlugin([{
    from: 'src/assets',
    to: 'assets'
  }]),

  // Plugin: HtmlWebpackPlugin
  // Description: Simplifies creation of HTML files to serve your webpack bundles.
  // This is especially useful for webpack bundles that include a hash in the filename
  // which changes every compilation.
  //
  // See: https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    chunksSortMode: 'none'
  }),

  // Plugin: DefinePlugin
  // Description: Define free variables.
  // Useful for having development builds with debug logging or adding global constants.
  //
  // Environment helpers
  //
  // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
  // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
  new webpack.DefinePlugin({
    'ENV': JSON.stringify(METADATA.ENV),
    'HMR': HMR
  })

];

// Include polyfills or mocks for various node stuff
// Description: Node configuration
//
// See: https://webpack.github.io/docs/configuration.html#node
config.node = {
  global: 'window',
  crypto: 'empty',
  module: false,
  clearImmediate: false,
  setImmediate: false
};


module.exports = config;
