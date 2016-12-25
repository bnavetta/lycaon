# Lycaon

Lycaon is a set of tools for building frontend projects. It's basically a clone of
[create-react-app](https://github.com/facebookincubator/create-react-app/) adapted for my own preferences.

## Features

* Build with Webpack 2
* [Babel preset](packages/babel-preset-lycaon) for React, polyfilled features
  [based on browser support](https://github.com/babel/babel-preset-env), Stage 0 features, and
* React hot module reloading with [RHL 3](https://github.com/gaearon/react-hot-loader)
* [Flow](https://flowtype.org) type checking
* [ESLint configuration](packages/eslint-config-lycaon) based on [Airbnb's](https://github.com/airbnb/javascript)
  (but with a 4-space indent) and [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn/)
* [Stylelint configuration](packages/stylelint-config-lycaon) based on the [standard](https://github.com/stylelint/stylelint-config-standard)
  with enforced quoting, property order, etc.
* PostCSS compilation with [CSS Modules](https://github.com/css-modules/css-modules), Autoprefixer,
  [Flexbox fixes](https://github.com/luisrudge/postcss-flexbugs-fixes), and reporting
* Extract CSS into separate files in production
* [Jest](https://facebook.github.io/jest/) unit testing
* [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard) so "you basically work at NASA"
* [Project generator](packages/lycaon-generator) to set all this up

## Configuration

Create a file named `lycaon.config.js` in the same directory as `package.json`

```js
// lycaon.config.js
module.exports = {
    entry: {
        name: ['entry-file', 'entry-file-2'] // Webpack entry points
        // main: src/index.jsx added if src/index.jsx exists
    },
    features: {
        cssModules: true, // whether or not to enable CSS Modules
        sass: true // enable Sass (need to install node-sass, sass-loader, and resolve-url-loader)
    },
    customizeWebpack: function (webpackConfig) {
        // make any other changes here
        return webpackConfig;
    }
};
```
