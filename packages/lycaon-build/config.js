const fs = require('fs');
const paths = require('./paths');
const mergeWith = require('lodash/mergeWith');

const defaults = {
    entry: {
        // main: paths.entryFile,
    },
    features: {
        cssModules: true,
        sass: false
    },
    assetPatterns: [], // list of includes for file types to process with url-loader
    // customizeWebpack: (webpackConfig) => webpackConfig
};

if (fs.existsSync(paths.entryFile)) {
    defaults.entry.main = paths.entryFile;
}

if (fs.existsSync(paths.config)) {
    const config = require(paths.config);

    // https://github.com/babel/babel/blob/master/packages/babel-core/src/helpers/merge.js
    module.exports = mergeWith({}, defaults, config, function (a, b) {
        if (b && Array.isArray(a)) {
            let newArray = b.slice(0);
            for (let item of a) {
                if (newArray.indexOf(item) < 0) {
                    newArray.push(item);
                }
            }

            return newArray;
        }
    });
} else {
    module.exports = defaults;
}
